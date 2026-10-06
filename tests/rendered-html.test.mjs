import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", String(process.pid) + "-" + Date.now());
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html", host: "localhost" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("serves the fortress viewer and original offline download", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-CN"/);
  assert.match(html, /<title>深山独居堡垒 · 交互三维模型<\/title>/);
  assert.match(html, /深山与海岛备用堡垒/);
  const frame = html.match(/<iframe\b[^>]*src="(\/model\.html\?v=[^"]+)"[^>]*>/)?.[1];
  const download = html.match(/href="(\/bunker-offline\.zip\?v=[^"]+)"[^>]*download/)?.[1];
  assert(frame, "interactive model is accessible on the initial page");
  assert(download, "original offline package remains downloadable");
  assert.equal(new URL(frame, "http://localhost").searchParams.get("v"), new URL(download, "http://localhost").searchParams.get("v"));
  assert.doesNotMatch(html, /Your site is taking shape|Codex is building the first version/);
});

test("standalone viewer and offline package remain available", async () => {
  const viewer = await readFile(new URL("../public/model.html", import.meta.url), "utf8");
  assert.match(viewer, /id="model-canvas"/);
  assert.match(viewer, /three\.min\.js/);
  assert.doesNotMatch(viewer, /(?:src|href)="https?:\/\//);
  const zipPath = new URL("../public/bunker-offline.zip", import.meta.url);
  const size = (await stat(zipPath)).size;
  assert(size > 1000 && size < 25 * 1024 * 1024, "offline download fits the hosting asset limit");
  const zip = await readFile(zipPath);
  assert.equal(zip.readUInt32LE(0), 0x04034b50, "download is a ZIP archive");
});
