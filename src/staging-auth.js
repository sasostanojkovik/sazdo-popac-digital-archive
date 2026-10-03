const REALM = "Sazdo & Popac Archive — Staging";
const DEFAULT_USER = "archive";

function constantTimeEqual(a, b) {
  const aa = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  const len = Math.max(aa.length, bb.length);
  let diff = aa.length ^ bb.length;
  for (let i = 0; i < len; i++) diff |= (aa[i] || 0) ^ (bb[i] || 0);
  return diff === 0;
}

function securityHeaders(headers = new Headers()) {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "0");
  headers.set("X-Permitted-Cross-Domain-Policies", "none");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000");
  headers.set("Content-Security-Policy", "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https:; media-src 'self' https: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-src https://www.youtube-nocookie.com https://www.youtube.com; font-src 'self' data:; manifest-src 'self'; upgrade-insecure-requests");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return headers;
}

function deny(status, message, challenge = false) {
  const headers = securityHeaders(new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  }));
  if (challenge) headers.set("WWW-Authenticate", `Basic realm="${REALM}", charset="UTF-8"`);
  return new Response(message, { status, headers });
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return deny(405, "Method not allowed.");
    }

    if (!env.STAGING_PASSWORD) {
      return deny(503, "Staging protection is not configured.");
    }

    const auth = request.headers.get("Authorization") || "";
    if (!auth.startsWith("Basic ")) return deny(401, "Authentication required.", true);

    let decoded = "";
    try {
      decoded = atob(auth.slice(6));
    } catch {
      return deny(401, "Authentication required.", true);
    }

    const split = decoded.indexOf(":");
    if (split < 0) return deny(401, "Authentication required.", true);

    const username = decoded.slice(0, split);
    const password = decoded.slice(split + 1);
    const expectedUser = env.STAGING_USERNAME || DEFAULT_USER;

    if (!constantTimeEqual(username, expectedUser) || !constantTimeEqual(password, env.STAGING_PASSWORD)) {
      return deny(401, "Authentication required.", true);
    }

    const asset = await env.ASSETS.fetch(request);
    const headers = securityHeaders(new Headers(asset.headers));
    return new Response(asset.body, {
      status: asset.status,
      statusText: asset.statusText,
      headers
    });
  }
};
