import createMdx from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev({
  remoteBindings: true,
  persist: false,
});

export default createMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})({
  pageExtensions: ["md", "mdx", "ts", "tsx"],
});
