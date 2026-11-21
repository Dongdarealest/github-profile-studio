// GET /api/wave?color=A98B4F&bg=0D1117
// A slim animated wave divider / footer in any colour.
function hex(v, fallback) {
  const s = String(v || fallback).replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(s) ? s : fallback;
}
export function waveSvg({ color, bg }) {
  const c = hex(color, "A98B4F"), b = hex(bg, "0D1117");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="110" viewBox="0 0 900 110">
  <rect width="900" height="110" fill="#${b}"/>
  <path d="M0 55 Q 225 15 450 55 T 900 55 V110 H0 Z" fill="#${c}">
    <animate attributeName="d" dur="6s" repeatCount="indefinite"
      values="M0 55 Q 225 15 450 55 T 900 55 V110 H0 Z;M0 45 Q 225 85 450 45 T 900 45 V110 H0 Z;M0 55 Q 225 15 450 55 T 900 55 V110 H0 Z"/>
  </path>
</svg>`;
}
export default function handler(req, res) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(waveSvg(req.query || {}));
}
