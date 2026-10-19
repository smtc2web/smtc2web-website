---
title: 博客
---

<script setup>
import { data } from "../.vitepress/posts.data.mjs";
import { computed } from "vue";

const pad = (n) => String(n).padStart(2, "0");

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(+d)) return "";
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

const total = data.length;
const totalChars = data.reduce((sum, post) => sum + (post.chars || 0), 0);

const groups = computed(() => {
  const map = new Map();
  for (const post of data) {
    const year = new Date(post.frontmatter.date).getFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year).push(post);
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }));
});
</script>

<p class="ef-field blog-ledger">
  共 {{ total }} 篇 │ {{ totalChars.toLocaleString("zh-CN") }} 字 │ 按发布时间排列
</p>

<template v-for="group in groups" :key="group.year">
  <h2 class="ef-group-head">
    <span>{{ group.year }}</span>
    <span class="ef-field">{{ group.items.length }} 篇</span>
  </h2>
  <ol class="ef-records">
    <li v-for="post in group.items" :key="post.url">
      <a class="ef-record" :href="post.url">
        <span class="ef-tag">{{ post.frontmatter.category || "文章" }}</span>
        <time class="ef-field" :datetime="post.frontmatter.date">{{
          formatDate(post.frontmatter.date)
        }}</time>
        <span class="name ef-read">{{ post.frontmatter.title }}</span>
        <span class="ef-field">{{
          post.chars ? `${post.chars.toLocaleString("zh-CN")} 字` : ""
        }}</span>
      </a>
    </li>
  </ol>
</template>

<style scoped>
.blog-ledger {
  margin: 0 0 1.5rem;
}
</style>
