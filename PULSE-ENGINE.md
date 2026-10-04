# S&P PULSE ENGINE

Private YouTube performance control room for **Sasho & Popac Archive**.

## Purpose
Track real audience signals without artificial traffic. The dashboard is deliberately calibration-aware and does not invent unavailable YouTube Analytics values.

## Score model
- Average percentage viewed / retention: 25%
- CTR: 20%
- View velocity: 20%
- Subscriber conversion: 15%
- Engagement: 10%
- External traffic: 10%

Missing metrics are excluded from the provisional calculation and lower confidence. The first 10 public videos remain in **Calibration Mode**.

## Snapshot model
The repository contains only a conservative seed snapshot based on the channel-manager-provided YouTube Studio view. Additional snapshots entered in the dashboard are stored in browser localStorage under `spPulseSnapshotsV1`. They are not uploaded to GitHub automatically.

Use **Export JSON** to save the locally accumulated snapshot history.

## Privacy
The dashboard is intentionally not linked from the public archive navigation and includes `noindex,nofollow,noarchive`. At the current deployment stage the whole Cloudflare Worker is protected by HTTP Basic Auth. If the main archive becomes public later, protect this route separately before public launch.

## No manipulation
Do not use bought views, bots, sub-for-sub, autoplay farms, fake engagement or other artificial traffic. The engine is for measurement, learning and editorial decisions.
