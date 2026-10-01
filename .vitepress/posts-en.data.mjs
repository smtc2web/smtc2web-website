import { createContentLoader } from "vitepress";

export default createContentLoader("posts/*.en.md", {
  includeSrc: false,
  render: false,
  excerpt: false,
  transform(rawData) {
    return rawData
      .filter((page) => !page.url.endsWith("index.en"))
      .sort((a, b) => {
        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
      });
  },
});
