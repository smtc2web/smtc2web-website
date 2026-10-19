<script setup>
import { computed } from "vue";
import { data as posts } from "../posts.data.mjs";

const pad = (n) => String(n).padStart(2, "0");

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(+d)) return "";
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

function titleOf(post) {
  return post.frontmatter.title ?? "未命名";
}

const totalPosts = posts.length;
const latest = computed(() => posts.slice(0, 5));
const tickerPosts = computed(() => posts.slice(0, 7));

// 最新版本取自标题里带版本号的那篇更新日志，不手写
const release = computed(() => {
  for (const post of posts) {
    const version = titleOf(post).match(
      /\bv\d+\.\d+\.\d+(?:-[a-z0-9.]+)?\b/i
    )?.[0];
    if (version) {
      return {
        version,
        date: post.frontmatter.date,
        url: post.url,
      };
    }
  }
  return null;
});

const capabilities = [
  {
    en: "Live",
    zh: "实时显示",
    body: "曲目、歌手、专辑、进度和播放状态由本地服务输出，浏览器页面只轮询一个地址。",
    field: "读取间隔 100 毫秒（播放中）/ 200 毫秒（暂停）",
  },
  {
    en: "Rust",
    zh: "Rust 后端",
    body: "媒体会话信息由 Rust 读取，打包成 Windows 与 Linux 的原生程序，无需浏览器常驻。",
    field: "Windows x64 / Arm64 │ Linux amd64 / aarch64",
  },
  {
    en: "Web",
    zh: "主题即网页",
    body: "显示层是一个前端页面：复制主题模板，改几行 CSS 就能做出自己的播放信息样式。",
    field: "Vite + Vue 3 │ 字符串模板也能直接用",
  },
];
</script>

<template>
  <div class="ef-home">
    <section class="hero">
      <div class="hero-copy">
        <p class="ef-eyebrow slash hero-eyebrow">Now playing</p>
        <h1 class="ef-wordmark">
          <span class="solid ef-in-drive">SMTC</span>
          <span
            class="hollow ef-in-drive"
            style="animation-delay: 140ms"
            aria-hidden="true"
            >2WEB</span
          >
        </h1>
        <p class="hero-marker">
          <span class="ef-marker ef-in-stroke"
            >一个直播时显示正在播放音乐的小工具。</span
          >
        </p>
        <p class="hero-note ef-read">
          把 Windows 11 正在播放的曲目、歌手和进度，同步成网页里的一行字幕。
          浏览器开着就能看，也能直接放进 OBS 的浏览器源。
        </p>
        <ul class="ef-facts ef-field hero-facts">
          <li v-if="release">版本 {{ release.version }}</li>
          <li v-if="release">
            <time :datetime="release.date">{{ formatDate(release.date) }}</time>
          </li>
          <li>MIT 许可</li>
          <li>{{ totalPosts }} 篇文章</li>
        </ul>
        <p class="ef-actions hero-actions">
          <a class="ef-btn go" href="/download">
            下载<span v-if="release" class="sub">{{ release.version }}</span>
          </a>
          <a class="ef-btn" href="/wiki">Wiki</a>
          <a class="ef-btn" href="/posts/">博客</a>
        </p>
      </div>

      <div class="hero-visual">
        <figure class="ef-frame">
          <div class="window">
            <img
              src="/favicon.png"
              alt="smtc2web 程序图标：一只戴着耳机的螃蟹"
              width="512"
              height="512"
              fetchpriority="high"
              decoding="async"
            />
          </div>
        </figure>
        <p class="ef-plate">
          Windows 媒体会话 → 本地服务 /api/now → 网页 · OBS 浏览器源
        </p>
      </div>
    </section>

    <div class="ef-ticker" aria-label="最近的文章">
      <div class="track">
        <ul>
          <li v-for="post in tickerPosts" :key="post.url">
            <a :href="post.url">
              <b>{{ formatDate(post.frontmatter.date) }}</b>
              {{ titleOf(post) }}
            </a>
          </li>
        </ul>
        <ul aria-hidden="true">
          <li v-for="post in tickerPosts" :key="`dup-${post.url}`">
            <a :href="post.url" tabindex="-1">
              <b>{{ formatDate(post.frontmatter.date) }}</b>
              {{ titleOf(post) }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <section class="section" aria-labelledby="capabilities-title">
      <div class="ef-shell">
        <div class="ef-in-come section-head">
          <div>
            <p class="ef-eyebrow slash">What it does</p>
            <h2 id="capabilities-title">能做什么</h2>
          </div>
          <a class="section-link" href="/wiki">查看 Wiki</a>
        </div>
        <ol class="caps">
          <li v-for="(cap, i) in capabilities" :key="cap.en">
            <span class="cap-no">
              <span>{{ pad(i + 1) }}</span>
              <span>{{ cap.en }}</span>
            </span>
            <h3>{{ cap.zh }}</h3>
            <div>
              <p>{{ cap.body }}</p>
              <span class="ef-field cap-field">{{ cap.field }}</span>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="section" aria-labelledby="posts-title">
      <div class="ef-shell">
        <div class="ef-in-come section-head">
          <div>
            <p class="ef-eyebrow slash">Posts</p>
            <h2 id="posts-title">最近的文章</h2>
          </div>
          <a class="section-link" href="/posts/">全部 {{ totalPosts }} 篇</a>
        </div>
        <div class="records-wrap">
          <ol class="ef-records">
            <li v-for="post in latest" :key="post.url">
              <a class="ef-record" :href="post.url">
                <span class="ef-tag">{{
                  post.frontmatter.category || "文章"
                }}</span>
                <time class="ef-field" :datetime="post.frontmatter.date">
                  {{ formatDate(post.frontmatter.date) }}
                </time>
                <span class="name ef-read">{{ titleOf(post) }}</span>
                <span class="ef-field">{{
                  post.chars ? `${post.chars.toLocaleString("zh-CN")} 字` : ""
                }}</span>
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="download-title">
      <div class="ef-shell">
        <div class="download-band">
          <div>
            <p class="ef-eyebrow slash">Download</p>
            <h2 id="download-title">下载</h2>
            <ul class="ef-facts ef-field facts">
              <li v-if="release">最新版本 {{ release.version }}</li>
              <li v-if="release">{{ formatDate(release.date) }}</li>
              <li>Windows x64 · Arm64</li>
              <li>Linux amd64 · aarch64</li>
            </ul>
          </div>
          <p class="ef-actions">
            <a v-if="release" class="ef-btn go" :href="release.url">
              更新日志<span class="sub">{{ release.version }}</span>
            </a>
            <a class="ef-btn" href="/download">全部安装包</a>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
