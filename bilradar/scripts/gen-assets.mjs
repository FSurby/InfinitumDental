// Genererer lokale SVG-placeholdere for bilbilder og merkelogoer.
// Kjør: node scripts/gen-assets.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = resolve(root, "public");
mkdirSync(resolve(pub, "cars"), { recursive: true });
mkdirSync(resolve(pub, "brands"), { recursive: true });
mkdirSync(resolve(pub, "blog"), { recursive: true });

// Stilisert bil-silhuett (hvit) – sentrert i 1200x750.
function carGlyph(fill = "#ffffff", opacity = 0.95) {
  return `<g transform="translate(600,430)" fill="${fill}" fill-opacity="${opacity}">
    <path d="M-250,40 C-250,10 -230,-6 -205,-10 L-150,-18 C-120,-60 -80,-86 -20,-90 L70,-90 C140,-90 180,-58 215,-14 L250,-6 C275,0 285,16 285,40 L285,66 C285,74 279,80 271,80 L232,80 A44,44 0 0 0 144,80 L-120,80 A44,44 0 0 0 -208,80 L-242,80 C-250,80 -256,74 -256,66 Z"/>
    <path d="M-120,-70 L60,-70 C104,-70 134,-52 158,-20 L-150,-20 C-140,-46 -140,-60 -120,-70 Z" fill="#0b0f0a" fill-opacity="0.18"/>
    <circle cx="-164" cy="80" r="30" fill="#0b0f0a" fill-opacity="0.85"/>
    <circle cx="-164" cy="80" r="14" fill="${fill}"/>
    <circle cx="188" cy="80" r="30" fill="#0b0f0a" fill-opacity="0.85"/>
    <circle cx="188" cy="80" r="14" fill="${fill}"/>
  </g>`;
}

function carSvg(a, b) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="v" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.12"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#g)"/>
  <rect width="1200" height="750" fill="url(#v)"/>
  <g stroke="#ffffff" stroke-opacity="0.08" stroke-width="2">
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${94 * i}" x2="1200" y2="${94 * i}"/>`).join("")}
  </g>
  <ellipse cx="600" cy="560" rx="300" ry="30" fill="#000000" fill-opacity="0.15"/>
  ${carGlyph()}
</svg>`;
}

// Fargepar per variant.
const cars = {
  suv: ["#3f6212", "#65a30d"],
  "suv-2": ["#166534", "#22c55e"],
  sedan: ["#0f172a", "#334155"],
  kompakt: ["#1e3a8a", "#3b82f6"],
  smaabil: ["#7c2d12", "#f97316"],
  stasjonsvogn: ["#134e4a", "#14b8a6"],
  premium: ["#111827", "#4b5563"],
  "premium-2": ["#312e81", "#6366f1"],
  elbil: ["#365314", "#84cc16"],
  interior: ["#292524", "#57534e"],
  detalj: ["#1c1917", "#44403c"],
};
for (const [name, [a, b]] of Object.entries(cars)) {
  writeFileSync(resolve(pub, "cars", `${name}.svg`), carSvg(a, b));
}

// Merkelogo-monogram.
const brands = {
  tesla: ["Tesla", "#e11d48"],
  toyota: ["Toyota", "#dc2626"],
  volkswagen: ["VW", "#1d4ed8"],
  volvo: ["Volvo", "#1e3a5f"],
  mg: ["MG", "#b91c1c"],
  byd: ["BYD", "#dc2626"],
  skoda: ["Škoda", "#166534"],
  hyundai: ["Hyundai", "#1e40af"],
  kia: ["Kia", "#111827"],
  polestar: ["PS", "#0f766e"],
  nissan: ["Nissan", "#b91c1c"],
  cupra: ["Cupra", "#78350f"],
};
function brandSvg(label, color) {
  const short = label.length > 4 ? label.slice(0, 2) : label;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" role="img">
  <rect width="200" height="200" rx="36" fill="${color}"/>
  <text x="100" y="100" dy="0.35em" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${short.length > 3 ? 54 : 76}" font-weight="800" fill="#ffffff">${short}</text>
</svg>`;
}
for (const [slug, [label, color]] of Object.entries(brands)) {
  writeFileSync(resolve(pub, "brands", `${slug}.svg`), brandSvg(label, color));
}

// Blogg-cover.
const blog = {
  "leasing-guide": ["#3f6212", "#84cc16", "Leasing vs billån"],
  "elbil-vinter": ["#0c4a6e", "#38bdf8", "Elbil om vinteren"],
  "mest-solgte": ["#1e293b", "#64748b", "Markedet 2026"],
};
function blogSvg(a, b, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  <g stroke="#ffffff" stroke-opacity="0.1" stroke-width="2">${Array.from({ length: 10 }, (_, i) => `<line x1="${120 * i}" y1="0" x2="${120 * i}" y2="675"/>`).join("")}</g>
  <text x="80" y="600" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="800" fill="#ffffff" fill-opacity="0.9">${label}</text>
</svg>`;
}
for (const [name, [a, b, label]] of Object.entries(blog)) {
  writeFileSync(resolve(pub, "blog", `${name}.svg`), blogSvg(a, b, label));
}

console.log("Genererte assets i public/cars, public/brands, public/blog");
