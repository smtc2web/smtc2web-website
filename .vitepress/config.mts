import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vitepress";

const siteUrl = "https://smtc2web.org";
const feedMeta = {
  title: "smtc2web 博客",
  description: "一个直播时显示正在播放音乐的小工具",
  language: "zh-cn",
};

let renderMarkdown: ((markdown: string) => string) | undefined;

function escapeXml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[
        c
      ]!
  );
}

function plainText(markdown: string) {
  return markdown
    .replace(/^---[\s\S]*?\r?\n---/, "")
    .replace(/^\s*#\s+.*(?:\r?\n|$)/, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`[\]()!]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function generateFeed(srcDir: string, outDir: string) {
  const postsDir = path.join(srcDir, "posts");
  const items = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md") && file !== "index.md")
    .map((file) => {
      const fullPath = path.join(postsDir, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
      const frontmatter: Record<string, string> = {};
      for (const line of block.split(/\r?\n/)) {
        const kv = line.match(/^(\w+):\s*(.+)$/);
        if (kv) frontmatter[kv[1]] = kv[2].trim();
      }
      const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
      const url = `${siteUrl}/posts/${file.replace(/\.md$/, "")}`;
      const html = renderMarkdown ? renderMarkdown(body) : `<p>${plainText(raw)}</p>`;
      return {
        title: frontmatter.title ?? file,
        html: html.replace(/<a class="header-anchor"[^>]*>[\s\S]*?<\/a>/g, ""),
        date: frontmatter.date ? new Date(frontmatter.date) : fs.statSync(fullPath).mtime,
        url,
      };
    })
    .sort((a, b) => +b.date - +a.date);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedMeta.title)}</title>
    <link>${siteUrl}/posts/</link>
    <description>${escapeXml(feedMeta.description)}</description>
    <language>${feedMeta.language}</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <description>${escapeXml(item.html)}</description>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>
`;
  fs.writeFileSync(path.join(outDir, "feed.xml"), xml, "utf8");
  console.log(`✓ RSS generated feed.xml (${items.length} posts)`);
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "smtc2web",
  description: "一个直播时显示正在播放音乐的小工具",
  head: [
    [
      "link",
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "smtc2web 博客",
        href: "/feed.xml",
      },
    ],
  ],
  buildEnd(siteConfig) {
    generateFeed(siteConfig.srcDir, siteConfig.outDir);
  },
  markdown: {
    config(md) {
      renderMarkdown = (markdown) => md.render(markdown);
    },
  },
  sitemap: {
    hostname: "https://smtc2web.org",
  },
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    editLink: true,
    docsRepo: "https://github.com/smtc2web/smtc2web-website",
    docsBranch: "master",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      { text: "博客", link: "/posts/" },
      { text: "关于", link: "/about" },
      { text: "隐私政策", link: "/privacy" },
      { text: "联系我", link: "/contact" },

      { text: "下载", link: "/download" },
      {
        text: "Wiki",
        items: [
          { text: "官方 Wiki", link: "/wiki" },
          { text: "DeepWiki", link: "https://deepwiki.com/smtc2web/smtc2web" },
        ],
      },
    ],
    footer: {
      message:
        '基于 <a href="https://github.com/smtc2web/smtc2web">MIT 许可</a> 发布',
      copyright: "Copyright © 2025–2026 AkarinLiu",
    },
    sidebar: {
      "/posts/": [
        {
          text: "博客",
          items: [{ text: "所有文章", link: "/posts/" }],
        },
      ],
      "/wiki/": [
        {
          text: "Wiki",
          items: [
            {
              text: "编译",
              items: [
                { text: "在 Windows 上编译", link: "/wiki/compile/windows.md" },
              ],
            },
            { text: "更改字体", link: "/wiki/change-fonts.md" },
            { text: "SMTC 协议适配列表", link: "/wiki/smtc-protocol-list.md" },
            { text: "主题开发指南", link: "/wiki/theme-dev-guide.md" },
          ],
        },
      ],
    },

    search: {
      provider: "local",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/smtc2web/smtc2web" },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM112 416c-26.51 0-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48s-21.49 48-48 48zm157.533 0h-34.335c-6.011 0-11.051-4.636-11.442-10.634c-5.214-80.05-69.243-143.92-149.123-149.123c-5.997-.39-10.633-5.431-10.633-11.441v-34.335c0-6.535 5.468-11.777 11.994-11.425c110.546 5.974 198.997 94.536 204.964 204.964c.352 6.526-4.89 11.994-11.425 11.994zm103.027 0h-34.334c-6.161 0-11.175-4.882-11.427-11.038c-5.598-136.535-115.204-246.161-251.76-251.76C68.882 152.949 64 147.935 64 141.774V107.44c0-6.454 5.338-11.664 11.787-11.432c167.83 6.025 302.21 141.191 308.205 308.205c.232 6.449-4.978 11.787-11.432 11.787z"/></svg>',
        },
        link: "/feed.xml",
        ariaLabel: "RSS",
      },
    ],
  },
});
