# GitHub -> Cloudflare deployment plan

## Repository principle
Use a GitHub account and repository controlled by Sazdo/the authorised family rightsholder. Do not mix this archive with WPA or AI Advokat repositories.

## Before first public push
1. Review `archive-rights-register.csv` for every locally hosted media file.
2. Confirm the public contact email and ownership of the GitHub/Cloudflare accounts.
3. Keep secrets, banking data, access tokens and API keys out of the repository.
4. Review unconfirmed photo identities and YouTube/Facebook metadata before adding names/dates.

## GitHub
Upload the V12 root contents as the repository root. `index.html` must remain at repository root.

## Cloudflare Pages
Connect the GitHub repository to Cloudflare Pages as a static site. No build command is required for the current version; the publish directory is the repository root.

## Media strategy
The three current local web-ready MP4 files are below GitHub's hard single-file limit, but the long-term architecture should prefer official YouTube/Rumble embeds or dedicated object storage for growing video collections. This keeps the site repository light while the platform remains the central catalogue and viewing interface.

## Next phase
After the live site is stable, create the official video channels, standardise titles/descriptions/archive IDs, verify rights, then embed the official uploads back into the platform.
