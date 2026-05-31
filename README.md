# Knock-Knock — Privacy Leak Scanner

Knock-Knock (PLS) helps people understand **whether a website's privacy policy matches what the site actually does** — for transparency, fair user agreements, and compliance. It is a **help tool**, not a hacking or penetration-testing platform.

Enter a URL and run a **Simple scan** (any public site) or **Master scan** (full audit when you have permission). You get scores, data-flow overview, and plain-language explanations.

## Scan modes

| Mode | When to use | What it does |
|------|-------------|--------------|
| **Simple scan** (default) | Any public website | Homepage only; top 5 partners; scores; 2 policy highlights; gaps hidden |
| **Master scan** | You own the site or have permission | All trackers, every mismatch, leak notes, data-flow domains, compliance steps, profile |

## What problem it solves

Modern websites often connect to third-party analytics, ads, and services. Users and site owners may not know whether those connections are **disclosed honestly** in the privacy policy. Knock-Knock answers that question ethically.

## Architecture (PLS components)

| Component | Implementation |
|-----------|----------------|
| **1. Input module** | URL + optional website context, policy URL/text |
| **2. Traffic capture** | Playwright — loads only URLs you provide |
| **3. Data leak detection** | Passive check for email, location, cookie signals in observed requests |
| **4. Tracker detection** | Known tracker database + behavior classification |
| **5. Risk scoring** | Privacy risk + transparency scores |
| **6. Visualization dashboard** | Data flow diagram, score charts, tracker table |
| **7. Explainability layer** | Plain-language insights + compliance guidance |

## Ethical use policy

**Do use Knock-Knock to:**

- Audit sites you **own** or have **written permission** to review
- Check policy alignment for compliance (GDPR, CCPA, internal audits)
- Educate teams about transparency and user agreements

**Do not use Knock-Knock to:**

- Scan sites without permission
- Probe hidden paths, bypass security, or enumerate internal systems
- Attack, exploit, or "crack" anything

Simple scan is for public transparency checks; Master scan is for authorized full audits.

## Features

- **Network traffic capture** — Playwright loads your URL and records outbound requests
- **Tracker detection** — Analytics, advertising, and data-sharing endpoints
- **Data leak signals** — Email, location, and cookie-related patterns (with policy context)
- **Privacy policy analysis** — Scrapes or accepts policy text; compares vs. traffic
- **Risk & transparency scores** — Easy-to-read summary metrics
- **Data flow overview** — Visitor → your site → third-party partners
- **Plain-language insights** — Technical results explained for non-experts
- **Compliance guidance** — Ethical next steps for policy alignment

### Website details (Master scan)

| Field | Description |
|-------|-------------|
| **Website name** | Display name in the report |
| **Category** | E-commerce, SaaS, healthcare, etc. |
| **Scan purpose** | Compliance audit, vendor review, etc. |
| **Additional pages** | Only paths **you** list (e.g. `/checkout`) |
| **Scan depth** | Standard (~15s/page) or Thorough (~25s/page) |
| **Notes** | Context for your records |

Invalid or unreachable URLs return an error — **no fake report** is generated.

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
│   ├── main.py
│   ├── scanner/          # Traffic capture, URL validation
│   ├── analyzer/         # Trackers, leaks, scores, explainability
│   └── policy/           # Policy scraping & comparison
├── frontend/
│   └── src/
│       ├── pages/        # Home & Report
│       └── components/   # DataFlow, PlainLanguage, RiskScore, etc.
└── docker-compose.yml
```

## Getting started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
playwright install
uvicorn main:app --reload
```

API: **http://localhost:8000** · Docs: **http://localhost:8000/docs**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: **http://localhost:5173**

Optional `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Docker

```bash
docker compose up --build
```

## Usage

1. Open the frontend.
2. Enter a **valid public URL** (e.g. `example.com`).
3. Click **Simple Scan** — or enable **Master scan** if you own the site.
4. Optionally add website context (Master scan only).
5. Review the report.

## API

### `POST /api/scan`

Returns on success:

- `scan_status`, `scan_mode`, `risk_score`, `transparency_score`
- `trackers`, `leaks`, `policy_summary`, `mismatches`
- `plain_language` — explainability insights
- `data_flow` — grouped third-party connections
- `compliance_insights` — ethical guidance
- `website_details`, `scan_metadata`

Returns **400** for invalid URLs, **422** if the site cannot be reached.

## License

See the repository for license details.
