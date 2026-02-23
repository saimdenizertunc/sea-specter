#!/usr/bin/env node

const baseUrl = process.argv[2];

if (!baseUrl) {
  console.error("Usage: node scripts/verify-deploy.mjs https://your-app.vercel.app");
  process.exit(1);
}

const normalizedBase = baseUrl.replace(/\/+$/, "");
const checks = [
  { path: "/", expect: [200] },
  { path: "/blog", expect: [200] },
  { path: "/sign-in", expect: [200] },
  { path: "/sign-up", expect: [200] },
  { path: "/admin", expect: [200, 307, 308] },
  { path: "/sitemap.xml", expect: [200] },
  { path: "/robots.txt", expect: [200] },
];

async function checkPath(path, expect) {
  const url = `${normalizedBase}${path}`;
  try {
    const response = await fetch(url, { redirect: "manual" });
    const ok = expect.includes(response.status);
    return {
      url,
      status: response.status,
      ok,
      location: response.headers.get("location") || "",
    };
  } catch (error) {
    return {
      url,
      status: "ERR",
      ok: false,
      location: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const results = await Promise.all(checks.map((c) => checkPath(c.path, c.expect)));
let hasFailure = false;

for (const result of results) {
  if (!result.ok) hasFailure = true;
  const status = String(result.status).padEnd(3, " ");
  const prefix = result.ok ? "PASS" : "FAIL";
  const extra = result.location ? ` -> ${result.location}` : "";
  const error = result.error ? ` (${result.error})` : "";
  console.log(`${prefix} ${status} ${result.url}${extra}${error}`);
}

if (hasFailure) {
  process.exit(2);
}

console.log("All smoke checks passed.");
