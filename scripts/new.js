const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// `rl.question()` drops piped input: when stdin is not a TTY every line is
// emitted before the next question is registered. Buffer the lines ourselves
// so the script works both interactively and with piped input. Prompts are
// still written through readline so line-editing keeps them on screen.
const lineBuffer = [];
const lineWaiters = [];
let inputEnded = false;

rl.on("line", (line) => {
  const waiter = lineWaiters.shift();
  if (waiter) {
    waiter(line);
  } else {
    lineBuffer.push(line);
  }
});

rl.on("close", () => {
  inputEnded = true;
  while (lineWaiters.length > 0) {
    lineWaiters.shift()(null);
  }
});

function readLine() {
  if (lineBuffer.length > 0) return Promise.resolve(lineBuffer.shift());
  if (inputEnded) return Promise.resolve(null);
  return new Promise((resolve) => lineWaiters.push(resolve));
}

async function ask(question) {
  rl.setPrompt(question);
  rl.prompt();
  const answer = await readLine();
  return answer === null ? "" : answer.trim();
}

function slugify(text) {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/['"’]/g, "")
    // Keep dots so version numbers ("v0.9.9") stay intact instead of being
    // turned into "v099" / "v0-9-9".
    .replace(/[^\w.\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/\.{2,}/g, ".")
    .replace(/^[-.]+|[-.]+$/g, "");
}

function yamlString(value) {
  // Always quote: an unquoted ":" or "#" breaks the whole frontmatter, which
  // makes the date/author/etc. disappear from the rendered page.
  const escaped = String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function toLocalIso(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}

function finish(code) {
  rl.close();
  process.exitCode = code;
}

async function main() {
  console.log("新建文章\n");

  const title = await ask("标题: ");
  if (!title) {
    console.log("标题不能为空");
    return finish(1);
  }

  const now = new Date();
  const date = toLocalIso(now);

  const defaultSlug = slugify(title) || `post-${date.slice(0, 10)}`;
  const fileNameInput = await ask(`文件名 (默认: ${defaultSlug}): `);
  const fileName = (fileNameInput || defaultSlug).replace(/\.md$/i, "");

  const categoryInput = await ask("分类 (默认: 更新日志): ");
  const category = categoryInput || "更新日志";

  const authorInput = await ask("作者 (默认: AkarinLiu): ");
  const author = authorInput || "AkarinLiu";

  const descriptionInput = await ask("描述 (可选): ");
  const description = descriptionInput || "";

  const tagsInput = await ask("标签 (用逗号分隔, 可选): ");
  const tags = tagsInput
    ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const lines = [
    "---",
    `date: ${date}`,
    `title: ${yamlString(title)}`,
    `author: ${yamlString(author)}`,
    `category: ${yamlString(category)}`,
  ];
  if (tags.length > 0) {
    lines.push("tags:");
    tags.forEach((t) => lines.push(`  - ${yamlString(t)}`));
  }
  if (description) {
    lines.push(`description: ${yamlString(description)}`);
  }
  lines.push("---", "");
  // Blog posts must not contain a Markdown H1: the visible <h1> is rendered
  // from the frontmatter `title` by the theme. A body "# title" produced a
  // second heading whose anchor slug turned dots into hyphens (v0-9-9).
  const content = `${lines.join("\n")}\n`;

  const postsDir = path.resolve(__dirname, "..", "posts");
  fs.mkdirSync(postsDir, { recursive: true });

  const filePath = path.join(postsDir, `${fileName}.md`);
  if (fs.existsSync(filePath)) {
    console.log(`\n文件已存在: ${filePath}`);
    return finish(1);
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`\n文章已创建: ${filePath}`);
  console.log(`创建时间: ${date}`);
  finish(0);
}

main();
