<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";

const GISCUS_SRC = "https://giscus.app/client.js";
const REPO = "smtc2web/smtc2web-website";
const REPO_ID = "R_kgDOP9skrg";
const CATEGORY = "Comments";
const CATEGORY_ID = "DIC_kwDOP9skrs4DJKuv";
const DISCUSSIONS_URL = `https://github.com/${REPO}/discussions`;

const { isDark, page } = useData();

const root = ref(null);
const mount = ref(null);
let script = null;
let observer = null;

const isEnglish = computed(() =>
  (page.value.filePath ?? "").endsWith(".en.md")
);

const copy = computed(() =>
  isEnglish.value
    ? {
        title: "Comments",
        note: "Join the discussion with your GitHub account.",
        link: "View on GitHub Discussions",
      }
    : {
        title: "评论",
        note: "使用 GitHub 账号参与讨论。",
        link: "在 GitHub Discussions 中查看",
      }
);

function themeName() {
  return isDark.value ? "dark" : "light";
}

function load() {
  if (!mount.value || script) return;

  const el = document.createElement("script");
  el.src = GISCUS_SRC;
  el.async = true;
  el.crossOrigin = "anonymous";

  const attrs = {
    "data-repo": REPO,
    "data-repo-id": REPO_ID,
    "data-category": CATEGORY,
    "data-category-id": CATEGORY_ID,
    "data-mapping": "url",
    "data-strict": "0",
    "data-reactions-enabled": "1",
    "data-emit-metadata": "1",
    "data-input-position": "top",
    "data-theme": themeName(),
    "data-lang": isEnglish.value ? "en" : "zh-CN",
    "data-loading": "lazy",
  };

  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }

  mount.value.appendChild(el);
  script = el;
}

// 页面上的取色开关切换后，让已经加载的 iframe 跟着换主题
watch(isDark, (dark) => {
  const theme = dark ? "dark" : "light";
  const iframe = mount.value?.querySelector("iframe.giscus-frame");
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app"
    );
  } else if (script) {
    // iframe 还没建出来时，先改脚本上的初始主题
    script.dataset.theme = theme;
  }
});

onMounted(() => {
  // 评论区在页面最底部，滚到附近再拉 giscus，首屏不为它付加载成本
  if (!("IntersectionObserver" in window) || !root.value) {
    load();
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      observer = null;
      load();
    },
    { rootMargin: "600px 0px" }
  );
  observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  script?.remove();
  script = null;
  if (mount.value) mount.value.innerHTML = "";
});
</script>

<template>
  <section
    ref="root"
    class="ef-comments"
    aria-labelledby="ef-comments-title"
  >
    <header class="ef-comments-head">
      <p class="ef-eyebrow slash">Comments</p>
      <h2 id="ef-comments-title">{{ copy.title }}</h2>
    </header>

    <p class="ef-field ef-comments-note">
      {{ copy.note }}
      <a
        :href="DISCUSSIONS_URL"
        target="_blank"
        rel="noopener noreferrer"
        >{{ copy.link }}</a
      >
    </p>

    <div ref="mount" class="ef-comments-mount"></div>
  </section>
</template>
