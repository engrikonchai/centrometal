import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    // Next.js 16 narrowed the default `qualities` to [75] and now coerces any
    // other value to the nearest allowed one. BrandMark renders logos at
    // quality 95 (small, high-contrast wordmarks that visibly artifact at 75)
    // and was silently being downgraded — allow both.
    qualities: [75, 95],
  },
  turbopack: {
    // Must be absolute — a relative "." makes the build warn and fall back.
    root: path.resolve(),
  },
  async redirects() {
    return [
      // The redesign folds "O nama" into a section of the contact page and
      // merges the three legacy forms into /upit. 308s so the old URLs' SEO
      // value transfers rather than being dropped.
      { source: "/o-nama", destination: "/kontakt#o-nama", permanent: true },
      { source: "/en/about", destination: "/en/contact#o-nama", permanent: true },
    ];
  },
};

export default nextConfig;
