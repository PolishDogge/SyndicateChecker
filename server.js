const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const CACHE = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes server-side cache

const server = http.createServer(async (req, res) => {
  // Enable CORS on all responses so both same-origin and file:/// can access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host || `localhost:${PORT}`;
  const url = new URL(req.url, `http://${host}`);
  const pathname = url.pathname;

  // 1. API Proxy Route: /api/orders/:slug
  if (pathname.startsWith('/api/orders/')) {
    const slug = pathname.replace('/api/orders/', '').trim();
    if (!slug) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Item slug is required' }));
      return;
    }

    const now = Date.now();
    const cached = CACHE.get(slug);
    if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Proxy-Cache': 'HIT'
      });
      res.end(cached.data);
      return;
    }

    try {
      const targetUrl = `https://api.warframe.market/v2/orders/item/${encodeURIComponent(slug)}`;
      const apiResp = await fetch(targetUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      const bodyText = await apiResp.text();

      if (apiResp.status === 429) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Warframe.market rate limit hit (HTTP 429)' }));
        return;
      }

      if (!apiResp.ok) {
        res.writeHead(apiResp.status, { 'Content-Type': 'application/json' });
        res.end(bodyText || JSON.stringify({ error: `HTTP ${apiResp.status}` }));
        return;
      }

      // Cache valid order data
      CACHE.set(slug, { timestamp: now, data: bodyText });

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Proxy-Cache': 'MISS'
      });
      res.end(bodyText);
    } catch (err) {
      console.error(`[Server Proxy Error] ${slug}:`, err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to connect to Warframe.market', details: err.message }));
    }
    return;
  }

  // 2. Clear Cache Route: /api/clear-cache
  if (pathname === '/api/clear-cache') {
    CACHE.clear();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Server cache cleared' }));
    return;
  }

  // 3. Static Files (Serves index.html or other static assets)
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error reading ' + pathname);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚔️  Warframe Syndicate Standing Optimizer`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🛡️  CORS Bypass Proxy: http://localhost:${PORT}/api/orders/:slug`);
  console.log(`======================================================\n`);
});
