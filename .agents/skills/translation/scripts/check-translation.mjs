#!/usr/bin/env node
// Structural validator for translated Markdown files.
//
// Usage:
//   node check-translation.mjs <source.md> <target.md> [--target-lang <code>]
//
// Checks that a translation preserves the source's frontmatter keys, heading levels,
// fenced code blocks, and link targets, and (unless the target is Chinese) reports
// residual Chinese characters. Exits non-zero when problems are found.

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--target-lang") flags.targetLang = args[++i];
  else if (args[i] === "--allow-cjk") flags.allowCjk = true;
  else positional.push(args[i]);
}

const [sourcePath, targetPath] = positional;
if (!sourcePath || !targetPath) {
  console.error(
    "Usage: node check-translation.mjs <source.md> <target.md> [--target-lang <code>]"
  );
  process.exit(2);
}

const errors = [];
const warnings = [];

function read(file) {
  if (!fs.existsSync(file)) {
    errors.push(`File not found: ${file}`);
    return "";
  }
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
}

function splitFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { frontmatter: "", body: text, hasFrontmatter: false };
  return {
    frontmatter: match[1],
    body: text.slice(match[0].length),
    hasFrontmatter: true,
  };
}

function frontmatterKeys(frontmatter) {
  return frontmatter
    .split(/\r?\n/)
    .map((line) => line.match(/^([A-Za-z0-9_-]+):/)?.[1])
    .filter(Boolean);
}

// Remove fenced code blocks so their contents never count as prose. Keeps line count intact.
function stripCodePreserveLines(body) {
  let inFence = false;
  return body
    .split(/\r?\n/)
    .map((line) => {
      if (/^\s*(`{3,}|~{3,})/.test(line)) {
        inFence = !inFence;
        return "";
      }
      return inFence ? "" : line;
    })
    .join("\n");
}

// Remove fenced code blocks so their contents never count as prose.
function stripCode(body) {
  return body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "");
}

function headingLevels(body) {
  const levels = [];
  const re = /^(\#{1,6})[ \t]+\S/gm;
  let m;
  while ((m = re.exec(stripCode(body)))) levels.push(m[1].length);
  return levels;
}

function codeFenceCount(body) {
  return (body.match(/^(`{3,}|~{3,})/gm) || []).length;
}

function linkTargets(body) {
  const targets = [];
  const re = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(stripCode(body)))) targets.push(m[1]);
  return targets;
}

function isChineseLang(code) {
  return !code || /^zh(-|$)/i.test(code);
}

const source = read(sourcePath);
const target = read(targetPath);
const src = splitFrontmatter(source);
const tgt = splitFrontmatter(target);

if (src.hasFrontmatter !== tgt.hasFrontmatter) {
  errors.push("Frontmatter presence differs between source and target.");
}

const srcKeys = frontmatterKeys(src.frontmatter);
const tgtKeys = frontmatterKeys(tgt.frontmatter);
const missingKeys = srcKeys.filter((k) => !tgtKeys.includes(k));
const extraKeys = tgtKeys.filter((k) => !srcKeys.includes(k));
if (missingKeys.length) errors.push(`Missing frontmatter keys: ${missingKeys.join(", ")}`);
if (extraKeys.length) errors.push(`Extra frontmatter keys: ${extraKeys.join(", ")}`);

const srcLevels = headingLevels(src.body);
const tgtLevels = headingLevels(tgt.body);
if (srcLevels.join(",") !== tgtLevels.join(",")) {
  errors.push(
    `Heading structure differs: source [${srcLevels.join(", ")}] vs target [${tgtLevels.join(", ")}]`
  );
}

const srcFences = codeFenceCount(src.body);
const tgtFences = codeFenceCount(tgt.body);
if (srcFences !== tgtFences) {
  errors.push(`Fenced code block count differs: source ${srcFences} vs target ${tgtFences}`);
}

const srcLinks = linkTargets(src.body);
const tgtLinks = linkTargets(tgt.body);
if (srcLinks.length !== tgtLinks.length) {
  errors.push(`Link count differs: source ${srcLinks.length} vs target ${tgtLinks.length}`);
}
const srcNonAnchor = srcLinks.filter((l) => !l.startsWith("#"));
const tgtNonAnchor = tgtLinks.filter((l) => !l.startsWith("#"));
const changedLinks = srcNonAnchor.filter((l, i) => l !== tgtNonAnchor[i]);
if (changedLinks.length) {
  errors.push(
    `Non-anchor link targets changed (must stay identical): ${changedLinks
      .map((l, i) => `"${l}" -> "${tgtNonAnchor[i]}"`)
      .join(", ")}`
  );
}
const srcAnchors = srcLinks.filter((l) => l.startsWith("#"));
if (srcAnchors.length) {
  warnings.push(
    `${srcAnchors.length} intra-page anchor link(s) in the source — confirm they were updated to the translated heading ids.`
  );
}

// A blog post must not gain a Markdown H1: the layout renders it from frontmatter.
const isBlogPost = (p) => /(^|[\\/])posts[\\/].+\.md$/.test(p);
if (isBlogPost(targetPath) && tgtLevels.includes(1)) {
  errors.push(
    "Blog post contains a Markdown H1. Blog titles are rendered from frontmatter `title`; remove the `# ...` heading."
  );
}

if (!flags.allowCjk && !isChineseLang(flags.targetLang)) {
  const prose = stripCodePreserveLines(target);
  const cjkLines = prose
    .split(/\r?\n/)
    .map((line, i) => ({ line: i + 1, text: line }))
    .filter(({ text }) => /[\u3400-\u4dbf\u4e00-\u9fff]/.test(text));
  if (cjkLines.length) {
    const sample = cjkLines
      .slice(0, 5)
      .map(({ line, text }) => `  line ${line}: ${text.trim().slice(0, 60)}`)
      .join("\n");
    errors.push(
      `Residual Chinese characters found in ${cjkLines.length} line(s) of a "${flags.targetLang}" translation (frontmatter and body):\n${sample}`
    );
  }
}

console.log(`Source: ${path.normalize(sourcePath)}`);
console.log(`Target: ${path.normalize(targetPath)}`);
for (const w of warnings) console.log(`[warn]  ${w}`);
for (const e of errors) console.log(`[error] ${e}`);

if (errors.length) {
  console.log(`\n\u274c ${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log(`\n\u2705 Structure OK.`);
