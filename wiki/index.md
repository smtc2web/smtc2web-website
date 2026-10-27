---
title: Wiki
---

# Wiki

<script setup>
import { data } from "../.vitepress/wiki.data.mjs";
import { computed } from "vue";

const chars = new Map(data.map((page) => [page.url, page.chars]));

const groups = [
  {
    zh: "指南",
    en: "Guides",
    items: [
      { zh: "编译", href: "/wiki/compile" },
      { zh: "更改字体", href: "/wiki/change-fonts" },
      { zh: "主题开发指南", href: "/wiki/theme-dev-guide" },
      { zh: "SMTC 协议适配列表", href: "/wiki/smtc-protocol-list" },
    ],
  },
  {
    zh: "破坏性变更",
    en: "Breaking changes",
    items: [
      { zh: "主题不再内置字体", href: "/wiki/breaking-changes/theme-font" },
      { zh: "图片 API 变更", href: "/wiki/breaking-changes/image-migration" },
    ],
  },
  {
    zh: "逆向报告",
    en: "Reverse reports",
    items: [
      {
        zh: "2026 年 10 月 15 日安装器卡死逆向分析",
        href: "/wiki/reverse-report/20261015",
      },
    ],
  },
  {
    zh: "审查报告",
    en: "Audit reports",
    items: [
      {
        zh: "2026 年 10 月 27 日安全审计与修复报告",
        href: "/wiki/audit-report/20261027",
      },
    ],
  },
];

const total = groups.reduce((sum, group) => sum + group.items.length, 0);
const totalChars = computed(() =>
  groups
    .flatMap((group) => group.items)
    .reduce((sum, item) => sum + (chars.get(item.href) || 0), 0)
);
</script>

<p class="ef-field wiki-ledger">
  共 {{ total }} 篇 │ {{ totalChars.toLocaleString("zh-CN") }} 字
</p>

<template v-for="group in groups" :key="group.zh">
  <h2 class="ef-group-head">
    <span class="ef-pair">
      <span class="ef-eyebrow slash">{{ group.en }}</span>
      <span>{{ group.zh }}</span>
    </span>
    <span class="ef-field">{{ group.items.length }} 篇</span>
  </h2>
  <ol class="ef-records">
    <li v-for="item in group.items" :key="item.href">
      <a class="ef-record is-short" :href="item.href">
        <span class="name ef-read">{{ item.zh }}</span>
        <span class="ef-field">{{
          chars.get(item.href)
            ? `${chars.get(item.href).toLocaleString("zh-CN")} 字`
            : ""
        }}</span>
      </a>
    </li>
  </ol>
</template>

<style scoped>
.wiki-ledger {
  margin: 0 0 1.5rem;
}
</style>
