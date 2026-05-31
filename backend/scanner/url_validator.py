import re
from urllib.parse import urlparse

# Basic hostname: labels with TLD (2+ chars) — blocks obvious garbage
HOSTNAME_RE = re.compile(
    r"^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$"
)

BLOCKED_HOSTS = {"localhost", "127.0.0.1", "0.0.0.0", "::1"}


def validate_scan_url(url: str) -> tuple[bool, str | None]:
    """Return (ok, error_message)."""
    try:
        parsed = urlparse(url.strip())
    except Exception:
        return False, "Invalid URL format."

    if parsed.scheme not in ("http", "https"):
        return False, "URL must start with http:// or https://"

    host = (parsed.hostname or "").lower()
    if not host:
        return False, "Please enter a valid website address (e.g. example.com)."

    if host in BLOCKED_HOSTS or host.endswith(".local"):
        return False, "Local or internal addresses cannot be scanned."

    if not HOSTNAME_RE.match(host):
        return False, "Please enter a valid public domain (e.g. example.com)."

    return True, None
