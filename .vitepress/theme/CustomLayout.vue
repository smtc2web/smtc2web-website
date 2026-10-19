<script setup>
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { computed, nextTick, onMounted, watch } from "vue";
import EndfieldHome from "./EndfieldHome.vue";
import { data as enPosts } from "../posts-en.data.mjs";

const { Layout } = DefaultTheme;
const { frontmatter, page } = useData();

// 有英文版的文章才给英文入口
const enUrls = new Set(enPosts.map((post) => post.url));

const pad = (n) => String(n).padStart(2, "0");

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(+d)) return "";
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

const filePath = computed(() => page.value.filePath ?? "");
const isHome = computed(() => frontmatter.value.layout === "home");
const isBlog = computed(() => filePath.value.startsWith("posts/"));
const isPost = computed(
  () =>
    isBlog.value &&
    filePath.value !== "posts/index.md" &&
    filePath.value !== "posts/index.en.md"
);
const tags = computed(() =>
  Array.isArray(frontmatter.value.tags) ? frontmatter.value.tags : []
);

// 上一级：只有 Wiki 和博客的分页有；分栏首页自己就是这一级
const isSectionIndex = computed(
  () =>
    filePath.value === "wiki/index.md" ||
    filePath.value === "posts/index.md" ||
    filePath.value === "posts/index.en.md"
);
const crumb = computed(() => {
  if (isSectionIndex.value) return null;
  if (filePath.value.startsWith("wiki/")) {
    return { zh: "Wiki", href: "/wiki" };
  }
  if (isBlog.value) {
    return { zh: "博客", href: "/posts/" };
  }
  return null;
});

const langSwitch = computed(() => {
  const fp = filePath.value;
  if (!fp.startsWith("posts/")) return null;
  const isEn = fp.endsWith(".en.md");
  let zhUrl;
  let enUrl;
  if (fp === "posts/index.md" || fp === "posts/index.en.md") {
    zhUrl = "/posts/";
    enUrl = "/posts/index.en";
  } else {
    const base = fp.replace(/\.(en\.)?md$/, "");
    zhUrl = `/${base}`;
    enUrl = `/${base}.en`;
  }
  const isIndex = fp === "posts/index.md" || fp === "posts/index.en.md";
  return {
    zhUrl,
    enUrl,
    current: isEn ? "en" : "zh",
    hasEn: isIndex || enUrls.has(enUrl),
  };
});

// 侧栏和导航的“当前这一页”：VitePress 只加 class，读屏读不出来，这里补上
function markCurrent() {
  if (typeof document === "undefined") return;
  document
    .querySelectorAll(".VPSidebarItem.is-active > .item > a.link")
    .forEach((el) => el.setAttribute("aria-current", "page"));
  document
    .querySelectorAll(".VPNavBarMenuLink.active")
    .forEach((el) => el.setAttribute("aria-current", "page"));
  document
    .querySelectorAll(".VPNavBarMenuGroup.active > .button")
    .forEach((el) => el.setAttribute("aria-current", "page"));
}

onMounted(() => nextTick(markCurrent));
watch(() => page.value.relativePath, () => nextTick(markCurrent));
</script>

<template>
  <Layout>
    <template #home-hero-before>
      <EndfieldHome v-if="isHome" />
    </template>

    <template #doc-before>
      <p v-if="crumb" class="ef-crumb ef-field">
        <a href="/">首页</a>
        <a :href="crumb.href">{{ crumb.zh }}</a>
      </p>

      <nav
        v-if="langSwitch && langSwitch.hasEn"
        class="post-lang"
        aria-label="语言"
      >
        <a
          v-if="langSwitch.current !== 'zh'"
          class="ef-chip"
          :href="langSwitch.zhUrl"
          hreflang="zh"
          >中文</a
        >
        <span v-else class="ef-chip is-active" aria-current="true">中文</span>
        <a
          v-if="langSwitch.current !== 'en'"
          class="ef-chip"
          :href="langSwitch.enUrl"
          hreflang="en"
          >English</a
        >
        <span v-else class="ef-chip is-active" aria-current="true"
          >English</span
        >
      </nav>

      <h1 v-if="isBlog && frontmatter.title" class="post-title">
        {{ frontmatter.title }}
      </h1>

      <div v-if="isPost" class="post-meta">
        <ul class="ef-facts ef-field">
          <li v-if="frontmatter.date">
            <time :datetime="frontmatter.date">{{
              formatDate(frontmatter.date)
            }}</time>
          </li>
          <li v-if="frontmatter.author">{{ frontmatter.author }}</li>
          <li v-if="frontmatter.category">{{ frontmatter.category }}</li>
        </ul>
        <div v-if="tags.length" class="post-tags">
          <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </template>

    <template #aside-outline-after>
      <aside class="ef-link-card">
        <p class="ef-eyebrow slash">Bilibili</p>
        <h3>关注作者的 B 站账号</h3>
        <img
          src="/bilibili-social-account.png"
          alt="哔哩哔哩账号二维码"
          width="196"
          height="196"
        />
        <p class="ef-field">UID 551264339</p>
      </aside>
    </template>
  </Layout>
</template>
