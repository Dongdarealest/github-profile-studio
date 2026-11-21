// GET /api/banner?text=Hello&sub=github.com/you&color=A98B4F&bg=0D1117&accent=F2EFE9&style=glass
// A wide animated header banner. All colours are hex, with or without #.
function hex(v, fallback) {
  const s = String(v || fallback).replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(s) ? s : fallback;
}
function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export function bannerSvg({ text, sub, color, bg, accent, style }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117"), a = hex(accent, "F2EFE9");
  const wave = `<path d="M0 168 Q 225 128 450 168 T 900 168 V220 H0 Z" fill="#${c}" opacity="0.35">
    <animate attributeName="d" dur="7s" repeatCount="indefinite"
      values="M0 168 Q 225 128 450 168 T 900 168 V220 H0 Z;M0 158 Q 225 188 450 158 T 900 158 V220 H0 Z;M0 168 Q 225 128 450 168 T 900 168 V220 H0 Z"/>
  </path>`;
  const words = `<text x="450" y="102" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="52" fill="#${a}">${esc(text || "Hello, world")}</text>
  ${sub ? `<text x="450" y="140" text-anchor="middle" font-family="Verdana, sans-serif" font-size="16" letter-spacing="3" fill="#${a}" opacity="0.85">${esc(sub)}</text>` : ""}`;
  if (style === "glass") {
    // Liquid Glass: translucent body over a soft accent wash, blurred
    // specular bloom top-left, bright hairline on the top edge, glass border.
    return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="220" viewBox="0 0 900 220">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#${b}"/><stop offset="1" stop-color="#${c}"/>
    </linearGradient>
    <linearGradient id="glassBorder" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/>
      <stop offset="0.45" stop-color="#${c}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#${c}"/>
    </linearGradient>
    <radialGradient id="glassSpec" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="glassBlur" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <clipPath id="glassClip"><rect width="900" height="220" rx="18"/></clipPath>
  </defs>
  <rect width="900" height="220" rx="18" fill="url(#g)" opacity="0.55"/>
  <rect width="900" height="220" rx="18" fill="#${b}" fill-opacity="0.55"/>
  <g clip-path="url(#glassClip)">
    <ellipse cx="170" cy="6" rx="330" ry="95" fill="url(#glassSpec)" filter="url(#glassBlur)"/>
    ${wave}
  </g>
  <rect width="899" height="219" x="0.5" y="0.5" rx="18" fill="none" stroke="url(#glassBorder)" stroke-width="1.5"/>
  <path d="M30 2.5 H870" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round"/>
  ${words}
</svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="220" viewBox="0 0 900 220">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#${b}"/><stop offset="1" stop-color="#${c}"/>
    </linearGradient>
  </defs>
  <rect width="900" height="220" fill="url(#g)"/>
  ${wave}
  ${words}
</svg>`;
}
export default function handler(req, res) {
  const q = req.query || {};
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(bannerSvg(q));
}
