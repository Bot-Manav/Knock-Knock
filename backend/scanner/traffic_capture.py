from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
import json

def capture_traffic(url: str):
    """
    Uses Playwright to navigate to the URL and capture network traffic.
    Returns a list of captured request dictionaries.
    """
    captured_requests = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        def handle_request(request):
            try:
                parsed_url = urlparse(request.url)
                domain = parsed_url.netloc
                
                # capture post data if present
                post_data = request.post_data if request.method == "POST" else None
                
                captured_requests.append({
                    "url": request.url,
                    "domain": domain,
                    "method": request.method,
                    "post_data": post_data
                })
            except Exception as e:
                print(f"Error capturing request {request.url}: {e}")

        page.on("request", handle_request)
        
        try:
            # Wait until network is idle or 15 seconds max
            page.goto(url, wait_until="networkidle", timeout=15000)
        except Exception as e:
            print(f"Navigation to {url} timed out or failed: {e}")
            # We still keep the captured requests even if it times out
            pass
            
        browser.close()
        
    return captured_requests
