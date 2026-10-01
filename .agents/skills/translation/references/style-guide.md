# Style guide

Conventions for translating this site's Markdown. These extend the hard rules in `SKILL.md`.

## Tone and voice

- The source is friendly, direct, and technical. Keep that register: plain, concise, no
  marketing hype, no filler.
- Address the reader as "you". Avoid first-person plural unless the source uses "我们".
- Keep sentences short. Chinese often packs several clauses into one sentence; split them in
  languages that read better with shorter sentences.
- Changelog entries are terse and itemised. Do not turn a bullet into a paragraph.

## Punctuation

- **Chinese → English:** replace full-width punctuation (`，。、：；！？（）【】「」`) with
  half-width (`, . : ; ! ? ( ) [ ] " "`). Remove the Chinese space that often surrounds
  punctuation.
- Do not leave a full-width character in a non-Chinese target unless it is part of a quoted
  string or a proper noun.
- Use the target language's quotation marks (`"…"` for English, `「…」` for Japanese, etc.).
- The em dash in Chinese `——` usually becomes an em dash ` — ` in English.

## CJK / Latin spacing and typography

- When Chinese and Latin/numeric text are adjacent in a **Chinese** target, insert a thin
  space for readability (`使用 Vite 构建`), matching the existing source style.
- In English targets, follow normal English spacing. Keep a space between Latin and CJK only
  if CJK is intentionally retained (e.g. a product name).
- Preserve the source's use of **bold** and `inline code` exactly, even if the emphasis lands
  awkwardly — the markup is part of the layout, not prose.
- Do not convert `「」` to `""` or vice versa if the source deliberately uses one for UI labels.

## Markdown structure

- Keep the exact heading levels. Translate heading text only.
- Keep list markers (`-`, `1.`) and indentation. A nested bullet stays nested.
- Keep blockquotes (`>`) intact, including nested headings inside them
  (`> ### 轻量模式` → `> ### Lightweight Mode`).
- Keep tables' column counts, alignment row (`| --- |`), and every `|`.
- Keep fenced-code-block info strings (` ```bash `) and never translate code inside them —
  including shell comments (`# 克隆仓库`). Comments are the one place a reader might want a
  translation; if so, add it as a *new* comment line, never by editing the original.
- Keep HTML/Vue tags, attributes, and `<script setup>` / `<template>` blocks untouched.
  Translate only human-readable text inside templates and frontmatter values.
- Preserve the trailing newline and the blank line after frontmatter.

## Frontmatter

- Translate the values of `title`, `category`, `tags`, and `description`.
- Keep `date` and `author` unchanged. `date` is machine-parsed for sorting and the RSS feed —
  never reformat it.
- `tags` is a YAML list; translate each item, keep the same number of items.
- **Blog posts:** there is no body H1. Do not add one. The H1 comes from `title`.
- **Wiki / standalone pages:** the body `# H1` must match the frontmatter `title` after
  translation. Translate both together so they stay in sync.

## Links, anchors, and assets

- Link targets are never translated. Only the visible link text changes.
- Heading translations change anchor ids. VitePress derives ids from the heading text, so any
  link such as `[轻量模式](#轻量模式)` must be updated to the new id
  (`[Lightweight Mode](#lightweight-mode)`).
- Root-relative links (`/posts/v0.6.5`, `/wiki/change-fonts`) stay as-is for a single-language
  site. When adding a locale, prefix them with the locale path (`/en/posts/…`) or rely on
  VitePress `rewrites`.
- Image paths (`/bilibili-social-account.png`) are unchanged. Translate `alt` text.

## Dates and numbers

- Keep numeric values, version numbers, percentages, and durations byte-identical
  (`8%`, `100ms`, `v0.6.5`, `5秒` → `5 seconds` only in prose, never inside code).
- Localize `formatDate()` output for the locale rather than translating the formatted result.
  See `CustomLayout.vue` and `posts/index.md`.
- English dates read `September 19, 2026`; keep the same underlying `date` value.

## Review checklist

- [ ] No full-width punctuation left in a non-Chinese target.
- [ ] Terminology matches `references/glossary.md`.
- [ ] No invented content, no dropped sentences.
- [ ] Code, URLs, paths, and numbers unchanged.
- [ ] Heading levels and list/table structure unchanged.
- [ ] Blog post has no new H1; frontmatter `title` preserved.
- [ ] Intra-page anchor links updated after heading translation.
