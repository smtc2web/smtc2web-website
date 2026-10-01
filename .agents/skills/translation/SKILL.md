---
name: translation
description: Translate or localize this repository's VitePress Markdown content (blog posts, wiki pages, and top-level pages) between Simplified Chinese and other languages. Preserves frontmatter, the frontmatter-driven blog H1 convention, links, images, code blocks, Vue components, and site navigation. Use when asked to translate a page or post, add a new language/locale to the site, keep a translation in sync with the Chinese source, or review translation quality. Triggers on 翻译, translate, localization, i18n, add English version, 添加英文版, 多语言.
license: MIT
---

# Translation — smtc2web documentation site

A translation workflow specialized for this VitePress repository. It covers both one-off page
translation and adding a whole locale to the site. Read
[`references/style-guide.md`](references/style-guide.md) and
[`references/glossary.md`](references/glossary.md) before translating body text.

## Repository facts the translator must know

- **Source language is Simplified Chinese (`zh-CN`).** Content lives in `posts/` (blog),
  `wiki/` (docs), and the top-level pages `index.md`, `download.md`, `about.md`, `privacy.md`,
  `contact.md`.
- **VitePress 1.6.x** with `cleanUrls: true`. Internal links are root-relative and
  extensionless, e.g. `/posts/v0.6.5` or `/wiki/change-fonts`.
- **Blog posts have no Markdown H1.** The visible `<h1>` is rendered from frontmatter
  `title` by `.vitepress/theme/CustomLayout.vue` for every path under `posts/`. **Never add a
  `# ...` H1 back to a blog post**, and never remove frontmatter `title`.
- **Wiki pages and standalone pages do** use a Markdown `# H1` that should match frontmatter
  `title`.
- Blog frontmatter fields: `date`, `title`, `author`, `category`, `tags`, `description`.
  Keep the **keys in English**; translate the **values** (`title`, `category`, `tags`,
  `description`) consistently with the glossary.
- **Navigation and sidebar** are defined in `.vitepress/config.mts` under `themeConfig`
  (`nav`, `sidebar`). The `/posts/` sidebar is flat; `/wiki/` groups items by topic.
- **RSS** is generated in `config.mts` `buildEnd()` from `posts/*.md` frontmatter — translated
  posts need their own feed or a locale-aware feed generator.
- Static assets live in `public/`. Images are referenced as `/name.png`.
- Dates are formatted by a hardcoded `formatDate()` in both `.vitepress/theme/CustomLayout.vue`
  and `posts/index.md` (`2026年9月19日`). These must be localized for non-Chinese locales.

## Choose a layout strategy

Decide with the user before writing files:

1. **Single page / a few posts** → translate in place as separate files (e.g.
   `posts/v0.6.5.en.md`) or a new directory, and update links by hand.
2. **Whole site, one target language** → use VitePress i18n. Create `en/…` (or the target
   language code) directory trees mirroring the source, then register `locales` in
   `config.mts` with `rewrites` and per-locale `themeConfig` (`nav`, `sidebar`, `footer`).
   VitePress then exposes `page.filePath` as `en/posts/v0.6.5.md`.
3. **Multiple languages** → same as (2), one directory per language.

> **Critical for strategy 2/3:** `CustomLayout.vue` detects blog pages with
> `page.value.filePath.startsWith("posts/")`. Localized paths start with the locale segment
> (`en/posts/…`) and will not match, so the blog H1 and meta block silently disappear. Update
> the helpers to search path segments instead, e.g.
> ```js
> const segments = () => page.value.filePath.split("/");
> const isBlog = () => segments().includes("posts");
> const isPost = () => isBlog() && segments().at(-1) !== "index.md";
> ```
> Then verify the H1 still renders on localized posts.

## Translation workflow

1. **Confirm scope and target language.** Ask if it is not explicit: which files, which
   language, in-place vs. new locale, and whether the whole site shell (nav/sidebar/footer)
   must be localized too.
2. **Read the source completely** before translating. Do not translate sentence-by-sentence
   without seeing the whole page.
3. **Extract terminology.** Scan for product names, feature names, error strings, and
   recurring nouns. Match them against [`references/glossary.md`](references/glossary.md) and
   add any missing term (source + target + note) before translating, so the term stays
   consistent across the file and the site.
4. **Translate the body**, preserving structure exactly — see the hard rules below and
   [`references/style-guide.md`](references/style-guide.md).
5. **Translate frontmatter values** (`title`, `category`, `tags`, `description`). Keep `date`,
   `author`, and all keys unchanged. For blog posts, do **not** add an H1.
6. **Localize the shell** if the whole locale is being added: `config.mts` (`lang`,
   `title`, `description`, `themeConfig.nav/sidebar/footer`, `locales`), the `formatDate()`
   helpers, and any hardcoded Chinese UI strings in `CustomLayout.vue`.
7. **Validate** (see below) and report which files changed and which translation decisions were
   made.

For long documents, translate section by section (split on `##` headings) and keep a running
term list so later sections reuse earlier choices.

## Hard rules — never violate

- **Never translate or alter:** frontmatter keys, code (inline and fenced), shell commands,
  file paths, URLs, HTML/Vue tags and attributes, `{{ }}` expressions, CSS classes, hex
  colors, version numbers (`v0.6.5`), API endpoints (`/api/now`), and environment variables.
- **Keep Markdown structural tokens** (`---`, `#`, `>`, `-`, `1.`, `|`, backticks) exactly.
  Preserve blank lines and list indentation so VitePress renders identically.
- **Do not add, remove, or reorder headings.** A blog post must not gain an H1.
- **Do not translate link targets or anchors.** Link text may be translated; the target stays
  byte-for-byte. If a heading is translated, its anchor id changes — update every
  intra-page link that points at the old anchor.
- **Keep brand and product names** (`smtc2web`, `Tauri`, `Vite`, `Fluent UI`, `pnpm`,
  `Windows 11`, `GitHub`) untranslated, with official casing.
- **Never invent content.** Do not add explanations, examples, or claims that are not in the
  source. Keep numbers, version numbers, and dates identical.
- **Terminology must be consistent** across the whole site. One term → one translation; record
  it in the glossary.

## Validation

Run the repository build and a structural check before declaring the translation done:

```bash
# 1. Site still builds
pnpm docs:build

# 2. Structure parity + leftover-source-language detection
node .agents/skills/translation/scripts/check-translation.mjs <source.md> <target.md> --target-lang <code>
```

`check-translation.mjs` compares frontmatter keys, heading levels, and fenced code blocks, and
flags residual Chinese characters when the target language is not Chinese. Fix every reported
problem, then re-run.

Finally, manually confirm:

- [ ] Every blog post still has exactly one `<h1>`, coming from frontmatter `title` (not Markdown).
- [ ] No Markdown H1 was added to any file under `posts/`.
- [ ] Code blocks, URLs, file paths, and version numbers are byte-identical to the source.
- [ ] Internal links resolve (build passes; no 404s in `pnpm docs:preview`).
- [ ] Nav/sidebar/footer and the locale config are translated when a locale was added.
- [ ] The glossary covers every recurring term, and all occurrences match it.

## Additional resources

- [`references/glossary.md`](references/glossary.md) — canonical source↔target term list.
- [`references/style-guide.md`](references/style-guide.md) — tone, punctuation, CJK/Latin
  spacing, and Markdown conventions.
- [`scripts/check-translation.mjs`](scripts/check-translation.mjs) — structural validator.
- `.vitepress/config.mts` — nav, sidebar, locales, RSS generation.
- `.vitepress/theme/CustomLayout.vue` — blog H1 + meta rendering, date formatting.
