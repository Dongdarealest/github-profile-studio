// GET /api/typing?lines=Developer;Builder;Learner&color=A98B4F&bg=0D1117&size=24
// A typewriter SVG. Lines are separated by ';' — the text IS the parameter.
function hex(v, fallback) {
  const s = String(v || fallback).replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(s) ? s : fallback;
}
function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export function typingSvg({ lines, color, bg, size }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117");
  const sz = Math.min(48, Math.max(12, parseInt(size || "24", 10) || 24));
  const arr = String(lines || "Developer;Open source builder;Always learning")
    .split(";").map(s => s.trim()).filter(Boolean).slice(0, 6);
  const per = 3.2, total = per * arr.length;
  const texts = arr.map((line, i) => {
    const chars = Math.max(1, line.length);
    const typeEnd = (i * per + 1.6) / total, holdEnd = (i * per + 2.7) / total;
    const begin = (i * per) / total, end = ((i + 1) * per) / total;
    return `<g opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;${begin + 0.001};${end - 0.001};1" dur="${total}s" repeatCount="indefinite" begin="0s"/>
      <clipPath id="cp${i}"><rect x="0" y="0" height="60" width="0">
        <animate attributeName="width" values="0;${chars * sz * 0.62};${chars * sz * 0.62};0" keyTimes="0;${Math.max(0.01, (typeEnd - begin) / (end - begin))};${Math.max(0.02, (holdEnd - begin) / (end - begin))};1" dur="${per}s" begin="${i * per}s" repeatCount="indefinite"/>
      </rect></clipPath>
      <text x="450" y="40" text-anchor="middle" clip-path="url(#cp${i})" font-family="'Courier New', monospace" font-size="${sz}" fill="#${c}">${esc(line)}</text>
    </g>`;
  }).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="60" viewBox="0 0 900 60">
  <rect width="900" height="60" fill="#${b}"/>
  ${texts}
</svg>`;
}
export default function handler(req, res) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(typingSvg(req.query || {}));
}
