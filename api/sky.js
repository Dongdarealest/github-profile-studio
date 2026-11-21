// GET /api/sky?username=octocat&color=A98B4F&bg=0D1117&text=E6EDF3
// "Your Sky" v2 — the last 90 days of pushes rendered as a cinematic
// night-sky artwork. A Milky Way band runs diagonally across the frame so
// the canvas is never empty; each day's pushes become stars along the band,
// the brightest days get hero stars, and the top repositories become named
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
// Standard normal sample from the seeded PRNG (Box–Muller).
function gauss(rand) {
  let u = 0;
  while (u === 0) u = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
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
  const F1 = n => Number(n).toFixed(1), F2 = n => Number(n).toFixed(2);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // --- Milky Way band geometry: lower-left -> upper-right -----------------
  const AX = 150, AY = 330, BX = 860, BY = 40;         // band axis endpoints
  const DX = BX - AX, DY = BY - AY;
  const LEN = Math.hypot(DX, DY);
  const UX = DX / LEN, UY = DY / LEN;                  // along-band unit
  const PX = -UY, PY = UX;                             // perpendicular unit
  const ANG = (Math.atan2(DY, DX) * 180 / Math.PI).toFixed(1);
  const MOON = { x: 806, y: 66 };
  const bandPt = (t, perp) => [AX + DX * t + PX * perp, AY + DY * t + PY * perp];
  // Keep a star out of the moon disc: push it radially outward to a
  // jittered radius, so displaced stars scatter in an annulus instead of
  // tracing a perfect artificial ring around the moon.
  const moonSafe = (x, y) => {
    const dx = x - MOON.x, dy = y - MOON.y, d = Math.hypot(dx, dy);
    if (d >= 56 || d === 0) return [x, y];
    const rim = 58 + rand() * 42;
    return [MOON.x + dx / d * rim, MOON.y + dy / d * rim];
  };

  // --- Nebula blobs: three soft colour fields, seeded off-axis ------------
  const nebAt = (x, y, j) => [clamp(x + (rand() - 0.5) * j, 60, 840), clamp(y + (rand() - 0.5) * j, 30, 330)];
  const [nAx, nAy] = nebAt(255, 130, 90);
  const [nVx, nVy] = nebAt(615, 235, 110);
  const [nTx, nTy] = nebAt(745, 285, 90);
  const nebula =
    `<circle cx="${F1(nAx)}" cy="${F1(nAy)}" r="${(280 + rand() * 60).toFixed(0)}" fill="url(#nebA)"/>` +
    `<circle cx="${F1(nVx)}" cy="${F1(nVy)}" r="${(300 + rand() * 60).toFixed(0)}" fill="url(#nebV)"/>` +
    `<circle cx="${F1(nTx)}" cy="${F1(nTy)}" r="${(240 + rand() * 50).toFixed(0)}" fill="url(#nebT)"/>`;

  // --- Band glow: layered blurred ellipses along the diagonal -------------
  const bandFills = ["url(#bandA)", "url(#bandI)", "url(#bandV)", "url(#bandI)"];
  let bandGlow = "";
  bandGlow += `<ellipse cx="505" cy="185" rx="500" ry="118" transform="rotate(${ANG} 505 185)" fill="url(#bandI)"/>`;
  for (let i = 0; i < 11; i++) {
    const t = 0.03 + (i / 10) * 0.94;
    const [gx, gy] = bandPt(t, (rand() - 0.5) * 36);
    const rx = (150 + rand() * 70).toFixed(0), ry = (46 + rand() * 26).toFixed(0);
    bandGlow += `<ellipse cx="${F1(gx)}" cy="${F1(gy)}" rx="${rx}" ry="${ry}" transform="rotate(${ANG} ${F1(gx)} ${F1(gy)})" fill="${bandFills[i % bandFills.length]}"/>`;
  }

  // --- Band dust: ~350 tiny stars in a gaussian spread around the axis ----
  let bandDust = "";
  for (let i = 0; i < 350; i++) {
    const t = rand();
    const perp = clamp(gauss(rand) * 46, -125, 125);
    let [x, y] = bandPt(t, perp);
    x = clamp(x, 8, 892); y = clamp(y, 8, 334);
    if (Math.hypot(x - MOON.x, y - MOON.y) < 50) continue;
    const r = (0.4 + rand() * 0.7).toFixed(2), o = (0.15 + rand() * 0.5).toFixed(2);
    const fill = rand() < 0.14 ? `#${c}` : `#${tx}`;
    bandDust += `<circle cx="${F1(x)}" cy="${F1(y)}" r="${r}" fill="${fill}" opacity="${o}"/>`;
  }
  // Faint field dust across the whole frame, so the corners stay alive.
  let fieldDust = "";
  for (let i = 0; i < 70; i++) {
    const x = 10 + rand() * 880, y = 10 + rand() * 320;
    if (Math.hypot(x - MOON.x, y - MOON.y) < 48) continue;
    fieldDust += `<circle cx="${F1(x)}" cy="${F1(y)}" r="${(0.4 + rand() * 0.5).toFixed(2)}" fill="#${tx}" opacity="${(0.06 + rand() * 0.16).toFixed(2)}"/>`;
  }

  // --- Activity stars: each day's pushes, laid along the band by date -----
  const scale = total > 0 ? Math.min(1, 240 / total) : 0;
  const heroDays = new Set(
    counts.map((n, i) => [n, i]).filter(([n]) => n > 0)
      .sort((a, b2) => b2[0] - a[0]).slice(0, 3).map(([, i]) => i)
  );
  let stars = "", placed = 0;
  counts.forEach((n, day) => {
    if (n <= 0) return;
    let k = Math.round(n * scale);
    if (k < 1) k = 1;
    const t = 0.03 + (day / 89) * 0.94;
    const heat = Math.min(n, 14) / 14;
    for (let i = 0; i < k && placed < 240; i++, placed++) {
      const perp = clamp(gauss(rand) * 30, -95, 95);
      const along = (rand() - 0.5) * 18;
      let [x, y] = bandPt(t, perp);
      x += UX * along; y += UY * along;
      [x, y] = moonSafe(clamp(x, 12, 888), clamp(y, 14, 334));
      x = clamp(x, 12, 888); y = clamp(y, 14, 334);
      const r = 1.0 + heat * 1.6 + rand() * 0.6;
      const o = 0.55 + heat * 0.45;
      if (heroDays.has(day) && i === 0) {
        const L = 13, w = 1.8;
        stars += `<circle cx="${F1(x)}" cy="${F1(y)}" r="15" fill="url(#heroGlow)"/>` +
          `<path d="M ${F1(x)} ${F1(y - L)} L ${F1(x + w)} ${F1(y - w)} L ${F1(x + L)} ${F1(y)} L ${F1(x + w)} ${F1(y + w)} L ${F1(x)} ${F1(y + L)} L ${F1(x - w)} ${F1(y + w)} L ${F1(x - L)} ${F1(y)} L ${F1(x - w)} ${F1(y - w)} Z" fill="#${tx}" opacity="0.92"/>` +
          `<circle cx="${F1(x)}" cy="${F1(y)}" r="${F2(Math.min(3.2, r + 0.5))}" fill="#${tx}"/>`;
      } else {
        stars += `<circle cx="${F1(x)}" cy="${F1(y)}" r="${F2(r)}" fill="#${tx}" opacity="${F2(o)}"/>`;
      }
    }
  });

  // --- Constellations: one per top repo, kept clear of moon and title -----
  const slots = [[168, 92], [392, 158], [540, 104], [706, 196], [286, 238]];
  let constellations = "";
  repos.forEach((repo, i) => {
    const [cx, cy] = slots[i % slots.length];
    const jx = cx + (rand() - 0.5) * 44, jy = cy + (rand() - 0.5) * 30;
    const pts = [];
    const nPts = 4 + Math.floor(rand() * 3);
    for (let j = 0; j < nPts; j++) {
      const ang = rand() * Math.PI * 2, rad = j === 0 ? 0 : 26 + rand() * 30;
      pts.push([jx + Math.cos(ang) * rad, clamp(jy + Math.sin(ang) * rad * 0.72, 24, 300)]);
    }
    const line = pts.map(([x, y]) => `${F1(x)},${F1(y)}`).join(" ");
    let dots = "";
    for (const [x, y] of pts) {
      const r = 2.4 + rand() * 1.0;
      dots += `<circle cx="${F1(x)}" cy="${F1(y)}" r="${F1(r * 2.3)}" fill="#${tx}" opacity="0.35" filter="url(#soft)"/>` +
        `<circle cx="${F1(x)}" cy="${F1(y)}" r="${F1(r)}" fill="#${tx}"/>`;
    }
    const labelY = Math.max(...pts.map(p => p[1])) + 24;
    const label = (dx, dy, fill, op) =>
      `<text x="${F1(jx + dx)}" y="${F1(labelY + dy)}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" letter-spacing="2" fill="${fill}" opacity="${op}">${esc(repo)}</text>`;
    constellations += `<polyline points="${line}" fill="none" stroke="#${c}" stroke-width="1.1" opacity="0.55"/>${dots}` +
      label(1, 1.2, "#000000", "0.6") + label(0, 0, `#${tx}`, "0.88");
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
    <radialGradient id="nebA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#${c}" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#${c}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nebV" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#6D5DF6" stop-opacity="0.09"/>
      <stop offset="1" stop-color="#6D5DF6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nebT" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#2DD4BF" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#2DD4BF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bandA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#${c}" stop-opacity="0.13"/>
      <stop offset="0.55" stop-color="#${c}" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#${c}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bandV" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#6D5DF6" stop-opacity="0.12"/>
      <stop offset="0.55" stop-color="#6D5DF6" stop-opacity="0.045"/>
      <stop offset="1" stop-color="#6D5DF6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bandI" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#3B348C" stop-opacity="0.13"/>
      <stop offset="0.55" stop-color="#3B348C" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#3B348C" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="heroGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#${tx}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#${tx}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.42" r="0.72">
      <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.5"/>
    </radialGradient>
    <filter id="soft" x="-90%" y="-90%" width="280%" height="280%">
      <feGaussianBlur stdDeviation="2.5"/>
    </filter>
    <filter id="moonBlur" x="-90%" y="-90%" width="280%" height="280%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
    <filter id="grainF" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
    </filter>
    <clipPath id="skyClip"><rect width="900" height="420" rx="14"/></clipPath>
  </defs>
  <rect width="900" height="420" rx="14" fill="url(#skyGrad)"/>
  <g clip-path="url(#skyClip)">
    ${nebula}
    ${bandGlow}
    ${bandDust}
    ${fieldDust}
    ${stars}
    <rect width="900" height="420" fill="url(#vig)"/>
    ${constellations}
    <circle cx="${MOON.x}" cy="${MOON.y}" r="48" fill="#${c}" opacity="0.18" filter="url(#moonBlur)"/>
    <circle cx="${MOON.x}" cy="${MOON.y}" r="25" fill="#${c}" opacity="0.92"/>
    <circle cx="${MOON.x + 11}" cy="${MOON.y - 7}" r="22" fill="#${b}"/>
    <rect width="900" height="420" filter="url(#grainF)" opacity="0.05"/>
  </g>
  <rect width="899" height="419" x="0.5" y="0.5" rx="14" fill="none" stroke="#${c}" stroke-width="1.5"/>
  <line x1="36" y1="342" x2="864" y2="342" stroke="#${c}" stroke-width="1" opacity="0.35"/>
  <text x="37" y="364" font-family="Verdana, sans-serif" font-size="10" letter-spacing="4" fill="#${c}">YOUR SKY</text>
  <text x="36" y="390" font-family="Georgia, serif" font-size="27" fill="#${tx}">${esc(name)}'s sky</text>
  <text x="36" y="409" font-family="Verdana, sans-serif" font-size="10.5" letter-spacing="2.2" fill="#${tx}" opacity="0.7">${subtitle}</text>
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
