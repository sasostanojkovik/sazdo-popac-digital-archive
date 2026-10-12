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
  headers.set("X-Robots-Tag", "index, follow");
  return headers;
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed.", {
        status: 405,
        headers: securityHeaders(new Headers({
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store"
        }))
      });
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
