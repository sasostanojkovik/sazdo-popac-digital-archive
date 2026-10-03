# GitHub -> Cloudflare deployment plan

## Repository principle
Use the GitHub account and repository controlled by Sazdo/the authorised family rightsholder. Do not mix this archive with WPA or AI Advokat repositories.

## Current deployment baseline
The active repository baseline is **V14 - GitHub Safe** on the `main` branch. `index.html` remains at repository root. Large local MP4 masters are intentionally excluded from the deployment repository.

## Before first staging deployment
1. Keep the repository **Private**.
2. Keep secrets, banking data, access tokens and API keys out of the repository.
3. Use Cloudflare Pages as a static deployment from the `main` branch; no framework build is required for the current site.
4. Treat the first deployment as **protected staging**, not the final public launch.
5. Review `archive-rights-register.csv` before any public launch. Records marked `private-preparation` or `pending verification` must not be treated as rights-cleared public assets without confirmation.
6. Review unconfirmed photo identities and YouTube/Facebook metadata before adding names, dates or other biographical claims.

## Cloudflare Pages
Connect this GitHub repository to Cloudflare Pages. The site is static HTML/CSS/JS. The repository root is the deployment output. The `_headers` file adds conservative baseline browser-security headers without changing site functionality.

## Media strategy
The video masters for `MPS-0003`, `MPS-0004` and `MPS-0005` remain outside GitHub. The repository keeps archival metadata and poster images; public playback should use verified YouTube/Rumble uploads or approved streaming/object storage after rights clearance.

## Rights/publication gate
The current site is suitable for private staging and technical review. Before a fully public launch, resolve the publication status of assets whose rights register still says `private-preparation` / `pending verification`, including the first archive photo and the three local legacy video records/posters.

## Incoming-material gate
New materials received after V14 (including additional book sources/covers and the newly supplied group photograph) should be ingested in a separate controlled content update after duplicate/version and rights checks. Do not overwrite canonical files merely because a differently named duplicate was supplied.

## Next phase
1. Deploy a protected Cloudflare staging build.
2. Test desktop/mobile navigation, PDFs, mail links, filters and privacy-enhanced YouTube embeds.
3. Complete rights/identity/content verification.
4. Ingest approved new materials as a versioned update.
5. Only then move from staging to the public launch configuration.

## Prepared password gate
A fail-closed Basic Authentication Worker is prepared at `src/staging-auth.js` but is **not enabled yet**. Before enabling it, create a Cloudflare Worker secret named `STAGING_PASSWORD` under Settings -> Variables and Secrets. The default username is `archive`. Do not store the password in GitHub. After the secret exists, enable `main: "./src/staging-auth.js"`, add the `ASSETS` binding, and set `run_worker_first: true` in `wrangler.jsonc`.
