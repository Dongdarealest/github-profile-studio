// GET /api/stats?username=octocat&color=A98B4F&bg=0D1117&text=E6EDF3
// "GitHub in Numbers": stars, commits, PRs, issues, followers — composed in
// the sky language (serif name, star-glyph rows, hairlines, the rank as a
// moon disc). Search failures degrade to "—".
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
  const displayName = String(name || "").length > 24 ? String(name).slice(0, 23) + "…" : String(name || "");
  // The sky language's four-point star, used as the row glyph.
  const star = (x, y) =>
    `<path transform="translate(${x} ${y})" d="M0 -7 C1.2 -2 2 -1.2 7 0 C2 1.2 1.2 2 0 7 C-1.2 2 -2 1.2 -7 0 C-2 -1.2 -1.2 -2 0 -7 Z" fill="#${c}"/>`;
  const rowsData = [
    ["STARS EARNED", fmt(stars)],
    ["TOTAL COMMITS", fmt(commits)],
    ["PULL REQUESTS", fmt(prs)],
    ["TOTAL ISSUES", fmt(issues)],
    ["FOLLOWERS", fmt(followers)],
  ];
  const rows = rowsData.map(([label, value], i) => {
    const y = 106 + i * 22.5;
    const hairline = i < rowsData.length - 1
      ? `<line x1="36" y1="${y + 11}" x2="364" y2="${y + 11}" stroke="#${c}" stroke-opacity="0.16" stroke-width="1"/>`
      : "";
    return `${star(44, y - 4)}` +
      `<text x="62" y="${y}" font-family="Verdana, sans-serif" font-size="11" letter-spacing="2" fill="#${tx}" opacity="0.8">${label}</text>` +
      `<text x="356" y="${y + 2}" text-anchor="end" font-family="Georgia, serif" font-size="19" fill="#${tx}">${value}</text>` +
      hairline;
  }).join("\n  ");
  const RC = 2 * Math.PI * 44;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="218" viewBox="0 0 500 218">
  <defs><clipPath id="moonClip"><circle cx="430" cy="124" r="36"/></clipPath></defs>
  <rect width="500" height="218" rx="14" fill="#${b}" stroke="#${c}" stroke-width="1.5"/>
  <text x="36" y="44" font-family="Georgia, serif" font-size="24" fill="#${c}">${esc(displayName)}</text>
  <text x="36" y="66" font-family="Verdana, sans-serif" font-size="10" letter-spacing="3" fill="#${tx}" opacity="0.65">GITHUB IN NUMBERS</text>
  <line x1="36" y1="80" x2="364" y2="80" stroke="#${c}" stroke-opacity="0.3" stroke-width="1"/>
  ${rows}
  <text x="430" y="68" text-anchor="middle" font-family="Verdana, sans-serif" font-size="9" letter-spacing="2.5" fill="#${tx}" opacity="0.65">RANK</text>
  <circle cx="430" cy="124" r="44" fill="none" stroke="#${c}" stroke-opacity="0.22" stroke-width="3"/>
  <circle cx="430" cy="124" r="44" fill="none" stroke="#${c}" stroke-width="3" stroke-linecap="round"
    stroke-dasharray="${(percent / 100 * RC).toFixed(1)} ${RC.toFixed(1)}" transform="rotate(-90 430 124)"/>
  <circle cx="430" cy="124" r="36" fill="#${c}"/>
  <g clip-path="url(#moonClip)"><circle cx="411" cy="111" r="30" fill="#${b}" opacity="0.08"/></g>
  <text x="430" y="133" text-anchor="middle" font-family="Georgia, serif" font-size="25" font-weight="bold" fill="#${b}">${grade}</text>
  <text x="430" y="190" text-anchor="middle" font-family="Verdana, sans-serif" font-size="11" fill="#${tx}" opacity="0.65">${percent}%</text>
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
