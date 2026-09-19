const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log("新建文章\n");

  const title = await ask("标题: ");
  if (!title) {
    console.log("标题不能为空");
    rl.close();
    process.exit(1);
  }

  const defaultSlug = slugify(title);
  const fileNameInput = await ask(`文件名 (默认: ${defaultSlug}): `);
  const fileName = fileNameInput || defaultSlug;

  const date = new Date().toISOString().slice(0, 10);

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

  let frontmatter = `---
date: ${date}
title: ${title}
author: ${author}
category: ${category}
`;
  if (tags.length > 0) {
    frontmatter += `tags:\n`;
    tags.forEach((t) => (frontmatter += `  - ${t}\n`));
  }
  if (description) {
    frontmatter += `description: ${description}\n`;
  }
  frontmatter += `---\n\n# ${title}\n\n`;

  const postsDir = path.resolve(__dirname, "..", "posts");
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${fileName}.md`);
  if (fs.existsSync(filePath)) {
    console.log(`\n文件已存在: ${filePath}`);
    rl.close();
    process.exit(1);
  }

  fs.writeFileSync(filePath, frontmatter, "utf-8");
  console.log(`\n文章已创建: ${filePath}`);

  rl.close();
}

main();
