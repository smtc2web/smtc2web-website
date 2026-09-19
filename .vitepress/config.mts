import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "smtc2web",
  description: "一个直播时显示正在播放音乐的小工具",
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
    ],
  },
});
