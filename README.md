# Warframe Syndicate Standing Optimizer ⚔️✨

A standalone, zero-dependency web app that tracks and ranks live **Warframe Market** prices for Syndicate rewards to identify the most profitable items to cash out your standing into Platinum.

Ready to deploy directly to **GitHub Pages** or open locally in any browser (`file:///`).

---

## 🌟 Key Features

- **Initial Empty State & On-Demand Scan**:
  - Starts cleanly in standby with no pre-selected syndicate or automatic network fetches until you select a syndicate.
  - Interactive faction cards reveal real-time intelligence for that specific syndicate.
- **Full-Width Edge-to-Edge Canvas**:
  - Responsive widescreen layout (`max-width: 1680px` with generous padding) that breathes naturally across standard and ultrawide displays.
  - Dynamic flex/grid sizing with no clipped containers or overflowing text.
- **High-Resolution Syndicate Emblems**:
  - Beautiful, high-resolution transparent logos embedded for all six factions:
    - **Steel Meridian** (Vanguard Red)
    - **Arbiters of Hexis** (Justice Blue)
    - **Cephalon Suda** (Knowledge Purple)
    - **The Perrin Sequence** (Commerce Emerald)
    - **Red Veil** (Purge Crimson)
    - **New Loka** (Purity Green)
- **Streamlined 7-Column Data Table**:
  - `Item Name`: Left-aligned with subtle sub-badge (e.g. `[Ash] Warframe Mod`, `[Hek] Weapon Mod`, `Syndicate Weapon`).
  - `Standing Cost`: Center-aligned, formatted with commas (`25,000`, `100,000`, `125,000`).
  - `Lowest Sell`: Right-aligned with Platinum icon and monospace price.
  - `Plat / 1k Standing`: Right-aligned with dynamic Orokin gold/emerald efficiency badges.
  - `Instant Buyout Price`: Right-aligned cyan price for immediate standing liquidation.
  - `Sellers / Live Orders`: Center-aligned badge showing active sellers and online counts (`11 active (20 online)`).
  - `Actions`: Right-aligned "Whisper Instant Sell" button with fixed min-width to prevent squishing.
- **Fixed Table Layout & Live Incremental Rendering**:
  - Uses fixed table layout with explicit column widths and `white-space: nowrap` on numerical/badge cells to ensure pixel-perfect alignment.
  - Rows update incrementally in real time as each item's request completes, replacing pending indicators with live market values.
- **Warframe Market API v2 Engine**:
  - Built natively on the active Warframe Market v2 orders endpoint.
  - Enforced safe rate-limiting (380ms delay between items) to guarantee zero HTTP 429 errors.
  - Automatic 429 detection with 3-second backoff and retry banner.
  - Network and CORS error handling with prominent alert banners.
  - 15-minute per-syndicate caching (never caches incomplete or failed runs) with live countdown ticker and active-tab auto-refresh.
  - Real-time extraction of live in-game buyer usernames with strict prioritization (`ingame` > `online`). No mock data.
- **One-Click In-Game Instant Sell Whisper**:
  - Generates: `/w {buyer_ingame_name} Hi! I want to sell: [{Item Name}] for {highest_buy_plat} platinum. (warframe.market)`
  - Instant clipboard copy with visual "Copied!" checkmark feedback.
  - Automatically disables with `"No active buyer"` when no valid buyers are online/in-game.

---

## 🚀 Quick Start (Zero-CORS Setup)

Because browser Same-Origin Policy (SOP) blocks frontend web apps from reading Warframe.market's API responses directly, a zero-dependency local proxy server is included in both Node.js and Python.

### Option 1: Node.js (Recommended)
```bash
npm start
# or: node server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. All requests are routed through `/api/orders/:slug` with zero CORS restrictions.

### Option 2: Python (Zero-Install)
```bash
python server.py
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. Built entirely on Python's standard library (`http.server` and `urllib`), zero `pip` packages required.

### Option 3: Deploy Online
Deploy to Vercel, Render, Railway, or any Node host with `npm start` for an always-accessible web dashboard.

---

## ⚙️ Settings

Click the gear icon in the top header to configure:
- **Cache Expiration (TTL)**: 5, 10, 15 (default), or 30 minutes.
- **Queue Throttle Delay**: 350ms (Safe / Recommended), 500ms, 750ms, or 1000ms.
- **Clear All Caches**: One-click purge of all cached syndicate data.

---

## 📄 License & Attribution
- Market data provided via the [Warframe.Market API](https://warframe.market).
- Warframe and the Lotus logo are trademarks of Digital Extremes Ltd.
