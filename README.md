# Warframe Syndicate Standing Optimizer

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Warframe Market API](https://img.shields.io/badge/Warframe.Market-API-00d2ff.svg)](https://warframe.market)
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)](package.json)

A standalone web application that analyzes live Warframe.market order books for Syndicate offerings, helping players liquidate their standing into Platinum at peak efficiency.

The application runs entirely in the browser with zero build steps and includes zero-dependency local proxy servers for Node.js and Python to handle browser CORS requirements.

---

## Quick Start

Modern web browsers enforce Same-Origin Policy (SOP), which blocks frontend scripts from directly reading Warframe.market's API responses. Use either of the included zero-dependency servers to run the application locally.

### Option 1: Node.js (Primary)

Requires Node.js 18 or later. Uses native standard library modules (`http`, `fs`, `path`, native `fetch`) with zero npm dependencies.

```bash
npm start
# or: node server.js
```

Open `http://localhost:3000` in your web browser.

### Option 2: Python (Backup)

Requires Python 3.8 or later. Uses standard library modules (`http.server`, `urllib.request`, `socketserver`) with zero pip dependencies.

```bash
python server.py
```

Open `http://localhost:3000` in your web browser.

---

## Core Features

### Realistic Quick Sale & Buyer Demand Capping
- Quick sale projections accurately reflect the specific quantity requested by active buyers (`order.quantity`).
- When a buyer orders 1 mod, the application caps instant sell calculations to 1 unit rather than multiplying your total affordable units against a single buyer's order.
- Prevents players from purchasing excess inventory from syndicates when only a single buy order exists.
- Summary cards and table badges indicate exact quantities wanted and market depth across active orders.

### Strict Rank 0 Mod & Weapon Filtering
- Syndicate standing rewards are Rank 0 (unranked) mods.
- Discards all mod orders where rank is greater than 0, ensuring Rank 3 (max rank) listings do not inflate buyout prices or contaminate whisper messages.
- Syndicate weapons with earned affinity are untradable in Warframe and are excluded from calculations.

### Platform & Crossplay Filtering
- Toggle trading platforms directly in the toolbar:
  - Crossplay (Default): Includes PC orders and console players with crossplay enabled.
  - PC Only: Filters strictly to PC players.
  - PlayStation: Filters to PlayStation network orders.
  - Xbox: Filters to Xbox network orders.
- Filtering updates in real time without re-querying the Warframe.market API.

### Standing Liquidation Calculator
- Enter your available Syndicate standing or select a preset chip (25,000, 50,000, 100,000, 125,000, 132,000).
- Displays affordable unit counts per item.
- Calculates projected yields for both instant buyouts (real-time demand capped) and market listings.

### One-Click In-Game Whisper
- Generates standard Warframe trading whisper messages targeting active in-game buyers (prioritizing `ingame` over `online` status):
  ```text
  /w BuyerName Hi! I want to sell: [Item Name] for 15 platinum. (warframe.market)
  ```
- Automatically disables with "No active buyer" when no qualifying buyers are online.

### 24-Hour Sales Velocity & Liquidity Tracking
- Fetches confirmed transaction history from Warframe.market's closed statistics endpoint (`/v1/items/:slug/statistics`).
- Calculates units sold and volume-weighted average price over a rolling 24-hour window.
- Distinguishes unranked (Rank 0) transactions from max-rank (Rank 3) mod sales, ensuring liquidity metrics reflect Syndicate standing items accurately.
- Categorizes sales velocity into clear liquidity tiers:
  - High (10+ sold / 24h): High turnover, fastest liquidating items.
  - Moderate (4 - 9 sold / 24h): Consistent daily demand.
  - Low (1 - 3 sold / 24h): Slower moving offerings.
  - None (0 sold / 24h): Items with zero recorded sales in the last 24 hours.
- Interactive column sorting by 24h sales volume allows one-click identification of the most liquid offerings.
- Detailed hover tooltips display total volume (including max rank), volume-weighted average price, and elapsed time since the latest confirmed sale.

### Warframe 1999 Atragraph Card Filter
- Filters out signed collector editions (`subtype: atragraph`) by default so displayed values reflect standard rank 0 reward cards.
- Can be toggled on or off from the toolbar and settings panel.

---

## Settings

Access the settings panel via the gear icon in the top header:
- Cache Expiration: Configure order cache duration (5, 10, 15, or 30 minutes).
- Request Throttle: Adjust sequential scan rate limit delay (380ms recommended, 500ms, 750ms, 1000ms).
- Platform Selection: Default platform filter (Crossplay, PC, PlayStation, Xbox).
- Atragraph Cards: Exclude or include Warframe 1999 collector editions.
- Clear Cache: One-click cache flush to force fresh API queries.

---

## Technical Specifications

- Frontend: Single-file static HTML5/CSS3/ES6+ with zero external frameworks or CDNs.
- API Integration: Warframe.market API v2 order books (`/v2/orders/item/:slug`) and v1 closed transaction statistics (`/v1/items/:slug/statistics`).
- Local Proxy Architecture:
  - `/api/orders/:slug`: Proxies live order books with dynamic platform header forwarding and 15-minute in-memory caching.
  - `/api/statistics/:slug`: Proxies completed transaction data with dynamic platform header forwarding and 15-minute in-memory caching.
  - `/api/clear-cache`: Clears proxy cache in memory.
- Rate Limiting: Throttled sequential queue (380ms delay) with automatic HTTP 429 interception and backoff recovery.
- Local Storage: Persists user preferences, available standing, and cached market data across sessions.
- License: GNU General Public License v3.0 (GPLv3).

---

## License

Warframe Syndicate Standing Optimizer is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

See the [LICENSE](LICENSE) file for the full text.

Warframe and the Lotus logo are trademarks of Digital Extremes Ltd. Market data is sourced via the public Warframe.market API.
