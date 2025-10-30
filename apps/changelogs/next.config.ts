import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig = {
  /* config options here */
  transpilePackages: ["geist"],
  async rewrites() {
    return [
      {
        source: "/c/:slug", // e.g., /c/date
        destination: "/", // still serves the home page
      },
    ];
  },
};

export default withMDX(nextConfig);
