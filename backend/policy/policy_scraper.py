from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin

def scrape_policy(url: str) -> str:
    """
    Attempts to find and scrape the privacy policy of the given URL.
    Returns the extracted text of the policy or an empty string if not found.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=10000)
            
            # Extract all links
            links = page.eval_on_selector_all("a", "elements => elements.map(e => ({href: e.href, text: e.innerText}))")
            
            policy_url = None
            for link in links:
                href = link.get('href', '')
                text = link.get('text', '').lower()
                if href and ("privacy" in text or "privacy" in href.lower()):
                    policy_url = href
                    break
            
            if not policy_url:
                print("Could not find a privacy policy link.")
                return ""
                
            # Navigate to policy URL
            print(f"Found policy link: {policy_url}")
            page.goto(policy_url, wait_until="domcontentloaded", timeout=10000)
            
            html = page.content()
            soup = BeautifulSoup(html, "html.parser")
            
            # Extract text from paragraphs
            text_blocks = soup.find_all(['p', 'li', 'h1', 'h2', 'h3'])
            full_text = " ".join([b.get_text() for b in text_blocks])
            
            return full_text
            
        except Exception as e:
            print(f"Error scraping policy: {e}")
            return ""
        finally:
            browser.close()
