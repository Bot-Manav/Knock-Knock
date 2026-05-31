from urllib.parse import urljoin, urlparse
from playwright.sync_api import sync_playwright
import re
import time

ERROR_PAGE_PATTERNS = re.compile(
    r"err_|dns_probe|can't be reached|not found|404|access denied|"
    r"connection refused|name not resolved|invalid url|this site can.?t",
    re.I,
)


def _build_page_urls(base_url: str, additional_pages: list[str] | None) -> list[str]:
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


def _is_browser_error_page(page_url: str, title: str, status: int | None) -> str | None:
    if "chrome-error://" in page_url or "about:neterror" in page_url:
        return "The browser could not load this address (site unreachable or invalid)."

    if status is not None and status >= 400:
        return f"The server returned HTTP {status} — the page may not exist or is not publicly accessible."

    combined = f"{title} {page_url}"
    if ERROR_PAGE_PATTERNS.search(combined):
        return "The page appears to be an error page, not a live website."

    return None


def capture_traffic(
    url: str,
    additional_pages: list[str] | None = None,
    scan_depth: str = "standard",
):
    """
    Navigate only to user-provided URLs and capture network traffic.
    Returns reachable=False if the primary URL cannot be loaded.
    """
    captured_requests = []
    pages_scanned = []
    pages_failed = []
    page_title = None
    start_time = time.time()
    timeout_ms = 25000 if scan_depth == "thorough" else 15000
    urls_to_scan = _build_page_urls(url, additional_pages)
    primary_url = urls_to_scan[0]
    primary_error = None

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        context = browser.new_context()
        page = context.new_page()

        def handle_request(request):
            try:
                parsed_url = urlparse(request.url)
                post_data = request.post_data if request.method == "POST" else None
                captured_requests.append({
                    "url": request.url,
                    "domain": parsed_url.netloc,
                    "method": request.method,
                    "post_data": post_data,
                    "payload_size": len(post_data) if post_data else 0,
                    "timestamp": time.time() - start_time,
                })
            except Exception as e:
                print(f"Error capturing request {request.url}: {e}")

        page.on("request", handle_request)

        for i, target_url in enumerate(urls_to_scan):
            is_primary = i == 0
            try:
                response = page.goto(
                    target_url,
                    wait_until="domcontentloaded",
                    timeout=timeout_ms,
                )
                status = response.status if response else None
                final_url = page.url
                title = (page.title() or "").strip()
                load_error = _is_browser_error_page(final_url, title, status)

                if load_error:
                    pages_failed.append({"url": target_url, "reason": load_error})
                    if is_primary:
                        primary_error = load_error
                    continue

                pages_scanned.append(target_url)
                if page_title is None and title:
                    page_title = title

            except Exception as e:
                reason = "Connection timed out or the site refused the connection."
                err_text = str(e).lower()
                if "net::err_name_not_resolved" in err_text:
                    reason = "This domain name could not be resolved — check the URL spelling."
                elif "net::err_connection_refused" in err_text:
                    reason = "The server refused the connection."
                elif "timeout" in err_text:
                    reason = "The website took too long to respond."

                pages_failed.append({"url": target_url, "reason": reason})
                if is_primary:
                    primary_error = reason
                print(f"Navigation to {target_url} failed: {e}")

        browser.close()

    reachable = primary_url in pages_scanned and primary_error is None

    return {
        "requests": captured_requests if reachable else [],
        "reachable": reachable,
        "error": primary_error if not reachable else None,
        "metadata": {
            "pages_scanned": pages_scanned,
            "pages_failed": pages_failed,
            "page_title": page_title,
            "scan_duration_seconds": round(time.time() - start_time, 2),
            "total_requests_captured": len(captured_requests) if reachable else 0,
            "scan_depth": scan_depth,
        },
    }
