// 等待 Cloudflare Pages 完成本次提交的生产部署（发布成功）后再退出。
// 由 .github/workflows/ping-explore.yml 调用，保证 ping 一定发生在站点上线之后。
//
// 需要的环境变量：
//   CLOUDFLARE_ACCOUNT_ID   Cloudflare 账户 ID
//   CLOUDFLARE_API_TOKEN    具有 “Account → Cloudflare Pages → Read” 权限的 API Token
//   TARGET_SHA              要等待的提交（默认取 GITHUB_SHA）
// 可选：
//   CF_PAGES_PROJECT        项目名（默认 smtc2web）
//   CF_PAGES_ENVIRONMENT    部署环境（默认 production）
//   POLL_INTERVAL_MS        轮询间隔（默认 15000）
//   POLL_TIMEOUT_MS         超时时间（默认 900000，即 15 分钟）

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const PROJECT = process.env.CF_PAGES_PROJECT || "smtc2web";
const ENVIRONMENT = process.env.CF_PAGES_ENVIRONMENT || "production";
const TARGET_SHA = process.env.TARGET_SHA || process.env.GITHUB_SHA || "";
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 15_000);
const POLL_TIMEOUT_MS = Number(process.env.POLL_TIMEOUT_MS || 15 * 60_000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = (message) => console.log(`[wait-pages] ${message}`);

function fail(message) {
  console.error(`[wait-pages] ${message}`);
  process.exit(1);
}

async function listDeployments() {
  const url =
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}` +
    `/pages/projects/${PROJECT}/deployments?per_page=20`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Cloudflare API ${res.status} ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(`Cloudflare API 返回失败：${JSON.stringify(data.errors)}`);
  }
  return data.result || [];
}

async function main() {
  if (!ACCOUNT_ID) {
    fail("缺少 CLOUDFLARE_ACCOUNT_ID（请在仓库 Secrets 中配置）");
  }
  if (!API_TOKEN) {
    fail("缺少 CLOUDFLARE_API_TOKEN（请在仓库 Secrets 中配置）");
  }
  if (!TARGET_SHA) {
    fail("缺少 TARGET_SHA（或 GITHUB_SHA）");
  }

  log(`等待提交 ${TARGET_SHA} 在 ${PROJECT}（${ENVIRONMENT}）发布成功`);

  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let lastReport = "";

  while (Date.now() < deadline) {
    let deployments;
    try {
      deployments = await listDeployments();
    } catch (error) {
      const message = `查询部署失败，稍后重试：${error.message}`;
      if (message !== lastReport) {
        lastReport = message;
        log(message);
      }
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    const deployment = deployments.find(
      (item) =>
        item.environment === ENVIRONMENT &&
        item.deployment_trigger?.metadata?.commit_hash === TARGET_SHA
    );

    let message;
    if (!deployment) {
      message = "尚未出现该提交的部署，继续等待…";
    } else {
      const stage = deployment.latest_stage || {};
      const id = deployment.short_id || deployment.id;

      if (deployment.is_skipped) {
        fail(`部署 ${id} 被跳过（${deployment.skip_reason || "unknown"}），不会 ping`);
      }

      if (stage.status === "failure" || stage.status === "canceled") {
        fail(`部署 ${id} 未成功：${stage.name}/${stage.status}`);
      }

      if (stage.name === "deploy" && stage.status === "success") {
        const url = deployment.aliases?.join(", ") || deployment.url;
        log(`部署 ${id} 已发布成功（${url}），可以 ping`);
        return;
      }

      message = `部署 ${id} 进行中：${stage.name}/${stage.status}`;
    }

    if (message !== lastReport) {
      lastReport = message;
      log(message);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  fail(`等待超时（${Math.round(POLL_TIMEOUT_MS / 1000)}s），未确认部署成功`);
}

main().catch((error) => fail(error?.stack || String(error)));
