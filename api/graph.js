// GET /api/graph?username=octocat&color=A98B4F&bg=0D1117&text=E6EDF3
// Push activity for the last 30 days as a smooth area chart, from the
// public events API (same source as the streak card).
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
// Counts of PushEvents per day for the last 30 days, oldest first.
export async function pushCounts(username) {
  const today = new Date(dayKey(Date.now()) + "T00:00:00Z").getTime();
  const counts = new Array(30).fill(0);
  const index = new Map();
  for (let i = 0; i < 30; i++) index.set(dayKey(today - (29 - i) * DAY), i);
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
  return { counts, first: dayKey(today - 29 * DAY), last: dayKey(today) };
}
function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
export function errorSvg(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="90" viewBox="0 0 800 90">
  <rect width="800" height="90" rx="10" fill="#0D1117" stroke="#FB7185"/>
  <text x="400" y="52" text-anchor="middle" font-family="Verdana, sans-serif" font-size="15" fill="#FFE4E6">${esc(msg)}</text>
</svg>`;
}
export function graphSvg({ counts, first, last, color, bg, text }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), tx = hex(text, "E6EDF3");
  const max = Math.max(1, ...counts);
  const total = counts.reduce((s, n) => s + n, 0);
  const pts = counts.map((n, i) => [40 + i * (740 / 29), 150 - (n / max) * 100]);
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1][0].toFixed(1)} 150 L ${pts[0][0].toFixed(1)} 150 Z`;
  const dots = pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#${c}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="190" viewBox="0 0 800 190">
  <rect width="800" height="190" rx="10" fill="#${b}" stroke="#${c}" stroke-width="1.5"/>
  <text x="40" y="30" font-family="Georgia, serif" font-size="18" fill="#${c}">Push activity — last 30 days</text>
  <text x="780" y="30" text-anchor="end" font-family="Verdana, sans-serif" font-size="12" fill="#${tx}" opacity="0.7">${total} pushes</text>
  <path d="${area}" fill="#${c}" fill-opacity="0.18" stroke="none"/>
  <path d="${line}" fill="none" stroke="#${c}" stroke-width="2"/>
  ${dots}
  <line x1="40" y1="150" x2="780" y2="150" stroke="#${tx}" stroke-opacity="0.2"/>
  <text x="40" y="170" font-family="Verdana, sans-serif" font-size="10.5" fill="#${tx}" opacity="0.55">${esc(first)}</text>
  <text x="780" y="170" text-anchor="end" font-family="Verdana, sans-serif" font-size="10.5" fill="#${tx}" opacity="0.55">${esc(last)}</text>
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
    const data = await pushCounts(username);
    return res.status(200).send(graphSvg({ ...data, color: q.color, bg: q.bg, text: q.text }));
  } catch {
    return res.status(200).send(errorSvg(`Could not load @${username}`));
  }
}
