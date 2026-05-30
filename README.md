# Knock-Knock — Privacy Leak Scanner

Knock-Knock is a privacy analysis tool that scans websites for third-party trackers, potential data leaks, and mismatches between actual network behavior and the site's privacy policy.

Enter a URL, optionally describe the website you're scanning, and receive a detailed report with risk scores, tracker breakdowns, and policy insights.

## Features

- **Network traffic capture** — Uses Playwright to load the target site and record outbound requests
- **Tracker detection** — Identifies analytics, advertising, and data exfiltration endpoints
- **Data leak detection** — Flags sensitive information in network payloads
- **Privacy policy analysis** — Scrapes and parses policy text, then compares claims against observed traffic
- **Risk & transparency scores** — Summarizes findings with easy-to-read scores

### Website details (new)

Before scanning, you can optionally provide extra context about the target site:

| Field | Description |
|-------|-------------|
| **Website name** | Display name shown in the report (e.g. "Acme Store") |
| **Category** | E-commerce, SaaS, social media, finance, healthcare, etc. |
| **Scan purpose** | Personal curiosity, business audit, compliance review, research, vendor due diligence |
| **Additional pages** | Comma-separated paths to scan (e.g. `/checkout`, `/login`) |
| **Scan depth** | Standard (~15s/page) or Thorough (~25s/page) |
| **Notes** | Free-text context included in the final report |

The report ends with a **Website Profile** section that shows everything you entered, plus scan metadata (pages scanned, duration, requests captured, timestamp).

### Policy options

Under **Show Policy Options** on the home page, you can:

- Provide a custom privacy policy URL, or
- Paste raw policy text to skip auto-discovery

## Tech stack

| Layer | Stack |
|-------|-------|
| Frontend | React, Vite, Tailwind CSS, Chart.js |
| Backend | FastAPI, Playwright, BeautifulSoup |
| Deployment | Docker, Docker Compose, Azure (GitHub Actions) |

## Project structure

```
Knock-Knock/
├── backend/
│   ├── main.py                 # FastAPI entry point & /api/scan
│   ├── scanner/                # Playwright traffic capture
│   ├── analyzer/               # Tracker, leak, and risk analysis
│   └── policy/                 # Policy scraping & comparison
├── frontend/
│   └── src/
│       ├── pages/              # Home (scanner) & Report
│       └── components/         # RiskScore, TrackerTable, WebsiteProfile, etc.
└── docker-compose.yml
```

## Getting started

### Prerequisites

- Python 3.10+
- Node.js 18+
- (Optional) Docker & Docker Compose

### Backend setup

```bash
git clone https://github.com/Bot-Manav/Knock-Knock.git
cd Knock-Knock/backend

python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
playwright install

uvicorn main:app --reload
```

Backend runs at **http://localhost:8000**

API docs: **http://localhost:8000/docs**

### Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

Set `VITE_API_BASE_URL` in a `.env` file if the backend is not on `http://localhost:8000`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Docker (optional)

From the project root:

```bash
docker compose up --build
```

- Frontend: **http://localhost**
- Backend: **http://localhost:8000**

## Usage

1. Open the frontend in your browser.
2. Enter the target website URL.
3. Fill in **Website Details** (optional) — name, category, purpose, extra pages, scan depth, notes.
4. Expand **Policy Options** if you have a specific policy URL or text.
5. Click **Analyze** and wait for the scan to complete.
6. Review the report: summary, scores, trackers, leaks, policy insights, and the **Website Profile** at the bottom.

## API

### `POST /api/scan`

**Request body:**

```json
{
  "url": "https://example.com",
  "policy_url": "https://example.com/privacy",
  "policy_text": null,
  "website_details": {
    "name": "Example Store",
    "category": "ecommerce",
    "scan_purpose": "business",
    "notes": "Checking checkout page trackers",
    "additional_pages": ["/checkout", "/login"],
    "scan_depth": "standard"
  }
}
```

**Response includes:**

- `risk_score`, `transparency_score`
- `trackers`, `leaks`, `policy_summary`, `mismatches`
- `website_details` — echoed user input
- `scan_metadata` — pages scanned, page title, duration, request count, timestamp

## License

See the repository for license details.
