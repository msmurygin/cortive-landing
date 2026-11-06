#!/usr/bin/env node
// Local-only server for the real AI endpoint and static landing assets.
// Usage: node scripts/dev-workflow.cjs --credentials-file /absolute/private/quark-ai.env
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173),
  origin = "http://127.0.0.1:" + port;
const flag = process.argv.indexOf("--credentials-file");
const envFile =
  flag >= 0 ? process.argv[flag + 1] : path.join(root, ".env.local");
function loadCredentials() {
  if (!process.env.ANTHROPIC_API_KEY && fs.existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }
}
loadCredentials();
process.env.VERCEL_ENV = "development";
process.env.ENGINE_AI_PREVIEW_ORIGIN = origin;
const handlers = {
  "/api/engine-chat": require("../api/engine-chat"),
  "/api/engine-enquiry": require("../api/engine-enquiry"),
  "/api/engine-analyze": require("../api/engine-analyze"),
};
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".json": "application/json",
};
const rewrites = Object.fromEntries(
  JSON.parse(fs.readFileSync(path.join(root, "vercel.json"))).rewrites.map(
    (r) => [r.source, r.destination],
  ),
);
function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}
const server = http.createServer(async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex,nofollow");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (
    req.headers.host !== "127.0.0.1:" + port &&
    req.headers.host !== "localhost:" + port
  )
    return json(res, 403, { error: "Local preview only." });
  if (req.headers.host === "localhost:" + port && req.method === "GET") {
    res.writeHead(308, { Location: origin + req.url });
    res.end();
    return;
  }
  let url;
  try {
    url = new URL(req.url, origin);
  } catch {
    return json(res, 400, { error: "Check URL." });
  }
  if (url.pathname === "/api/health" && req.method === "GET") {
    loadCredentials();
    return json(res, 200, {
      ok: true,
      ai_connected: !!process.env.ANTHROPIC_API_KEY,
    });
  }
  if (url.pathname.startsWith("/api/")) {
    if (req.method !== "POST")
      return json(res, 405, { error: "Use POST for this endpoint." });
    const handler = handlers[url.pathname];
    if (!handler)
      return json(res, 503, {
        error: "This action is not enabled in the local preview.",
      });
    loadCredentials();
    let bytes = 0;
    const chunks = [];
    try {
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > 4250000)
          return json(res, 413, { error: "Use a file up to 3 MB." });
        chunks.push(chunk);
      }
    } catch {
      return json(res, 400, { error: "Could not read the request." });
    }
    req.body = Buffer.concat(chunks).toString("utf8");
    const controller = new AbortController();
    req.signal = controller.signal;
    res.once("close", () => {
      if (!res.writableEnded) controller.abort();
    });
    res.status = function (status) {
      this.statusCode = status;
      return this;
    };
    res.json = function (data) {
      this.setHeader("Content-Type", "application/json; charset=utf-8");
      this.end(JSON.stringify(data));
      return this;
    };
    try {
      await handler(req, res);
    } catch {
      if (!res.writableEnded)
        json(res, 500, {
          error: "The local AI server could not complete this request.",
        });
    }
    return;
  }
  if (!["GET", "HEAD"].includes(req.method))
    return json(res, 405, { error: "Method not allowed." });
  let requestPath;
  try {
    requestPath = decodeURIComponent(url.pathname);
  } catch {
    return json(res, 400, { error: "Check URL." });
  }
  if (
    requestPath.split("/").some((p) => p.startsWith(".") || p === "..") ||
    /^\/(lib|scripts|tests|docs|node_modules)(\/|$)/.test(requestPath)
  )
    return json(res, 404, { error: "Not found." });
  const target = path.resolve(
    root,
    "." +
      (rewrites[requestPath] ||
        (requestPath === "/" ? "/index.html" : requestPath)),
  );
  try {
    const real = fs.realpathSync(target);
    if (
      !real.startsWith(root + path.sep) ||
      !fs.statSync(real).isFile() ||
      !mime[path.extname(real)]
    )
      return json(res, 404, { error: "Not found." });
    res.setHeader("Content-Type", mime[path.extname(real)]);
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(real).pipe(res);
  } catch {
    json(res, 404, { error: "Not found." });
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(
    origin +
      "/try\nAI connection: " +
      (process.env.ANTHROPIC_API_KEY
        ? "configured"
        : "waiting for local environment file"),
  ),
);
