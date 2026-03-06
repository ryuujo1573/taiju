import createMdx from "@next/mdx";

export default createMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})({
  pageExtensions: ["md", "mdx", "ts", "tsx"],
});

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
