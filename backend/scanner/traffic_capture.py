from urllib.parse import urljoin, urlparse
from playwright.sync_api import sync_playwright
import time


def _build_page_urls(base_url: str, additional_pages: list[str] | None) -> list[str]:
    """Build a deduplicated list of URLs to scan, starting with the base URL."""
    urls = [base_url.rstrip("/")]
    seen = {urls[0]}

    for path in additional_pages or []:
        path = path.strip()
        if not path:
            continue
        full_url = path if path.startswith("http") else urljoin(base_url, path.lstrip("/"))
        full_url = full_url.rstrip("/")
        if full_url not in seen:
            seen.add(full_url)
            urls.append(full_url)

    return urls


def capture_traffic(
    url: str,
    additional_pages: list[str] | None = None,
    scan_depth: str = "standard",
):
    """
    Uses Playwright to navigate to the URL (and optional extra pages) and capture network traffic.
    Returns captured requests and metadata about the scan.
    """
    captured_requests = []
    pages_scanned = []
    page_title = None
    start_time = time.time()
    timeout_ms = 25000 if scan_depth == "thorough" else 15000
    urls_to_scan = _build_page_urls(url, additional_pages)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        context = browser.new_context()
        page = context.new_page()

        def handle_request(request):
            try:
                parsed_url = urlparse(request.url)
                domain = parsed_url.netloc

                post_data = request.post_data if request.method == "POST" else None
                payload_size = len(post_data) if post_data else 0

                captured_requests.append({
                    "url": request.url,
                    "domain": domain,
                    "method": request.method,
                    "post_data": post_data,
                    "payload_size": payload_size,
                    "timestamp": time.time() - start_time
                })
            except Exception as e:
                print(f"Error capturing request {request.url}: {e}")

        page.on("request", handle_request)

        for target_url in urls_to_scan:
            try:
                page.goto(target_url, wait_until="networkidle", timeout=timeout_ms)
                pages_scanned.append(target_url)
                if page_title is None:
                    page_title = page.title() or None
            except Exception as e:
                print(f"Navigation to {target_url} timed out or failed: {e}")
                if target_url not in pages_scanned:
                    pages_scanned.append(target_url)

        browser.close()

    return {
        "requests": captured_requests,
        "metadata": {
            "pages_scanned": pages_scanned,
            "page_title": page_title,
            "scan_duration_seconds": round(time.time() - start_time, 2),
            "total_requests_captured": len(captured_requests),
            "scan_depth": scan_depth,
        },
    }
