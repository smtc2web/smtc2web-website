import fs from "fs";
import path from "path";
import { createContentLoader } from "vitepress";

export default createContentLoader("posts/*.md", {
  includeSrc: false,
  render: false,
  excerpt: false,
  transform(rawData) {
    return rawData
      .filter((page) => page.url !== "/posts/" && !page.url.endsWith(".en"))
      .sort((a, b) => {
        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
      });
  },
});
