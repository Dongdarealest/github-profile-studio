// GET /api/sky?username=octocat&color=A98B4F&bg=0D1117&text=E6EDF3
// "Your Sky" — the last 90 days of pushes rendered as a night-sky artwork.
// One star per push, banded by date; the top repositories become named
// constellations. Layout is seeded from the username, so the same user
// always gets the same sky.
function hex(v, fallback) {
  const s = String(v || fallback).replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(s) ? s : fallback;
}
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
const GH = { "User-Agent": "github-profile-studio", Accept: "application/vnd.github+json" };
const DAY = 86400000;
function dayKey(t) { return new Date(t).toISOString().slice(0, 10); }
async function gh(url) {
  try {
    const r = await fetch(url, { headers: GH });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}
// PushEvent counts per day for the last 90 days, oldest first.
async function pushCounts90(username) {
  const today = new Date(dayKey(Date.now()) + "T00:00:00Z").getTime();
  const counts = new Array(90).fill(0);
  const index = new Map();
  for (let i = 0; i < 90; i++) index.set(dayKey(today - (89 - i) * DAY), i);
  for (let page = 1; page <= 3; page++) {
    const evs = await gh(`https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`);
    if (!Array.isArray(evs) || !evs.length) break;
    for (const ev of evs) {
      if (ev.type !== "PushEvent" || !ev.created_at) continue;
      const idx = index.get(dayKey(new Date(ev.created_at).getTime()));
      if (idx !== undefined) counts[idx]++;
    }
    if (evs.length < 100) break;
  }
  return counts;
}
// Top 5 non-fork repos by stars, plus the display name.
async function topRepos(username) {
  const [u, rs] = await Promise.all([
    gh(`https://api.github.com/users/${username}`),
    gh(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`),
  ]);
  if (!u || u.message) throw new Error("not found");
  const repos = (Array.isArray(rs) ? rs : [])
    .filter(r => !r.fork && r.name.toLowerCase() !== username.toLowerCase())
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
      || new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 5)
    .map(r => r.name);
  return { name: u.name || username, repos };
}
// Deterministic PRNG seeded from the username (mulberry32 over an FNV hash).
function seededRandom(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function lift(hexStr, amt) {
  const n = parseInt(hexStr, 16);
  const f = v => Math.min(255, v + amt);
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0").toUpperCase();
}
export function errorSvg(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="120" viewBox="0 0 900 120">
  <rect width="900" height="120" rx="10" fill="#0D1117" stroke="#FB7185"/>
  <text x="450" y="68" text-anchor="middle" font-family="Verdana, sans-serif" font-size="16" fill="#FFE4E6">${esc(msg)}</text>
</svg>`;
}
export function skySvg({ username, name, counts, repos, color, bg, text }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), tx = hex(text, "E6EDF3");
  const horizon = lift(b, 16);
  const rand = seededRandom(username.toLowerCase());
  const total = counts.reduce((s, n) => s + n, 0);
  const activeDays = counts.filter(n => n > 0).length;

  // Faint seeded dust, always present (the sparse sky for quiet users).
  let dust = "";
  for (let i = 0; i < 46; i++) {
    const x = (14 + rand() * 872).toFixed(1), y = (12 + rand() * 316).toFixed(1);
    const r = (0.5 + rand() * 0.6).toFixed(2), o = (0.12 + rand() * 0.22).toFixed(2);
    dust += `<circle cx="${x}" cy="${y}" r="${r}" fill="#${tx}" opacity="${o}"/>`;
  }

  // Activity stars: one per push, banded horizontally by date, capped ~260.
  const scale = total > 0 ? Math.min(1, 260 / total) : 0;
  const brightest = [...counts].sort((x, y) => y - x).slice(0, 3).filter(n => n > 0);
  let stars = "", placed = 0;
  counts.forEach((n, day) => {
    let k = Math.round(n * scale);
    if (n > 0 && k < 1) k = 1;
    const sparkleDay = brightest.includes(n) && n > 0;
    for (let i = 0; i < k && placed < 260; i++, placed++) {
      const x = Math.max(10, Math.min(890, 34 + (day / 89) * 832 + (rand() - 0.5) * 26)).toFixed(1);
      const y = (16 + rand() * 312).toFixed(1);
      const r = ((0.8 + rand() * 1.4) * (0.7 + Math.min(n, 10) / 10 * 0.6)).toFixed(2);
      const o = (0.35 + rand() * 0.65).toFixed(2);
      stars += `<circle cx="${x}" cy="${y}" r="${r}" fill="#${tx}" opacity="${o}"/>`;
      if (sparkleDay && i === 0) {
        const sx = Number(x), sy = Number(y), L = 7;
        stars += `<path d="M ${sx - L} ${sy} H ${sx + L} M ${sx} ${sy - L} V ${sy + L}" stroke="#${tx}" stroke-width="0.8" opacity="0.75"/>`;
      }
    }
  });

  // Constellations: one per top repo, centres slotted to avoid the moon
  // (top-right) and the title block (bottom-left).
  const slots = [[168, 92], [392, 158], [566, 78], [706, 196], [286, 238]];
  let constellations = "";
  repos.forEach((repo, i) => {
    const [cx, cy] = slots[i % slots.length];
    const jx = cx + (rand() - 0.5) * 44, jy = cy + (rand() - 0.5) * 30;
    const pts = [];
    const nPts = 4 + Math.floor(rand() * 3);
    for (let j = 0; j < nPts; j++) {
      const ang = rand() * Math.PI * 2, rad = j === 0 ? 0 : 26 + rand() * 30;
      pts.push([jx + Math.cos(ang) * rad, Math.max(24, Math.min(300, jy + Math.sin(ang) * rad * 0.72))]);
    }
    const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const dots = pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2 + rand() * 0.9).toFixed(1)}" fill="#${tx}"/>`).join("");
    const labelY = Math.max(...pts.map(p => p[1])) + 24;
    constellations += `<polyline points="${line}" fill="none" stroke="#${c}" stroke-width="1" opacity="0.5"/>${dots}` +
      `<text x="${jx.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" letter-spacing="2" fill="#${tx}" opacity="0.85">${esc(repo)}</text>`;
  });

  const subtitle = total > 0
    ? `${total} PUSHES · ${activeDays} ACTIVE DAYS · LAST 90 DAYS`
    : "A QUIET SKY — FOR NOW";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="420" viewBox="0 0 900 420">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#${b}"/>
      <stop offset="1" stop-color="#${horizon}"/>
    </linearGradient>
    <radialGradient id="skyGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#${c}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#${c}" stop-opacity="0"/>
    </radialGradient>
    <filter id="skyBlur" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="26"/>
    </filter>
    <clipPath id="skyClip"><rect width="900" height="420" rx="14"/></clipPath>
  </defs>
  <rect width="900" height="420" rx="14" fill="url(#skyGrad)"/>
  <g clip-path="url(#skyClip)">
    <ellipse cx="450" cy="428" rx="430" ry="120" fill="url(#skyGlow)" filter="url(#skyBlur)"/>
    ${dust}
    ${stars}
    ${constellations}
    <circle cx="806" cy="66" r="25" fill="#${c}" opacity="0.9"/>
    <circle cx="817" cy="59" r="22" fill="#${b}"/>
  </g>
  <rect width="899" height="419" x="0.5" y="0.5" rx="14" fill="none" stroke="#${c}" stroke-width="1.5"/>
  <line x1="36" y1="348" x2="864" y2="348" stroke="#${c}" stroke-width="1" opacity="0.35"/>
  <text x="36" y="384" font-family="Georgia, serif" font-size="29" fill="#${tx}">${esc(name)}'s sky</text>
  <text x="36" y="406" font-family="Verdana, sans-serif" font-size="11" letter-spacing="2.5" fill="#${tx}" opacity="0.7">${subtitle}</text>
</svg>`;
}
export default async function handler(req, res) {
  const q = req.query || {};
  const username = String(q.username || "");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return res.status(200).send(errorSvg("Add ?username=YOUR_USERNAME"));
  }
  try {
    const [counts, info] = await Promise.all([pushCounts90(username), topRepos(username)]);
    return res.status(200).send(skySvg({
      username, name: info.name, counts, repos: info.repos,
      color: q.color, bg: q.bg, text: q.text,
    }));
  } catch {
    return res.status(200).send(errorSvg(`Could not load @${username}`));
  }
}
