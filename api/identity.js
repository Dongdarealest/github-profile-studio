// The One Sky identity plates, served by a single function (the Hobby plan
// caps a deployment at 12 functions) and routed by vercel.json rewrites:
//   /api/strip and /strip  ->  ?part=strip
//   /api/stack and /stack  ->  ?part=stack
//
// STRIP — GET /api/strip?username=octocat&color=A98B4F&bg=0D1117&text=E6EDF3
// ONE wide plate in the sky language carrying the four numbers that identify
// a profile — followers, total stars, repositories and the profile score.
// It replaces the shields.io / komarev badge row: one host, one design.
//
// STACK — GET /api/stack?username=octocat&color=A98B4F&bg=0D1117&text=E6EDF3
// The user's top languages as a row of monogram tiles in the sky language —
// ink tiles, hairline gold borders, serif monograms. It replaces
// skillicons.dev: no external icon assets anywhere, the letters ARE the
// identity.
import { computeScore } from "./score.js";
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

/* ------------------------------- STRIP ------------------------------- */
function stripErrorSvg(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="64" viewBox="0 0 900 64">
  <rect width="900" height="64" rx="14" fill="#0D1117" stroke="#FB7185" stroke-width="1.5"/>
  <text x="450" y="39" text-anchor="middle" font-family="Verdana, sans-serif" font-size="14" fill="#FFE4E6">${esc(msg)}</text>
</svg>`;
}
export function stripSvg({ followers, stars, repos, score, color, bg, text }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), tx = hex(text, "E6EDF3");
  const W = 900, cw = W / 4;
  const cells = [
    ["FOLLOWERS", fmt(followers)],
    ["TOTAL STARS", fmt(stars)],
    ["REPOSITORIES", fmt(repos)],
    ["PROFILE SCORE", score == null ? "—" : `${score}/100`],
  ];
  const dividers = [1, 2, 3].map(i =>
    `<line x1="${i * cw}" y1="14" x2="${i * cw}" y2="50" stroke="#${c}" stroke-opacity="0.3" stroke-width="1"/>`
  ).join("\n  ");
  const body = cells.map(([label, value], i) => {
    const cx = i * cw + cw / 2;
    return `<text x="${cx}" y="25" text-anchor="middle" font-family="Verdana, sans-serif" font-size="9.5" letter-spacing="2.5" fill="#${tx}" opacity="0.65">${label}</text>` +
      `<text x="${cx}" y="53" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#${c}">${value}</text>`;
  }).join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="64" viewBox="0 0 900 64">
  <rect width="900" height="64" rx="14" fill="#${b}" stroke="#${c}" stroke-width="1.5"/>
  ${dividers}
  ${body}
</svg>`;
}
async function stripHandler(q, res) {
  const username = String(q.username || "");
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return res.status(200).send(stripErrorSvg("Add ?username=YOUR_USERNAME"));
  }
  try {
    const u = await gh(`https://api.github.com/users/${username}`);
    if (!u || u.message) throw new Error("not found");
    let stars = 0;
    const allRepos = [];
    let page = 1;
    while (page <= 3) {
      const rs = await gh(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed&page=${page}`);
      if (!Array.isArray(rs) || !rs.length) break;
      allRepos.push(...rs);
      stars += rs.filter(r => !r.fork).reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      if (rs.length < 100) break;
      page++;
    }
    const profileRepo = await fetch(`https://api.github.com/repos/${username}/${username}`, { headers: GH }).catch(() => null);
    const score = computeScore({ user: u, repos: allRepos, hasProfileRepo: !!(profileRepo && profileRepo.ok) });
    return res.status(200).send(stripSvg({
      followers: u.followers ?? 0,
      stars,
      repos: u.public_repos ?? allRepos.length,
      score,
      color: q.color, bg: q.bg, text: q.text,
    }));
  } catch {
    return res.status(200).send(stripErrorSvg(`Could not load @${username}`));
  }
}

/* ------------------------------- STACK ------------------------------- */
const MONOGRAMS = {
  "Python": "Py", "JavaScript": "JS", "TypeScript": "TS", "HTML": "HTML",
  "CSS": "CSS", "Go": "Go", "Rust": "Rs", "Java": "Jv", "C++": "C++",
  "C#": "C#", "PHP": "PHP", "Ruby": "Rb", "Swift": "Sw", "Kotlin": "Kt",
  "Shell": "Sh", "C": "C", "Lua": "Lua", "Dart": "Dart", "Vue": "Vue",
  "SCSS": "SC", "Perl": "Pl", "R": "R", "Dockerfile": "Do",
  "Jupyter Notebook": "Jp", "Objective-C": "OC", "Elixir": "Ex",
  "Haskell": "Hs", "Scala": "Sc",
};
const SHORT_NAMES = { "Jupyter Notebook": "Jupyter", "Objective-C": "Obj-C" };
function monogram(name) {
  if (MONOGRAMS[name]) return MONOGRAMS[name];
  const clean = String(name).replace(/[^A-Za-z]/g, "");
  return clean ? clean[0].toUpperCase() + clean.slice(1, 2) : "??";
}
function stackErrorSvg(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="90" viewBox="0 0 500 90">
  <rect width="500" height="90" rx="10" fill="#0D1117" stroke="#FB7185"/>
  <text x="250" y="52" text-anchor="middle" font-family="Verdana, sans-serif" font-size="15" fill="#FFE4E6">${esc(msg)}</text>
</svg>`;
}
export function stackSvg({ langs, color, bg, text }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), tx = hex(text, "E6EDF3");
  const n = langs.length;
  const W = n * 84 - 20, H = 104;
  const tiles = langs.map((name, i) => {
    const x = i * 84;
    const mono = monogram(name);
    const size = mono.length <= 2 ? 25 : mono.length === 3 ? 21 : 16.5;
    const label = (SHORT_NAMES[name] || name).toUpperCase();
    return `<rect x="${x}" y="2" width="64" height="64" rx="14" fill="#${b}" stroke="#${c}" stroke-opacity="0.5" stroke-width="1"/>` +
      `<text x="${x + 32}" y="${34 + size * 0.36}" text-anchor="middle" font-family="Georgia, serif" font-size="${size}" fill="#${c}">${esc(mono)}</text>` +
      `<text x="${x + 32}" y="88" text-anchor="middle" font-family="Verdana, sans-serif" font-size="9" letter-spacing="1.5" fill="#${tx}" opacity="0.75">${esc(label)}</text>`;
  }).join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${tiles}
</svg>`;
}
async function stackHandler(q, res) {
  const username = String(q.username || "");
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return res.status(200).send(stackErrorSvg("Add ?username=YOUR_USERNAME"));
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
    const langs = Object.entries(totals)
      .sort((a, b2) => b2[1] - a[1])
      .slice(0, 8)
      .map(([name]) => name);
    if (!langs.length) return res.status(200).send(stackErrorSvg(`No language data for @${username}`));
    return res.status(200).send(stackSvg({ langs, color: q.color, bg: q.bg, text: q.text }));
  } catch {
    return res.status(200).send(stackErrorSvg(`Could not load @${username}`));
  }
}

/* ----------------------------- DISPATCH ------------------------------ */
export default async function handler(req, res) {
  const q = req.query || {};
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  if (q.part === "stack") return stackHandler(q, res);
  return stripHandler(q, res);
}
