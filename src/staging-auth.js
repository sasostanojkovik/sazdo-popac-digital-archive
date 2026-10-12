function securityHeaders(headers = new Headers(), env = {}) {
  const gaEnabled = Boolean(env.GA_MEASUREMENT_ID);
  const scriptSrc = gaEnabled
    ? "script-src 'self' https://www.googletagmanager.com"
    : "script-src 'self'";
  const connectSrc = gaEnabled
    ? "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com"
    : "connect-src 'self'";
  const imgSrc = gaEnabled
    ? "img-src 'self' data: https: https://www.google-analytics.com"
    : "img-src 'self' data: https:";

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "0");
  headers.set("X-Permitted-Cross-Domain-Policies", "none");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000");
  headers.set("Content-Security-Policy", `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; ${imgSrc}; media-src 'self' https: blob:; style-src 'self' 'unsafe-inline'; ${scriptSrc}; ${connectSrc}; frame-src https://www.youtube-nocookie.com https://www.youtube.com; font-src 'self' data:; manifest-src 'self'; upgrade-insecure-requests`);
  headers.set("X-Robots-Tag", "index, follow");
  return headers;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function injectGoogleTools(html, env) {
  let additions = "";

  if (env.GOOGLE_SITE_VERIFICATION) {
    additions += `\n<meta name="google-site-verification" content="${escapeHtml(env.GOOGLE_SITE_VERIFICATION)}">`;
  }

  if (env.GA_MEASUREMENT_ID) {
    const id = escapeHtml(env.GA_MEASUREMENT_ID);
    additions += `
<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}', { anonymize_ip: true });
</script>`;
  }

  return additions ? html.replace("</head>", additions + "\n</head>") : html;
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed.", {
        status: 405,
        headers: securityHeaders(new Headers({
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store"
        }), env)
      });
    }

    const asset = await env.ASSETS.fetch(request);
    const headers = securityHeaders(new Headers(asset.headers), env);
    const contentType = headers.get("Content-Type") || "";

    if (request.method === "GET" && contentType.includes("text/html")) {
      const html = await asset.text();
      return new Response(injectGoogleTools(html, env), {
        status: asset.status,
        statusText: asset.statusText,
        headers
      });
    }

    return new Response(asset.body, {
      status: asset.status,
      statusText: asset.statusText,
      headers
    });
  }
};
