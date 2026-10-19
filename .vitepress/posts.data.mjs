import fs from "node:fs";
import path from "node:path";
import { createContentLoader } from "vitepress";

// 字数在构建时算一次，页面上就是真实计数
function countChars(url) {
  try {
    const file = path.join(process.cwd(), `${url.replace(/^\//, "")}.md`);
    const raw = fs.readFileSync(file, "utf8");
    const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
    return body.replace(/\s/g, "").length;
  } catch {
    return 0;
  }
}

export default createContentLoader("posts/*.md", {
  includeSrc: false,
  render: false,
  excerpt: false,
  transform(rawData) {
    return rawData
      .filter((page) => page.url !== "/posts/" && !page.url.endsWith(".en"))
      .sort((a, b) => {
        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
      })
      .map((page) => ({
        ...page,
        chars: countChars(page.url),
      }));
  },
});
