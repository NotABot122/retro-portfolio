import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Runs after real files (public assets, _next, .html) are served, so
      // only directory-style URLs for the embedded /madden static export fall
      // through here and get mapped to their index.html.
      afterFiles: [
        { source: "/madden", destination: "/madden/index.html" },
        { source: "/madden/", destination: "/madden/index.html" },
        { source: "/madden/:path+/", destination: "/madden/:path+/index.html" },
        { source: "/madden/:path+", destination: "/madden/:path+/index.html" },
      ],
      beforeFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
