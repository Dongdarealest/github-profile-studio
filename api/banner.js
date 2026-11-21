// GET /api/banner?text=Hello&sub=github.com/you&color=A98B4F&bg=0D1117&accent=F2EFE9
// A wide animated header banner. All colours are hex, with or without #.
function hex(v, fallback) {
  const s = String(v || fallback).replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(s) ? s : fallback;
}
function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export function bannerSvg({ text, sub, color, bg, accent }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), a = hex(accent, "F2EFE9");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="220" viewBox="0 0 900 220">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#${b}"/><stop offset="1" stop-color="#${c}"/>
    </linearGradient>
  </defs>
  <rect width="900" height="220" fill="url(#g)"/>
  <path d="M0 168 Q 225 128 450 168 T 900 168 V220 H0 Z" fill="#${c}" opacity="0.35">
    <animate attributeName="d" dur="7s" repeatCount="indefinite"
      values="M0 168 Q 225 128 450 168 T 900 168 V220 H0 Z;M0 158 Q 225 188 450 158 T 900 158 V220 H0 Z;M0 168 Q 225 128 450 168 T 900 168 V220 H0 Z"/>
  </path>
  <text x="450" y="102" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="52" fill="#${a}">${esc(text || "Hello, world")}</text>
  ${sub ? `<text x="450" y="140" text-anchor="middle" font-family="Verdana, sans-serif" font-size="16" letter-spacing="3" fill="#${a}" opacity="0.85">${esc(sub)}</text>` : ""}
</svg>`;
}
export default function handler(req, res) {
  const q = req.query || {};
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(bannerSvg(q));
}
