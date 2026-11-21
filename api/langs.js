// GET /api/langs?username=octocat&color=A98B4F&bg=0D1117&text=E6EDF3
// "Most Used Languages": byte-weighted across the user's 12 largest repos,
// drawn as a segmented bar with a two-column legend.
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
export const LANG_COLORS = {
  "JavaScript": "#f1e05a", "TypeScript": "#3178c6", "Python": "#3572A5",
  "HTML": "#e34c26", "CSS": "#563d7c", "PHP": "#4F5D95", "Shell": "#89e051",
  "Java": "#b07219", "C": "#555555", "C++": "#f34b7d", "C#": "#178600",
  "Go": "#00ADD8", "Rust": "#dea584", "Ruby": "#701516", "Swift": "#F05138",
  "Kotlin": "#A97BFF", "Dart": "#00B4AB", "Vue": "#41b883", "Svelte": "#ff3e00",
  "Lua": "#000080", "Scala": "#c22d40", "R": "#198CE7", "Perl": "#0298c3",
  "Dockerfile": "#384d54", "Jupyter Notebook": "#DA5B0B", "SCSS": "#c6538c",
  "Objective-C": "#438eff", "Elixir": "#6e4a7e", "Haskell": "#5e5086",
};
const FALLBACK = "#8A8680";
export function errorSvg(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="90" viewBox="0 0 500 90">
  <rect width="500" height="90" rx="10" fill="#0D1117" stroke="#FB7185"/>
  <text x="250" y="52" text-anchor="middle" font-family="Verdana, sans-serif" font-size="15" fill="#FFE4E6">${esc(msg)}</text>
</svg>`;
}
export function langsSvg({ langs, totalAll, color, bg, text }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), tx = hex(text, "E6EDF3");
  const grand = totalAll || langs.reduce((s, l) => s + l.bytes, 0) || 1;
  const topSum = langs.reduce((s, l) => s + l.bytes, 0) || 1;
  let x = 30;
  const segs = langs.map(l => {
    const w = Math.max(2, (l.bytes / topSum) * 440);
    const seg = `<rect x="${x.toFixed(1)}" y="62" width="${w.toFixed(1)}" height="12" fill="${LANG_COLORS[l.name] || FALLBACK}"/>`;
    x += w;
    return seg;
  }).join("\n  ");
  const items = langs.map((l, i) => {
    const colX = i < 3 ? 30 : 262;
    const y = 106 + (i % 3) * 27;
    const pct = (l.bytes / grand * 100).toFixed(2);
    return `<circle cx="${colX + 5}" cy="${y - 4}" r="5" fill="${LANG_COLORS[l.name] || FALLBACK}"/>` +
      `<text x="${colX + 17}" y="${y}" font-family="Verdana, sans-serif" font-size="13" fill="#${tx}">${esc(l.name)} ${pct}%</text>`;
  }).join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="190" viewBox="0 0 500 190">
  <defs><clipPath id="barClip"><rect x="30" y="62" width="440" height="12" rx="6"/></clipPath></defs>
  <rect width="500" height="190" rx="10" fill="#${b}" stroke="#${c}" stroke-width="1.5"/>
  <text x="30" y="42" font-family="Georgia, serif" font-size="21" fill="#${c}">Most Used Languages</text>
  <g clip-path="url(#barClip)">
  ${segs}
  </g>
  ${items}
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
    const repos = await gh(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (!Array.isArray(repos)) throw new Error("not found");
    const largest = repos.slice().sort((a, b2) => (b2.size || 0) - (a.size || 0)).slice(0, 12);
    const perRepo = await Promise.all(largest.map(r =>
      gh(`https://api.github.com/repos/${username}/${encodeURIComponent(r.name)}/languages`)));
    const totals = {};
    for (const langs of perRepo) {
      if (!langs || typeof langs !== "object") continue;
      for (const [name, bytes] of Object.entries(langs)) {
        if (typeof bytes === "number") totals[name] = (totals[name] || 0) + bytes;
      }
    }
    const totalAll = Object.values(totals).reduce((s, n) => s + n, 0);
    const langs = Object.entries(totals)
      .map(([name, bytes]) => ({ name, bytes }))
      .sort((a, b2) => b2.bytes - a.bytes)
      .slice(0, 6);
    if (!langs.length) return res.status(200).send(errorSvg(`No language data for @${username}`));
    return res.status(200).send(langsSvg({ langs, totalAll, color: q.color, bg: q.bg, text: q.text }));
  } catch {
    return res.status(200).send(errorSvg(`Could not load @${username}`));
  }
}
