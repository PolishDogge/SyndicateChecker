"""
Warframe Syndicate Standing Optimizer - Python Local Proxy Server
Copyright (C) 2026 polishdogge

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
"""

import http.server
import socketserver
import urllib.request
import urllib.error
import urllib.parse
import json
import os
import time
import webbrowser

PORT = int(os.environ.get('PORT', 3000))
CACHE = {}
CACHE_TTL = 15 * 60  # 15 minutes

class SyndicateHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Accept')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 1. API Proxy Route: /api/orders/:slug
        if path.startswith('/api/orders/'):
            slug = path[len('/api/orders/'):].strip()
            if not slug:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"error": "Item slug is required"}')
                return

            now = time.time()
            if slug in CACHE and (now - CACHE[slug]['time'] < CACHE_TTL):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('X-Proxy-Cache', 'HIT')
                self.end_headers()
                self.wfile.write(CACHE[slug]['data'])
                return

            target_url = f"https://api.warframe.market/v2/orders/item/{urllib.parse.quote(slug)}"
            req = urllib.request.Request(
                target_url,
                headers={
                    'Accept': 'application/json',
                    'Platform': 'pc',
                    'Language': 'en',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            )

            try:
                with urllib.request.urlopen(req, timeout=10) as resp:
                    data = resp.read()
                    CACHE[slug] = {'time': now, 'data': data}
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('X-Proxy-Cache', 'MISS')
                    self.end_headers()
                    self.wfile.write(data)
            except urllib.error.HTTPError as e:
                err_body = e.read()
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(err_body if err_body else json.dumps({'error': f'HTTP {e.code}'}).encode('utf-8'))
            except Exception as e:
                self.send_response(502)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Failed to reach Warframe.market', 'details': str(e)}).encode('utf-8'))
            return

        # 2. Clear Cache Route: /api/clear-cache
        if path == '/api/clear-cache':
            CACHE.clear()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"success": true, "message": "Cache cleared"}')
            return

        # 3. Static Files: serve index.html or other static files
        if path == '/' or not os.path.exists(path.lstrip('/')):
            self.path = '/index.html'

        return super().do_GET()

def run():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('', PORT), SyndicateHandler) as httpd:
        print("Warframe Syndicate Standing Optimizer")
        print(f"Server running on: http://localhost:{PORT}")
        print(f"CORS Proxy: http://localhost:{PORT}/api/orders/:slug")
        print("======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == '__main__':
    run()
