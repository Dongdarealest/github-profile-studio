// GET /api/score?username=octocat
// A 0-100 profile score badge, computed live from the public GitHub API with
// the same weighted checklist the Studio's audit panel uses. The badge is a
// small shareable strip: dark background, gold accents, "Profile score · N/100".
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export function scoreSvg(text, width) {
  const w = width || 210;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="28" viewBox="0 0 ${w} 28">
  <rect width="${w}" height="28" rx="6" fill="#0D1117" stroke="#A98B4F" stroke-width="1"/>
  <circle cx="15" cy="14" r="4" fill="#A98B4F"/>
  <text x="27" y="18.5" font-family="Verdana, sans-serif" font-size="12" fill="#F2EFE9">${esc(text)}</text>
</svg>`;
}
export function unavailableSvg() {
  return scoreSvg("Profile score · score unavailable", 262);
}
// Weighted checks — must sum to 100. Kept in sync with the Studio audit panel.
export function computeScore({ user, repos, hasProfileRepo }) {
  const own = (Array.isArray(repos) ? repos : []).filter(r => !r.fork);
  const sample = own.slice(0, 20);
  const withDesc = sample.filter(r => r.description && String(r.description).trim()).length;
  const languages = new Set(own.map(r => r.language).filter(Boolean));
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const recent = own.some(r => r.pushed_at && (Date.now() - new Date(r.pushed_at).getTime()) < thirtyDays);
  let score = 0;
  if (hasProfileRepo) score += 18;
  if (user.bio && String(user.bio).trim()) score += 12;
  if (user.name && String(user.name).trim()) score += 6;
  if (user.location && String(user.location).trim()) score += 6;
  if (user.blog && String(user.blog).trim()) score += 8;
  if ((user.public_repos ?? 0) >= 5) score += 10;
  if (recent) score += 14;
  if (sample.length > 0 && withDesc / sample.length >= 0.7) score += 14;
  if (languages.size >= 3) score += 6;
  if (own.some(r => (r.stargazers_count || 0) > 0)) score += 6;
  return score;
}
export default async function handler(req, res) {
  const q = req.query || {};
  const username = String(q.username || "").trim();
  if (!username) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(400).send("Missing username: use /api/score?username=YOUR_USERNAME");
  }
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return res.status(200).send(unavailableSvg());
  }
  try {
    const headers = { "User-Agent": "github-profile-studio", Accept: "application/vnd.github+json" };
    const [uRes, rRes, pRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
      fetch(`https://api.github.com/repos/${username}/${username}`, { headers }),
    ]);
    if (!uRes.ok) throw new Error("user fetch failed");
    const user = await uRes.json();
    if (!user || user.message) throw new Error("not found");
    const repos = rRes.ok ? await rRes.json() : [];
    const score = computeScore({ user, repos: Array.isArray(repos) ? repos : [], hasProfileRepo: pRes.ok });
    return res.status(200).send(scoreSvg(`Profile score · ${score}/100`));
  } catch {
    return res.status(200).send(unavailableSvg());
  }
}
