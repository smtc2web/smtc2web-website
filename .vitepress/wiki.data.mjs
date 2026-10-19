import fs from "node:fs";
import path from "node:path";
import { createContentLoader } from "vitepress";

// Wiki 每页的字数，索引页上就是真实计数
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

export default createContentLoader("wiki/**/*.md", {
  includeSrc: false,
  render: false,
  excerpt: false,
  transform(rawData) {
    return rawData
      .filter((page) => page.url !== "/wiki/")
      .map((page) => ({
        ...page,
        chars: countChars(page.url),
      }));
  },
});
