// GET /api/streak?username=octocat&color=A98B4F&bg=0D1117&text=E6EDF3
// Push-activity streaks from the public events API: active days, current
// streak (in a gold ring) and longest streak over the last 90 days.
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
// Returns a Set of YYYY-MM-DD (UTC) days with >= 1 PushEvent in the last 90 days.
export async function pushDays(username) {
  const since = Date.now() - 90 * DAY;
  const days = new Set();
  for (let page = 1; page <= 3; page++) {
    const evs = await gh(`https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`);
    if (!Array.isArray(evs) || !evs.length) break;
    for (const ev of evs) {
      if (ev.type !== "PushEvent" || !ev.created_at) continue;
      const t = new Date(ev.created_at).getTime();
      if (t >= since) days.add(dayKey(t));
    }
    if (evs.length < 100) break;
  }
  return days;
}
export function computeStreaks(days) {
  const total = days.size;
  let current = 0;
  let cursor = Date.now();
  if (!days.has(dayKey(cursor))) cursor -= DAY; // allow "not yet today"
  while (days.has(dayKey(cursor))) { current++; cursor -= DAY; }
  let longest = 0, run = 0, prev = null;
  for (const d of [...days].sort()) {
    const t = new Date(d + "T00:00:00Z").getTime();
    run = (prev !== null && t - prev === DAY) ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = t;
  }
  return { total, current, longest };
}
export function errorSvg(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="90" viewBox="0 0 500 90">
  <rect width="500" height="90" rx="10" fill="#0D1117" stroke="#FB7185"/>
  <text x="250" y="52" text-anchor="middle" font-family="Verdana, sans-serif" font-size="15" fill="#FFE4E6">${esc(msg)}</text>
</svg>`;
}
export function streakSvg({ total, current, longest, color, bg, text }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), tx = hex(text, "E6EDF3");
  const num = (x, v) => `<text x="${x}" y="80" text-anchor="middle" font-family="Verdana, sans-serif" font-size="30" font-weight="bold" fill="#${tx}">${v}</text>`;
  const label = (x, s2, fill, op) => `<text x="${x}" y="126" text-anchor="middle" font-family="Verdana, sans-serif" font-size="13" fill="${fill}"${op ? ` opacity="${op}"` : ""}>${s2}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="190" viewBox="0 0 500 190">
  <rect width="500" height="190" rx="10" fill="#${b}" stroke="#${c}" stroke-width="1.5"/>
  ${num(92, total)}
  ${label(92, "Total Active Days", `#${tx}`, "0.85")}
  <text x="92" y="146" text-anchor="middle" font-family="Verdana, sans-serif" font-size="11" fill="#${tx}" opacity="0.55">Last 90 days</text>
  <line x1="171" y1="28" x2="171" y2="140" stroke="#${tx}" stroke-opacity="0.18"/>
  <circle cx="250" cy="66" r="31" fill="none" stroke="#${c}" stroke-opacity="0.25" stroke-width="4.5"/>
  <circle cx="250" cy="66" r="31" fill="none" stroke="#${c}" stroke-width="4.5"/>
  <text x="250" y="77" text-anchor="middle" font-family="Verdana, sans-serif" font-size="27" font-weight="bold" fill="#${tx}">${current}</text>
  ${label(250, "Current Streak", `#${c}`)}
  <line x1="329" y1="28" x2="329" y2="140" stroke="#${tx}" stroke-opacity="0.18"/>
  ${num(408, longest)}
  ${label(408, "Longest Streak", `#${tx}`, "0.85")}
  <text x="408" y="146" text-anchor="middle" font-family="Verdana, sans-serif" font-size="11" fill="#${tx}" opacity="0.55">Last 90 days</text>
  <text x="250" y="170" text-anchor="middle" font-family="Verdana, sans-serif" font-size="10.5" fill="#${tx}" opacity="0.5">Based on public push activity · last 90 days</text>
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
    const days = await pushDays(username);
    const s = computeStreaks(days);
    return res.status(200).send(streakSvg({ ...s, color: q.color, bg: q.bg, text: q.text }));
  } catch {
    return res.status(200).send(errorSvg(`Could not load @${username}`));
  }
}
