# Glossary

Canonical term list for translating smtc2web content. **One source term maps to exactly one
target term.** Add a row before using a new term, and never translate a term differently just
because the sentence reads more naturally — consistency across the site wins.

Columns: `源 (zh-CN)` · `English` · `Notes`.

## Product & brand

| 源 (zh-CN) | English | Notes |
| --- | --- | --- |
| smtc2web | smtc2web | Never capitalize or split. Always lowercase. |
| Windows 11 | Windows 11 | Keep official casing. |
| 媒体会话 | media session | Windows SMTC term. |
| 媒体控制 | media controls | |
| SMTC | SMTC | System Media Transport Controls. Do not expand on first use unless the source does. |
| WebView | WebView | Keep casing. |
| Rust 进程 | Rust process | |
| 系统托盘 | system tray | |
| 托盘图标 | tray icon | |
| 主题 | theme | UI theme (Spotify theme, default theme). |
| 轻量模式 | Lightweight Mode | Product feature name; capitalize. |
| 夜间构建 | nightly build | |
| 热修复 | hotfix | |
| 正式发布 | official release / stable release | Match the source's emphasis; prefer "release" in headings. |
| 自定义端口 | custom port | |
| 多语言 | multilingual / multi-language | Prefer "multilingual" for the feature. |
| 标题栏 | title bar | |
| 配置文件 | configuration file | |
| 轮询间隔 | polling interval | |
| 播放状态 | playback state | |
| 曲目 | track | |
| 专辑封面 | album art | |

## Blog & docs metadata

| 源 (zh-CN) | English | Notes |
| --- | --- | --- |
| 博客 | Blog | Page title / nav. |
| 更新日志 | Changelog | `category` value; also a common section heading. |
| 新版本更新 | Release | `category` value. |
| 公告板 | Announcements | `category` value. |
| 重大更新 | Major update | |
| 重大变更 | Breaking changes | |
| 已知问题 | Known issues | |
| 新增 | Added | Prefer Keep a Changelog wording in changelog sections. |
| 变更 | Changed | |
| 修复 | Fixed | |
| 优化 | Improved / Optimized | Use "Improved" for changelog "优化" sections. |
| 移除 | Removed | |
| 弃用 | Deprecated | |

## Site shell

| 源 (zh-CN) | English | Notes |
| --- | --- | --- |
| 主页 | Home | `nav` label. |
| 下载 | Download | |
| 关于 | About | |
| 隐私政策 | Privacy Policy | |
| 联系我 | Contact | |
| Wiki | Wiki | |
| 官方 Wiki | Official Wiki | |
| 所有文章 | All posts | Blog sidebar item. |
| 编译 | Build | Wiki sidebar group. |
| 更改字体 | Change fonts | |
| 主题开发指南 | Theme development guide | |
| 协议适配列表 | Protocol support list | |
| 基于 … 发布 | Released under … | Footer message. |

## Blog posts — additional terms (EN)

Terms that recur in `posts/*.md` and were not covered above.

| 源 (zh-CN) | English | Notes |
| --- | --- | --- |
| 正式发布 | released / official release | In titles use "released" (`v0.1.1 released`); in prose use "official release". |
| 新增功能 / 新功能 | New features | Changelog section heading. |
| 更新内容 | What's changed | |
| 安装 | Installation | |
| 安装和升级 | Installation and upgrade | |
| 其他改进 | Other improvements | |
| 修复与优化 | Fixes and improvements | |
| 后续计划 | What's next | |
| 依赖 / 依赖更新 | Dependencies / Dependency updates | |
| 依赖变更 | Dependency changes | |
| 破坏性变更 | Breaking changes | |
| 安全 | security | Tag value. |
| 更新 | Update | Tag value / heading. |
| 专辑图片 / 专辑封面 | album art | |
| 下载 | Download | Section heading. |
| 进程过滤 | process filtering | |
| 开机自启动 | launch at startup | |
| 局域网开放 | LAN access | |
| 开发服务器 | development server | |
| 控制台 / 显示控制台功能 | console / display console feature | |
| 日志文件 | log file | |
| 依赖包 | package | Used in the security table. |
| 生态 | ecosystem | Used in the security table. |
| 严重程度 | Severity | Security table header. |
| 漏洞描述 | Vulnerability description | Security table header. |
| 受影响版本 | Affected versions | Security table header. |
| 修复版本 | Patched version | Security table header. |
| 创建日期 / 修复日期 | Created / Fixed | Security table headers. |
| 严重 / 高 / 中 / 低 | Critical / High / Medium / Low | Security severity values. |

## Other languages

Add per-language sections when a new locale is introduced, e.g.:

```markdown
## 日本語 (ja)

| 源 (zh-CN) | 日本語 | Notes |
| --- | --- | --- |
| 轻量模式 | 軽量モード | |
```

Do not mix languages inside one table; keep a separate table per target language.
