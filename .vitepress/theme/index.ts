// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import CustomLayout from "./CustomLayout.vue";
import "./endfield.css";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app, router, siteData }) {
    if (typeof window === "undefined") return;
    const _paq = (window._paq = window._paq || []);
    _paq.push(["enableLinkTracking"]);
    _paq.push(["setTrackerUrl", "https://analytics.akarinliu.com/matomo.php"]);
    _paq.push(["setSiteId", "5"]);
    _paq.push(["trackPageView"]);
    const g = document.createElement("script");
    g.async = true;
    g.src = "https://analytics.akarinliu.com/matomo.js";
    document.head.appendChild(g);
    router.onAfterRouteChanged = () => _paq.push(["trackPageView"]);
  },
} satisfies Theme;
