<script setup>
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { computed } from "vue";

const { Layout } = DefaultTheme;
const { frontmatter, page } = useData();

function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (page.value.filePath.endsWith(".en.md")) {
        return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

const isBlog = () => page.value.filePath.startsWith("posts/");

const isPost = () => {
    const url = page.value.filePath;
    return url.startsWith("posts/") && url !== "posts/index.md";
};

const langSwitch = computed(() => {
    const fp = page.value.filePath;
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
    return { zhUrl, enUrl, current: isEn ? "en" : "zh" };
});
</script>

<template>
    <Layout>
        <template #doc-before>
            <div v-if="langSwitch" class="lang-switch">
                <span v-if="langSwitch.current === 'zh'" class="lang-switch-current">中文</span>
                <a v-else class="lang-switch-link" :href="langSwitch.zhUrl">中文</a>
                <span class="lang-switch-divider">·</span>
                <span v-if="langSwitch.current === 'en'" class="lang-switch-current">English</span>
                <a v-else class="lang-switch-link" :href="langSwitch.enUrl">English</a>
            </div>
            <h1 v-if="isBlog() && frontmatter.title" class="post-title">
                {{ frontmatter.title }}
            </h1>
            <div v-if="isPost()" class="post-meta">
                <div class="post-meta-line">
                    <span v-if="frontmatter.date" class="post-date">{{
                        formatDate(frontmatter.date)
                    }}</span>
                    <span v-if="frontmatter.author" class="post-author">{{
                        frontmatter.author
                    }}</span>
                    <span v-if="frontmatter.category" class="post-category">{{
                        frontmatter.category
                    }}</span>
                </div>
                <div v-if="frontmatter.tags" class="post-tags">
                    <span
                        v-for="tag in frontmatter.tags"
                        :key="tag"
                        class="tag"
                        >{{ tag }}</span
                    >
                </div>
            </div>
        </template>
        <template #aside-bottom>
            <div class="bilibili-social-card">
                <h3>关注作者的 B 站账号</h3>
                <img
                    src="/bilibili-social-account.png"
                    alt="哔哩哔哩账号二维码"
                    style="width: 100%; border-radius: 8px"
                />
            </div>
        </template>

    </Layout>
</template>

<style scoped>
.post-title {
    margin: 0 0 1rem;
    font-size: 28px;
    line-height: 40px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--vp-c-text-1);
}
@media (min-width: 768px) {
    .post-title {
        font-size: 32px;
    }
}
.lang-switch {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
}
.lang-switch-link {
    color: var(--vp-c-brand-1);
    text-decoration: none;
    font-weight: 500;
}
.lang-switch-link:hover {
    text-decoration: underline;
}
.lang-switch-current {
    color: var(--vp-c-text-2);
    font-weight: 600;
}
.lang-switch-divider {
    color: var(--vp-c-text-3);
}
.post-meta {
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--vp-c-divider);
}
.post-meta-line {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    margin-bottom: 0.75rem;
}
.post-tags {
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
