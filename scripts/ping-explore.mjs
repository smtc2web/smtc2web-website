// 部署成功后通知 Kite Explore（https://explore.kite.plus/about）尽快读取订阅源。
// Explore 平时约每 60 分钟抓取一次订阅源，收到 ping 后会在几分钟内重新读取；
// 同一个博客两次读取至少间隔 5 分钟，因此频繁 ping 是安全的。
// ping 只能加快已收录博客的更新，不能收录新博客。
//
// 调用时机：由 .github/workflows/ping-explore.yml 在 Cloudflare Pages 确认发布成功后执行，
// 因此 ping 一定发生在站点上线之后，Explore 不会读到旧 feed。
// Cloudflare Pages 的构建命令（pnpm docs:build）里不再调用本脚本——构建阶段早于发布。
//
// 只在 CI 中发送（GitHub Actions 会设置 CI=true），本地手动运行不受影响。
// 发送失败只警告、不报错：ping 不是部署的一部分，不应让流程因此失败。

const EXPLORE_PING_URL = "https://explore.kite.plus/api/v1/ping";
// 与 .vitepress/config.mts 中的 siteUrl 保持一致。
const SITE_URL = process.env.SITE_URL || "https://smtc2web.org";

async function main() {
  if (!process.env.CI) {
    console.log("[ping-explore] 非 CI 环境，跳过 ping");
    return;
  }

  try {
    const response = await fetch(EXPLORE_PING_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: SITE_URL }),
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok) {
      console.log(`[ping-explore] 已通知 Explore 读取 ${SITE_URL}`);
    } else {
      console.warn(
        `[ping-explore] ping 返回 ${response.status}，Explore 会在下个周期照常抓取`
      );
    }
  } catch (error) {
    console.warn(`[ping-explore] ping 失败（忽略）: ${error}`);
  }
}

main();
