# Warframe Syndicate Standing Optimizer ⚔️✨

A standalone, zero-dependency web app that tracks and ranks live **Warframe Market** prices for Syndicate rewards to identify the most profitable items to cash out your standing into Platinum.

Ready to deploy directly to **GitHub Pages** or open locally in any browser (`file:///`).

---

## 🌟 Key Features

- **All 6 Major Syndicates Supported**:
  - Steel Meridian
  - Arbiters of Hexis
  - Cephalon Suda
  - The Perrin Sequence
  - Red Veil
  - New Loka
- **Curated High-Volume Catalog**:
  - Over 210 verified items (35 items per syndicate: 3 syndicate weapons + 4 weapon augments + 28 warframe augments).
  - Exact standing costs (25,000 for augments, 100,000 / 125,000 for weapons).
  - Includes meta weapon augments like *Scattered Justice (Hek)*, *Winds of Purity (Furis)*, *Justice Blades (Dual Cleavers)*, *Gleaming Blight (Dark Dagger)*, etc.
- **Dual Profit Tracking**:
  - **Sell Listings (Market Price)**: Lowest sell price from in-game/online sellers.
  - **Instant Buyout (Quick Cash)**: Highest instant buy offers from active buyers waiting in-game for immediate standing liquidation.
- **Standing Efficiency Calculation**:
  - Computes exact **Platinum per 1,000 Standing**:
    $$\text{Ratio} = \frac{\text{Platinum Price}}{\frac{\text{Standing Cost}}{1,000}}$$
  - Gold/emerald highlights for top-efficiency rewards.
- **Rate-Limited Sequential Queue**:
  - Warframe Market API limits requests to ~3/sec. The app enforces an async FIFO queue with a strict 350ms delay, animated progress bar, and real-time scanning status.
- **Smart 15-Minute LocalStorage Cache**:
  - Per-syndicate cache with live countdown timer.
  - Auto-refreshes only when the countdown reaches 0 AND the tab is active.
  - "Force Refresh" button to clear cache and re-scan anytime.
- **One-Click Whisper Generator**:
  - Buy whisper: `/w {seller_name} Hello, I'd like to buy {item_name} for {price} platinum.`
  - Instant sell whisper: `/w {buyer_name} Hello, I'd like to sell {item_name} for {price} platinum.`
  - Instant clipboard copying with visual "Copied!" feedback.
- **Instant Search & Filtering**:
  - Real-time search by mod name, weapon name, or warframe name.
  - Filter pills for All, Augments, and Weapons.
  - Multi-column sortable table (click any header to toggle ascending/descending).
- **Orokin Dark Theme**:
  - Sleek, high-performance UI styled after Warframe's Void and Orokin aesthetics, with signature accent colors for each syndicate.
  - Zero external dependencies: no npm, no webpack, no external fonts or CDN stylesheets. 100% self-contained in a single `index.html`.

---

## 🚀 Quick Start & Deployment

### Option 1: Open Locally (Fastest)
Double-click `index.html` or open it directly in any browser (`file:///path/to/index.html`).

Or run a local HTTP server:
```bash
python -m http.server 8080
# Open http://localhost:8080 in your browser
```

### Option 2: Deploy to GitHub Pages (Free Hosting)
1. Push this repository to GitHub (or upload `index.html` to a new repo).
2. Go to repository **Settings** → **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your app will be live at `https://<username>.github.io/<repo>/` in seconds!

---

## ⚙️ Settings & API Configuration

Click the gear icon in the top header to configure:
- **Cache TTL**: 5, 10, 15 (default), or 30 minutes.
- **Queue Delay**: 300ms, 350ms (default safe throttle), 500ms, or 1000ms.
- **API Version**: `v2` (active endpoint) or `v1` (legacy).
- **CORS Proxy**: Direct fetch by default, or enter a custom proxy URL template if required by your network environment.

---

## 📄 License & Attribution
- Market data provided via the [Warframe.Market API](https://warframe.market).
- Warframe and the Lotus logo are trademarks of Digital Extremes Ltd.
