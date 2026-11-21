// GET /api/pin?username=octocat&repo=hello-world&color=A98B4F&bg=0D1117&text=E6EDF3
// A single-repository card: name, description, language, stars, forks.
function hex(v, fallback) {
  const s = String(v || fallback).replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(s) ? s : fallback;
}
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
const GH = { "User-Agent": "github-profile-studio", Accept: "application/vnd.github+json" };
const LANG_COLORS = {
  "JavaScript": "#f1e05a", "TypeScript": "#3178c6", "Python": "#3572A5",
  "HTML": "#e34c26", "CSS": "#563d7c", "PHP": "#4F5D95", "Shell": "#89e051",
  "Java": "#b07219", "C": "#555555", "C++": "#f34b7d", "C#": "#178600",
  "Go": "#00ADD8", "Rust": "#dea584", "Ruby": "#701516", "Swift": "#F05138",
  "Kotlin": "#A97BFF", "Dart": "#00B4AB", "Vue": "#41b883", "Svelte": "#ff3e00",
  "Lua": "#000080", "Scala": "#c22d40", "R": "#198CE7", "Perl": "#0298c3",
  "Dockerfile": "#384d54", "Jupyter Notebook": "#DA5B0B", "SCSS": "#c6538c",
};
function wrap(text, perLine, maxLines) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > perLine) {
      lines.push(line.trim());
      line = w;
      if (lines.length === maxLines) break;
    } else line += " " + w;
  }
  if (lines.length < maxLines && line.trim()) lines.push(line.trim());
  if (lines.length === maxLines) {
    const consumed = lines.join(" ").split(/\s+/).length;
    if (consumed < words.length) lines[maxLines - 1] = lines[maxLines - 1].replace(/…?$/, "") + "…";
  }
  return lines;
}
export function pinSvg({ repo, color, bg, text }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), tx = hex(text, "E6EDF3");
  const descLines = wrap(repo.description || "No description provided.", 54, 2);
  const desc = descLines.map((l, i) =>
    `<text x="22" y="${60 + i * 18}" font-family="Verdana, sans-serif" font-size="12.5" fill="#${tx}" opacity="0.8">${esc(l)}</text>`).join("\n  ");
  const lang = repo.language
    ? `<circle cx="27" cy="99" r="5" fill="${LANG_COLORS[repo.language] || "#8A8680"}"/><text x="39" y="103" font-family="Verdana, sans-serif" font-size="12" fill="#${tx}">${esc(repo.language)}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
  <rect width="400" height="120" rx="10" fill="#${b}" stroke="#${c}" stroke-width="1.5"/>
  <text x="22" y="35" font-family="Georgia, serif" font-size="18" fill="#${c}">${esc(repo.name)}</text>
  ${desc}
  ${lang}
  <text x="180" y="103" font-family="Verdana, sans-serif" font-size="12" fill="#${tx}">★ ${repo.stargazers_count ?? 0}</text>
  <text x="262" y="103" font-family="Verdana, sans-serif" font-size="12" fill="#${tx}">Forks: ${repo.forks_count ?? 0}</text>
</svg>`;
}
export function pinErrorSvg(msg, color, bg) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
  <rect width="400" height="120" rx="10" fill="#${b}" stroke="#${c}" stroke-width="1.5"/>
  <text x="200" y="66" text-anchor="middle" font-family="Verdana, sans-serif" font-size="14" fill="#FB7185">${esc(msg)}</text>
</svg>`;
}
export default async function handler(req, res) {
  const q = req.query || {};
  const username = String(q.username || "");
  const repoName = String(q.repo || "");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username) || !/^[a-zA-Z0-9._-]{1,100}$/.test(repoName)) {
    return res.status(200).send(pinErrorSvg("Add ?username=X&repo=Y", q.color, q.bg));
  }
  try {
    const r = await fetch(`https://api.github.com/repos/${username}/${encodeURIComponent(repoName)}`, { headers: GH });
    if (!r.ok) throw new Error("not found");
    const repo = await r.json();
    return res.status(200).send(pinSvg({ repo, color: q.color, bg: q.bg, text: q.text }));
  } catch {
    return res.status(200).send(pinErrorSvg(`Repository not found: ${username}/${repoName}`, q.color, q.bg));
  }
}
