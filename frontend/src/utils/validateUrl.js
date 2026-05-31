const HOSTNAME_RE = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export function formatUrl(input) {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

export function validateUrlInput(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, message: "Please enter a website URL." };
  }

  let url;
  try {
    url = new URL(formatUrl(trimmed));
  } catch {
    return { ok: false, message: "Invalid URL format. Use something like example.com" };
  }

  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local")) {
    return { ok: false, message: "Only public websites can be checked." };
  }

  if (!HOSTNAME_RE.test(host)) {
    return {
      ok: false,
      message: "Enter a valid public domain (e.g. example.com), not random text.",
    };
  }

  return { ok: true, url: url.href };
}

export async function parseApiError(response) {
  try {
    const data = await response.json();
    const detail = data.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  } catch {
    /* ignore */
  }
  if (response.status === 422) {
    return "We could not reach this website. Check the URL and try again.";
  }
  if (response.status === 400) {
    return "Invalid URL. Please enter a real, public website address.";
  }
  return `Scan failed (status ${response.status}). Please try again.`;
}
