# AGENTS.md - Repository Guide for AI Agents

This is a **VitePress documentation website** for the smtc2web project (a live music display tool). Content is in Chinese.

## Build Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm docs:dev

# Build for production
pnpm docs:build

# Preview production build
pnpm docs:preview
```

## Project Structure

```
.
├── .vitepress/
│   ├── config.mts          # Site configuration
│   ├── theme/
│   │   ├── index.ts        # Custom theme entry
│   │   └── style.css       # Custom styles
│   ├── cache/              # Build cache (gitignored)
│   └── dist/               # Build output (gitignored)
├── index.md                # Homepage (Chinese)
├── download.md             # Download page
├── wiki/                   # Documentation
│   ├── compile/
│   ├── *.md
├── public/                 # Static assets
└── package.json
```

## Code Style Guidelines

### TypeScript/JavaScript

- Use double quotes for strings
- Use semicolons
- 2-space indentation
- Use `satisfies` keyword for type annotations (see `theme/index.ts`)

### Markdown

- Use YAML frontmatter for page metadata
- Chinese language content preferred
- Use level-2 (`##`) and level-3 (`###`) headings for structure
- Code blocks specify language when applicable

### VitePress Configuration

- Config file: `.vitepress/config.mts` (TypeScript)
- Theme config: `.vitepress/theme/index.ts`
- Follow existing navigation structure in `nav` and `sidebar`
- Use `cleanUrls: true` (URLs without `.html` extension)

### File Naming

- Use kebab-case for markdown files (e.g., `change-fonts.md`)
- Use descriptive names for content files
- Static assets go in `public/` directory

## Important Notes

- No test suite is configured
- No linting/formatting tools are set up
- This is a documentation site only (no application code)
- Site is deployed to GitHub Pages from `.vitepress/dist`
- Uses pnpm as package manager

## Common Tasks

Adding a new wiki page:
1. Create `.md` file in appropriate `wiki/` subdirectory
2. Add entry to sidebar in `.vitepress/config.mts`
3. Use frontmatter for metadata if needed

Updating navigation:
- Edit `nav` array in `.vitepress/config.mts` for top navigation
- Edit `sidebar` object for left sidebar structure

## Dependencies

- `vitepress`: ^1.6.4 (documentation framework)
- Vue 3 (via VitePress)

## UI Theme (终末地风味)

The site is skinned with an "Arknights: Endfield"-flavoured industrial theme.
Everything lives in `.vitepress/theme/`:

```
.vitepress/theme/
├── index.ts            # entry: imports endfield.css, then style.css
├── endfield.css        # the part kit (buttons, record rows, eyebrows, command bar, ...)
├── style.css           # maps VitePress onto that kit + home, code, tables, footer
├── EndfieldHome.vue    # home page: wordmark, icon frame, latest posts
├── CustomLayout.vue    # slot layout: page title strip, post meta, language switch, Bilibili card
├── contours/           # faint background contour lines (SVG)
└── fonts/              # Saira variable font (SIL OFL 1.1) + licence
```

**Variant card** — change the palette in one place, the `:root` block in `style.css`:

- variant: `standard` (accent yellow `#FFFA00` / paper neutral / cut standard / ground contours / density standard / motion full)
- main visual: the home cut-corner frame holding the product icon (`public/favicon.png`, the crab with headphones) with a plate that spells out the signal chain (Windows media session → local service `/api/now` → theme page → browser · OBS)
- page types: home is a showcase page; blog, wiki and the other pages are reading pages

Rules that keep it consistent:

- One accent colour only, fill only, and only for "here / pressable / look at this". Never use it as a line or text on the light theme.
- Red is for deleting things and nothing else. Radius is always 0; no shadows, glows or decorative gradients.
- A cut corner means "pressable" (buttons, tags, chips, pagers); body text and pictures stay square.
- Latin labels are wide and upper case with 0.14em tracking; Chinese keeps normal tracking and bold weight.
- Numbers, dates and word counts are computed at build time (`posts.data.mjs`, `posts-en.data.mjs`, `wiki.data.mjs`) — never hard-code them.
- All motion is disabled under `prefers-reduced-motion: reduce`.

When adding a page or a part, reuse the `ef-` classes from `endfield.css` instead of
inventing colours or borders. The three-colour strip appears in exactly two places:
the top edge of the command bar and under a page title.

## Git

Never commit:
- `node_modules/`
- `.vitepress/dist/`
- `.vitepress/cache/`

These are already in `.gitignore`.
