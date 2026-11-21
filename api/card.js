// GET /api/card?username=octocat&color=A98B4F&bg=0D1117
// A live stats card drawn from the public GitHub API: the ONLY input a user
// ever needs is their username. Optional colour parameters re-skin it.
function hex(v, fallback) {
  const s = String(v || fallback).replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(s) ? s : fallback;
}
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export function cardSvg({ username, name, repos, followers, following, stars, color, bg, text }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), tx = hex(text, "E6EDF3");
  const row = (label, value, y) =>
    `<text x="36" y="${y}" font-family="Verdana, sans-serif" font-size="15" fill="#${tx}" opacity="0.75">${label}</text>` +
    `<text x="464" y="${y}" text-anchor="end" font-family="Verdana, sans-serif" font-size="17" font-weight="bold" fill="#${tx}">${value}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="218" viewBox="0 0 500 218">
  <rect width="500" height="218" rx="10" fill="#${b}" stroke="#${c}" stroke-width="1.5"/>
  <text x="36" y="46" font-family="Georgia, serif" font-size="21" fill="#${c}">${esc(name || username)}'s GitHub</text>
  ${row("Public repositories", repos, 88)}
  ${row("Total stars earned", stars, 122)}
  ${row("Followers", followers, 156)}
  ${row("Following", following, 190)}
</svg>`;
}
export function errorSvg(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="90" viewBox="0 0 500 90">
  <rect width="500" height="90" rx="10" fill="#0D1117" stroke="#FB7185"/>
  <text x="250" y="52" text-anchor="middle" font-family="Verdana, sans-serif" font-size="15" fill="#FFE4E6">${esc(msg)}</text>
</svg>`;
}
export default async function handler(req, res) {
  const q = req.query || {};
  const username = String(q.username || "");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=1800");
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return res.status(200).send(errorSvg("Add ?username=YOUR_USERNAME"));
  }
  try {
    const headers = { "User-Agent": "github-profile-studio", Accept: "application/vnd.github+json" };
    const u = await (await fetch(`https://api.github.com/users/${username}`, { headers })).json();
    if (!u || u.message) throw new Error("not found");
    let stars = 0, page = 1;
    while (page <= 3) {
      const rs = await (await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`, { headers })).json();
      if (!Array.isArray(rs) || !rs.length) break;
      stars += rs.reduce((s, r) => s + (r.stargazers_count || 0), 0);
      if (rs.length < 100) break;
      page++;
    }
    return res.status(200).send(cardSvg({
      username, name: u.name || username, repos: u.public_repos ?? 0,
      followers: u.followers ?? 0, following: u.following ?? 0, stars,
      color: q.color, bg: q.bg, text: q.text,
    }));
  } catch {
    return res.status(200).send(errorSvg(`Could not load @${username}`));
  }
}
