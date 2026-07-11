/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig = {
  images: {
    // Tillat våre egne, klarerte SVG-placeholdere (public/*.svg).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.imagin.studio" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      ...(supabaseHost
        ? [{ protocol: "https", hostname: supabaseHost }]
        : []),
    ],
  },
};

export default nextConfig;
