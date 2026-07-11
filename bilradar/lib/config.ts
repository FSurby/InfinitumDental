// Sentral konfigurasjon. Bytt SITE_NAME for å endre merkenavnet overalt.
export const SITE_NAME = "Bilradar";
export const SITE_TAGLINE = "Norges beste biltilbud – samlet på ett sted";
export const SITE_DESCRIPTION =
  "Sammenlign de beste tilbudene på leasing, billån og bilabonnement i Norge. Filtrer på merke, segment, drivlinje og pris – finn din neste bil raskt.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

// E-poster som får admin-tilgang selv uten profiles-rad (bootstrapping).
// Kommaseparert liste i env, f.eks. ADMIN_EMAILS="deg@eksempel.no".
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const NAV_LINKS = [
  { href: "/tilbud", label: "Tilbud" },
  { href: "/merker", label: "Mest solgte" },
  { href: "/blogg", label: "Blogg" },
] as const;
