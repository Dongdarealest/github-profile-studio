// GET /api/stats?username=octocat&color=A98B4F&bg=0D1117&text=E6EDF3
// A full stats card: stars, commits, PRs, issues, followers — plus a rank
// ring computed from the same numbers. Search failures degrade to "—".
function hex(v, fallback) {
  const s = String(v || fallback).replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(s) ? s : fallback;
}
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
const GH = { "User-Agent": "github-profile-studio", Accept: "application/vnd.github+json" };
async function gh(url) {
  try {
    const r = await fetch(url, { headers: GH });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}
function fmt(n) {
  return n == null ? "—" : Number(n).toLocaleString("en-US");
}
export function errorSvg(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="90" viewBox="0 0 500 90">
  <rect width="500" height="90" rx="10" fill="#0D1117" stroke="#FB7185"/>
  <text x="250" y="52" text-anchor="middle" font-family="Verdana, sans-serif" font-size="15" fill="#FFE4E6">${esc(msg)}</text>
</svg>`;
}
export function statsSvg({ name, stars, commits, prs, issues, followers, color, bg, text }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), tx = hex(text, "E6EDF3");
  const score = (stars || 0) * 2 + (followers || 0) * 3 + (prs || 0) * 5 + (commits || 0) / 20;
  const percent = Math.min(97, Math.round(100 * score / (score + 120)));
  const grade = percent >= 90 ? "S" : percent >= 75 ? "A+" : percent >= 60 ? "A" : percent >= 45 ? "B+" : percent >= 30 ? "B" : "C+";
  const C = 2 * Math.PI * 42;
  const row = (label, value, y) =>
    `<text x="36" y="${y}" font-family="Verdana, sans-serif" font-size="14.5" fill="#${tx}" opacity="0.75">${label}</text>` +
    `<text x="330" y="${y}" text-anchor="end" font-family="Verdana, sans-serif" font-size="15.5" font-weight="bold" fill="#${tx}">${value}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="218" viewBox="0 0 500 218">
  <rect width="500" height="218" rx="10" fill="#${b}" stroke="#${c}" stroke-width="1.5"/>
  <text x="36" y="42" font-family="Georgia, serif" font-size="21" fill="#${c}">${esc(name)}'s GitHub Stats</text>
  ${row("Total Stars Earned", fmt(stars), 78)}
  ${row("Total Commits", fmt(commits), 106)}
  ${row("Total PRs", fmt(prs), 134)}
  ${row("Total Issues", fmt(issues), 162)}
  ${row("Followers", fmt(followers), 190)}
  <circle cx="418" cy="118" r="42" fill="none" stroke="#${c}" stroke-opacity="0.22" stroke-width="7"/>
  <circle cx="418" cy="118" r="42" fill="none" stroke="#${c}" stroke-width="7" stroke-linecap="round"
    stroke-dasharray="${(percent / 100 * C).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 418 118)"/>
  <text x="418" y="128" text-anchor="middle" font-family="Georgia, serif" font-size="27" font-weight="bold" fill="#${tx}">${grade}</text>
  <text x="418" y="182" text-anchor="middle" font-family="Verdana, sans-serif" font-size="11" fill="#${tx}" opacity="0.6">${percent}%</text>
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
    const u = await gh(`https://api.github.com/users/${username}`);
    if (!u || u.message) throw new Error("not found");
    let stars = 0, page = 1;
    while (page <= 3) {
      const rs = await gh(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`);
      if (!Array.isArray(rs) || !rs.length) break;
      stars += rs.filter(r => !r.fork).reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      if (rs.length < 100) break;
      page++;
    }
    const enc = encodeURIComponent(username);
    const [commitsR, prsR, issuesR] = await Promise.all([
      gh(`https://api.github.com/search/commits?q=author:${enc}`),
      gh(`https://api.github.com/search/issues?q=type:pr+author:${enc}`),
      gh(`https://api.github.com/search/issues?q=type:issue+author:${enc}`),
    ]);
    const total = r => (r && typeof r.total_count === "number") ? r.total_count : null;
    return res.status(200).send(statsSvg({
      name: u.name || username, stars,
      commits: total(commitsR), prs: total(prsR), issues: total(issuesR),
      followers: u.followers ?? 0,
      color: q.color, bg: q.bg, text: q.text,
    }));
  } catch {
    return res.status(200).send(errorSvg(`Could not load @${username}`));
  }
}
