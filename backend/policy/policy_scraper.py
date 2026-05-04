import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from playwright.sync_api import sync_playwright

# Keywords for discovering policy links
POLICY_KEYWORDS = ["privacy", "policy", "data", "gdpr", "legal", "terms", "security"]

# Validation phrases to ensure the page is actually a privacy policy
VALIDATION_PHRASES = [
    "we collect", "personal data", "third party", "cookies", 
    "information we collect", "data usage", "your data"
]

def fetch_html(url: str, timeout: int = 10) -> str:
    """Fetches HTML using standard requests."""
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
        response = requests.get(url, headers=headers, timeout=timeout)
        if response.status_code == 200:
            return response.text
    except Exception as e:
        print(f"Requests fetch failed for {url}: {e}")
    return ""

def fetch_with_playwright(url: str, timeout: int = 15000) -> str:
    """Fetches HTML using Playwright as a fallback for dynamic pages."""
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
            context = browser.new_context()
            page = context.new_page()
            page.goto(url, wait_until="domcontentloaded", timeout=timeout)
            html = page.content()
            browser.close()
            return html
    except Exception as e:
        print(f"Playwright fetch failed for {url}: {e}")
    return ""

def find_policy_links(html: str, base_url: str) -> list:
    """Extracts all <a> tags and finds candidate policy links."""
    soup = BeautifulSoup(html, "html.parser")
    candidates = set()
    
    for a_tag in soup.find_all("a", href=True):
        href = a_tag["href"].strip()
        text = a_tag.get_text().strip().lower()
        
        # Check if any keyword matches href or text
        for kw in POLICY_KEYWORDS:
            if kw in text or kw in href.lower():
                absolute_url = urljoin(base_url, href)
                # Ensure it's not a javascript/mailto link
                if absolute_url.startswith("http"):
                    candidates.add(absolute_url)
                break
                
    return list(candidates)

def try_common_paths(base_url: str) -> list:
    """Returns common fallback paths to try if no links are found."""
    # Ensure base_url doesn't end with slash
    if base_url.endswith("/"):
        base_url = base_url[:-1]
        
    return [
        f"{base_url}/privacy",
        f"{base_url}/privacy-policy",
        f"{base_url}/legal/privacy",
        f"{base_url}/terms",
        f"{base_url}/data-policy",
        f"{base_url}/privacy.html"
    ]

def clean_html_text(html: str) -> str:
    """Extracts clean text from HTML content."""
    soup = BeautifulSoup(html, "html.parser")
    text_blocks = soup.find_all(['p', 'li', 'h1', 'h2', 'h3', 'div', 'span'])
    full_text = " ".join([b.get_text(strip=True) for b in text_blocks])
    # Remove excessive whitespaces
    full_text = " ".join(full_text.split())
    return full_text

def validate_policy_content(text: str) -> bool:
    """Validates if the text meets the threshold to be considered a privacy policy."""
    text_lower = text.lower()
    matches = 0
    for phrase in VALIDATION_PHRASES:
        if phrase in text_lower:
            matches += 1
            
    # Require at least 2 matching phrases
    return matches >= 2

def scrape_policy(base_url: str) -> dict:
    """
    Main orchestrator for policy detection.
    Returns structured JSON with status, url, content, and confidence.
    """
    print(f"Starting policy detection for {base_url}")
    
    # 1. Fetch homepage
    homepage_html = fetch_html(base_url)
    if not homepage_html:
        homepage_html = fetch_with_playwright(base_url)
        
    candidate_urls = []
    
    # 2. Extract links
    if homepage_html:
        candidate_urls = find_policy_links(homepage_html, base_url)
        
    # 3. Add fallbacks
    common_paths = try_common_paths(base_url)
    # Put common paths first as they are highly likely, then candidates
    urls_to_check = common_paths + candidate_urls
    
    # Remove duplicates but preserve order
    seen = set()
    unique_urls = []
    for u in urls_to_check:
        if u not in seen:
            seen.add(u)
            unique_urls.append(u)
            
    # Limit to top 15 links to prevent infinite loops / long execution
    unique_urls = unique_urls[:15]
    
    for url in unique_urls:
        print(f"Checking candidate policy URL: {url}")
        html = fetch_html(url)
        if not html:
            continue
            
        clean_text = clean_html_text(html)
        
        # 4. Content Validation
        if validate_policy_content(clean_text):
            print(f"Valid privacy policy found at: {url}")
            
            # Create a short summary snippet (first 300 chars)
            summary_snippet = clean_text[:300] + "..." if len(clean_text) > 300 else clean_text
            
            return {
                "status": "FOUND",
                "url": url,
                "content": clean_text,
                "summary": summary_snippet,
                "confidence": "HIGH"
            }
            
    # 5. Not found fallback
    return {
        "status": "NOT_FOUND",
        "url": None,
        "content": None,
        "summary": None,
        "confidence": "HIGH",
        "insight": "No accessible privacy policy found. This may indicate low transparency."
    }
