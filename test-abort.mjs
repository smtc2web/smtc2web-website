const targets = [
  ["blackhole", "https://10.255.255.1/api/v1/ping"],
  ["slow-dns-host", "https://nonexistent-host-for-ping-test.invalid/api/v1/ping"],
];
for (const [name, url] of targets) {
  const t0 = Date.now();
  try {
    const r = await fetch(url, { method: "POST", signal: AbortSignal.timeout(10_000) });
    console.log(name, "status", r.status, "ms", Date.now() - t0);
  } catch (e) {
    console.log(name, "err", e.name, (e.cause && e.cause.code) || e.message, "ms", Date.now() - t0);
  }
}
