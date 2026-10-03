# Warframe Syndicate Standing Optimizer ⚔️✨

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Warframe Market API v2](https://img.shields.io/badge/Warframe.Market-API%20v2-00d2ff.svg)](https://warframe.market)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success.svg)](package.json)

A standalone, zero-dependency web app that tracks and ranks live **Warframe Market** prices for Syndicate rewards to identify the most profitable items to cash out your standing into Platinum.

Ready to deploy directly to **GitHub Pages** or run locally in any browser with the included zero-dependency proxy servers (`server.js` or `server.py`).

---

## 🌟 Key Features

### 1. Strict Rank 0 / Unranked Filtering
- **Mod Rank 0 Enforcement**:
  - Syndicate standing redemptions award **Rank 0 (unranked)** mods only.
  - Both buy (`order_type === 'buy'`) and sell (`order_type === 'sell'`) orders discard any mod listings where `order.rank !== 0` (or `mod_rank !== 0`).
  - Completely disregards Rank 3 (max rank) buy listings so cashout ratios and "Whisper Instant Sell" messages never match against high-rank buy orders.
- **Weapon Unranked Enforcement**:
  - Syndicate weapons with earned affinity cannot be traded in Warframe. Weapon orders with rank > 0 are automatically discarded.
- **Crossplay & Platform Filtering**:
  - Select trading platform directly in the toolbar and settings:
    - **Crossplay** (Default): Accepts orders from PC players as well as any player with `user.crossplay === true`.
    - **PC Only**: Accepts orders from PC players.
    - **PlayStation**: Accepts PlayStation (`ps4`/`ps5`) orders.
    - **Xbox**: Accepts Xbox orders.
  - Toggling platform recalculates all metrics instantly across active items without network re-fetching.

### 2. Standing Liquidation Calculator
- **Available Standing Input & Quick Presets**:
  - Set your exact syndicate standing or click quick preset chips: `25,000`, `50,000`, `100,000`, `125,000`, or `Max (132k)`.
- **Real-Time Unit & Platinum Projections**:
  - **Affordable Units**: Each row computes `Math.floor(availableStanding / standingCost)` with an intuitive status badge (`4x affordable`).
  - **Projected Platinum Yield**:
    - Instant Buyout: Displays total instant Platinum yield (`Units * Instant Buyout Price`, e.g. `4x → 60p`).
    - Lowest Sell: Displays total listing Platinum yield (`Units * Lowest Sell Price`).
- **Dynamic Top Cashout Card**:
  - Top Instant Cashout summary card projects your exact liquidatable Platinum yield based on currently entered standing (e.g. `Smoke Shadow • 60p total (4x @ 15p)`).

### 3. Warframe 1999 "Atragraph" Card Filter
- Filters out special signed collector editions (`subtype: 'atragraph'`) by default so prices reflect standard rank 0 Syndicate reward cards.
- Interactive toolbar toggle switch `[✓] Exclude Atragraphs` and settings dropdown allow toggling on/off with zero-latency in-memory re-evaluation.

### 4. One-Click In-Game Instant Sell Whisper
- Targets the highest active in-game buyer (prioritizes `ingame` > `online`):
  ```text
  /w {buyer_ingame_name} Hi! I want to sell: [{Item Name}] for {highest_buy_plat} platinum. (warframe.market)
  ```
- Copies directly to clipboard with visual button animation ("Copied!" with checkmark).
- Automatically disables with `"No active buyer"` when no qualifying buyers are online.

### 5. Streamlined 7-Column Data Table & Incremental Scan
- Displays: `Item Name`, `Standing Cost`, `Lowest Sell`, `Plat / 1k Standing`, `Instant Buyout`, `Sellers / Live Orders`, and `Actions`.
- Live incremental row rendering: items update immediately as each API request completes.
- Real-time search and category filtering (`All`, `Warframe Augments`, `Weapon Augments`, `Syndicate Weapons`).
- Multi-column sort across all numeric and textual headers.

---

## 🚀 Quick Start (Zero-CORS Setup)

Because browser Same-Origin Policy (SOP) blocks frontend web apps from reading Warframe.market's API responses directly, two zero-dependency local proxy server options are included:

### Option 1: Node.js (Primary Server)
```bash
npm start
# or: node server.js
```
- Built strictly on Node.js standard modules (`http`, `fs`, `path`, native `fetch`) with **zero npm dependencies**.
- Serves static files on `process.env.PORT || 3000`.
- Proxies `/api/orders/:slug` to Warframe Market API with required headers (`Platform: pc`, `Language: en`, `Accept: application/json`).
- Includes a 15-minute in-memory cache to eliminate duplicate external requests.

### Option 2: Python (Backup Server)
```bash
python server.py
```
- Built 100% on Python 3 standard library (`http.server`, `urllib.request`, `socketserver`) with **zero pip dependencies**.
- Replicates identical static file serving, CORS headers, and `/api/orders/:slug` proxy routing.

### Client Auto-Detection & Fallback
The frontend in `index.html` automatically queries `/api/orders/:slug` on same-origin first, checks local port `3000` if opened via `file:///`, falls back to direct remote API calls, and presents a diagnostic alert banner if requests are blocked by browser CORS.

---

## ⚙️ Settings

Click the gear icon in the top header to configure:
- **Cache Expiration (TTL)**: 5, 10, 15 (default), or 30 minutes.
- **Queue Throttle Delay**: 380ms (Safe / Recommended), 500ms, 750ms, or 1000ms.
- **Trading Platform**: Crossplay (Default), PC Only, PlayStation, or Xbox.
- **Atragraph Card Filter**: Exclude Atragraphs (Recommended) or Include Atragraphs.
- **Clear All Caches**: One-click purge of all stored syndicate cache entries.

---

## 📄 License & Legal Notice

This project is licensed under the **GNU General Public License v3.0 (GPLv3)**. See the [LICENSE](LICENSE) file for the full license text.

```text
Warframe Syndicate Standing Optimizer
Copyright (C) 2026 polishdogge

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```

- Market data provided via the [Warframe.Market API](https://warframe.market).
- Warframe and the Lotus logo are trademarks of Digital Extremes Ltd.
