# Warframe Syndicate Standing Optimizer

A local web application that queries Warframe.market order books and 24-hour sales statistics to calculate the most profitable Syndicate offerings for standing liquidation.

## Prerequisites

- Node.js 18+ (for `server.js`) or Python 3.8+ (for `server.py`)
- Web browser with modern JavaScript support
- Zero external package dependencies (no `npm install` or `pip install` required)

## Installation & Setup

### Node.js

```bash
git clone https://github.com/PolishDogge/SyndicateChecker.git
cd SyndicateChecker
npm start
```

### Python

```bash
git clone https://github.com/PolishDogge/SyndicateChecker.git
cd SyndicateChecker
python server.py
```

## Usage / Quickstart

1. Open `http://localhost:3000` in a browser.
2. Select a syndicate from the navigation bar.
3. Enter available standing or select a preset chip.
4. Select target trading platform (Crossplay, PC, PlayStation, Xbox).
5. Sort by `Sell Ratio` for listing efficiency, `Buy Ratio` for instant liquidation, or `24h Sales` for item liquidity.
6. Click "Whisper Instant Sell" on an item with active demand to copy the in-game whisper command.

## Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port on which the local HTTP server and API proxy listen. |

### API Proxy Endpoints

The local proxy routes bypass browser Cross-Origin Resource Sharing (CORS) constraints and maintain an in-memory cache with a 15-minute TTL:

- `GET /api/orders/:slug`: Proxies `/v2/orders/item/:slug`. Forwards platform filters.
- `GET /api/statistics/:slug`: Proxies `/v1/items/:slug/statistics`. Forwards platform filters.
- `GET /api/clear-cache`: Clears the in-memory cache.

## License

GNU General Public License v3.0 (GPLv3). See [LICENSE](LICENSE) for details.
