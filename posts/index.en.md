---
title: Blog
---

<script setup>
import { data } from "../.vitepress/posts-en.data.mjs";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
</script>

<template v-for="post in data">
  <article class="blog-post">
    <h2 class="blog-post-title">
      <a :href="post.url">{{ post.frontmatter.title }}</a>
    </h2>
    <div class="blog-post-meta">
      <span class="date">{{ formatDate(post.frontmatter.date) }}</span>
      <span class="author">{{ post.frontmatter.author }}</span>
      <span v-if="post.frontmatter.category" class="category">{{ post.frontmatter.category }}</span>
    </div>
    <p v-if="post.frontmatter.description" class="blog-post-desc">{{ post.frontmatter.description }}</p>
    <div v-if="post.frontmatter.tags" class="blog-post-tags">
      <span v-for="tag in post.frontmatter.tags" class="tag">{{ tag }}</span>
    </div>
  </article>
</template>

<style scoped>
.blog-post {
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
}
.blog-post:last-of-type {
  border-bottom: none;
}
.blog-post-title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  line-height: 1.4;
}
.blog-post-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.blog-post-title a:hover {
  color: var(--vp-c-brand-1);
}
.blog-post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
}
.blog-post-desc {
  color: var(--vp-c-text-2);
  margin: 0 0 0.5rem;
  line-height: 1.6;
}
.blog-post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}
</style>
