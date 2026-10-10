# V8 source and duplicate register

This register records the canonical files used by the public package and the duplicate/variant decisions made during ingestion. Original uploads remain outside the public package unless selected as canonical assets.

## Canonical book sets

- Book 1: *Преку пеколот за сиромашните до рајот на богатите* / *Through Hell for the Poor to Heaven for the Rich* - MK + EN preview, 2022.
- Book 2: *Никогаш повеќе танго со ѓаволот* / *Tango with the Devil* - MK + EN preview, 2022.
- Book 3: *Дијаманти на мудроста* / *Gems of Wisdom* - MK + EN preview, 2022.
- Book 4: *Убави жени погрешни мажи* / *Beautiful Women Wrong Men* - MK + EN preview, 2022.

## Duplicates detected

1. `viber_image_2026-10-03_17-57-34-773.jpg` and `viber_image_2026-10-03_17-57-34-773(1).jpg` are byte-for-byte identical (same SHA-256). Only one content instance is needed.
2. The two supplied MK **Through Hell** internet PDFs have different file bytes but identical normalized extracted text; the existing canonical MK preview is retained.
3. The two supplied EN **Through Hell** internet PDFs likewise have different file bytes but identical normalized extracted text; the existing canonical EN preview is retained.
4. `DUPLO.jpg` and `viber_image_2026-10-03_17-50-12-933.jpg` are the same composite artwork at different resolution/encoding. The higher-resolution `DUPLO.jpg` is kept only as an archive source, not duplicated in the public assets.
5. `ЗАДНЈА КОРИЗА.jpg` and `viber_image_2026-10-03_17-47-03-070.jpg` are the same/near-identical quote artwork at different resolution. The higher-resolution `ЗАДНЈА КОРИЗА.jpg` is canonical.
6. `01  Преку пеколот ... KORICA ANGLISKI.jpg` and `viber_image_2026-10-03_17-51-37-841.jpg` are the same/near-identical English cover artwork at different resolution. The higher-resolution file is canonical.

## Distinct variants retained

- Macedonian and English covers are separate assets, not duplicates.
- Full wrap covers and internal quote spreads are treated as different archival objects.
- MK and EN preview PDFs are language variants, not duplicates.

## Canonical public filenames

- `assets/books/pdfs/beautiful-women-en-2022.pdf` - SHA-256 `82e7da921622ae2a8215765991795a86bfdae4166134db85c6955df3c9ebb35e`
- `assets/books/pdfs/beautiful-women-mk-2022.pdf` - SHA-256 `95acd344a80ab687c60d5189e97386e97c645848159864957e3f22d55c77dfa0`
- `assets/books/pdfs/gems-en-2022.pdf` - SHA-256 `8e46a0ea6282d3e6aa19eecd08533c782eeccad48feab8caaf24eb1c726f463f`
- `assets/books/pdfs/gems-mk-2022.pdf` - SHA-256 `bd4dfbb91be25715c486f442dff7dbdc60c5dc59c0540a10fd7c8bd50bfe5ff4`
- `assets/books/pdfs/preku-pekolot-internet-pregled-mk-2022.pdf` - SHA-256 `780fbe561d5465fd23bf13a44a4d7dc54872cffbf3905900ab00bf675af15a9f`
- `assets/books/pdfs/tango-en-2022.pdf` - SHA-256 `3dba2ea86ea7cffdc37024b0c1c465ba4f565d8518bdb8446774c52a35172a0d`
- `assets/books/pdfs/tango-mk-2022.pdf` - SHA-256 `79f80bd75261eb0b3e1c0ed3c5aa5b0f5d6f09b6beef52560bd8344f179ac021`
- `assets/books/pdfs/through-hell-internet-preview-en-2022.pdf` - SHA-256 `e92d726ce25c3b02412e34afba9fdd65d0414c76433dde3c2bdfbcab1caf0535`

## MPS-0006 - Facebook video link
- Canonical Source URL: https://www.facebook.com/100002620956951/videos/pcb.28052389117765078/1684058516671731
- Previous Watch alias: https://www.facebook.com/watch/?v=1684058516671731
- Status: external public link only; no local media copy stored.
- Verification: the archive curator reported that the Watch URL does not open correctly; the direct Facebook permalink is therefore the canonical link. Title/date/participants remain pending direct content verification.
- Archive action: linked from the Video section without re-uploading or claiming rights.


## MPS-0007 - YouTube video link
- Source URL: https://www.youtube.com/watch?v=bibAwqtJ5cI
- YouTube ID: `bibAwqtJ5cI`
- Status: external public link embedded through the YouTube privacy-enhanced player; no local media copy stored.
- Verification: direct metadata fetch was not reliable in the current environment, so title/date/participants remain pending.
- Duplicate control: may be an alternate publication of MPS-0006; keep separate until visual/content verification confirms whether they are the same recording.
- Archive action: embedded in the Video section without re-uploading or claiming rights.

## MPS-0006 URL normalization note
- Canonical Facebook permalink: https://www.facebook.com/100002620956951/videos/pcb.28052389117765078/1684058516671731
- Previous Watch URL retained only as an alias: https://www.facebook.com/watch/?v=1684058516671731
- Both reference Facebook video ID `1684058516671731`; no second archive record is created.

## V11 - YouTube batch + archive photo

The latest ingestion adds one user-supplied archive photograph plus 15 new unique YouTube video IDs. Exact YouTube titles/dates/participants remain pending because direct metadata retrieval was not reliable in the current environment.

### Archive photo

- `MPS-0001` - `assets/images/sasho/archive-photo-mps-0001.jpg` - three people visible; identities/date/place/event intentionally left unlabelled until confirmed by the archive curator.
- `MPS-0002` - `assets/images/sasho/archive-photo-mps-0002.jpg` - group photograph from Sasho's archive; identities/date/place/event intentionally left unlabelled until confirmed by the archive curator.

### New YouTube records

- `MPS-0008` - YouTube ID `241kq9mJu2M` - canonical URL: https://www.youtube.com/watch?v=241kq9mJu2M
- `MPS-0009` - YouTube ID `oMa1N9-wwG8` - canonical URL: https://www.youtube.com/watch?v=oMa1N9-wwG8
- `MPS-0010` - YouTube ID `Rp_INXFGvJw` - canonical URL: https://www.youtube.com/watch?v=Rp_INXFGvJw
- `MPS-0011` - YouTube ID `loLwcy9bJ84` - canonical URL: https://www.youtube.com/watch?v=loLwcy9bJ84
- `MPS-0012` - YouTube ID `wQN3DwykqxQ` - canonical URL: https://www.youtube.com/watch?v=wQN3DwykqxQ
- `MPS-0013` - YouTube ID `8e5hs9qaiM4` - canonical URL: https://www.youtube.com/watch?v=8e5hs9qaiM4
- `MPS-0014` - YouTube ID `8omhcjGk5NA` - canonical URL: https://www.youtube.com/watch?v=8omhcjGk5NA
- `MPS-0015` - YouTube ID `Zay7R-azkXc` - canonical URL: https://www.youtube.com/watch?v=Zay7R-azkXc
- `MPS-0016` - YouTube ID `tjRpZHf2apQ` - canonical URL: https://www.youtube.com/watch?v=tjRpZHf2apQ
- `MPS-0017` - YouTube ID `zHlHd_-Os0o` - canonical URL: https://www.youtube.com/watch?v=zHlHd_-Os0o
- `MPS-0018` - YouTube ID `RR8UnUNoaAc` - canonical URL: https://www.youtube.com/watch?v=RR8UnUNoaAc
- `MPS-0019` - YouTube ID `nrLDNVtzWUY` - canonical URL: https://www.youtube.com/watch?v=nrLDNVtzWUY
- `MPS-0020` - YouTube ID `WU7g_oDVLx8` - canonical URL: https://www.youtube.com/watch?v=WU7g_oDVLx8
- `MPS-0021` - YouTube ID `KAGaVkaTVVc` - canonical URL: https://www.youtube.com/watch?v=KAGaVkaTVVc
- `MPS-0022` - YouTube ID `J8yHsaMI7f4` - canonical URL: https://www.youtube.com/watch?v=J8yHsaMI7f4

### Duplicate control

- `bibAwqtJ5cI` was supplied again in the same batch. It remains the existing `MPS-0007`; no duplicate record was created.
- The tracking parameter on the supplied `oMa1N9-wwG8` URL was removed; the canonical stored URL keeps only the YouTube video ID.

## V12 - Signal / Frame / Memory interface

- Public interface redesigned as a cinematic/editorial archive without changing the canonical media records.
- Photo Archive is a separate first-class section with collection placeholders and lightbox behavior.
- YouTube embeds use `youtube-nocookie.com` and load only after user interaction.
- Video filtering is client-side and does not create duplicate records.
- No new identities, dates, titles, rights claims or biographical facts were inferred by the interface redesign.

## Deployment note — V14

MPS-0003, MPS-0004 and MPS-0005 remain canonical archival records, but their local MP4 masters are intentionally excluded from the GitHub/Cloudflare deployment package. Poster images and metadata remain public; playback should be activated through a verified streaming source after rights clearance.

## V15 — Уметнички слики – Попац

- New controlled collection: `Уметнички слики – Попац` / `artworks-popac`.
- `MPS-0024` — supplied master `atelje_so najnovi sliki.mpg`; ~03:48; SHA-256 `f38865a32af388024430eb04d4ca3dc2baebee53ad9a7ad4d72d27c12b000aee`.
- `MPS-0025` — supplied master `Слики од старо скопје со песни од Миодраг Станојковиќ.mpg`; ~00:49; SHA-256 `9ace9dacc007255561dc755226f582176c4d58c06b42d3062c95a3d9b0b88359`.
- The original MPG masters remain outside public GitHub/Cloudflare deployment. The repository stores catalog metadata and cryptographic hashes.
- The second filename supplies an attribution to Miograd/Miodrag Stanojkovik songs; exact track identification and all rights remain pending verification.
- Artwork authorship, dates, dimensions, techniques and ownership are not inferred from the video and must be confirmed by the archive.



## V16 — password-protected staging playback

- `MPS-0003` staging derivative: `assets/video/takov-e-zivotot-miodrag-stanojkovik-web.mp4`.
- `MPS-0004` staging derivative: `assets/video/bezgrizno-devojce-miodrag-stanojkovik-web.mp4`.
- `MPS-0005` staging derivative: `assets/video/crveni-karanfili-za-skopje-miodrag-stanojkovik-web.mp4`.
- These are optimized web derivatives for the password-protected staging environment; the original archive masters remain outside GitHub.
- This deployment change does not constitute rights clearance. Public release, re-uploading, licensing and monetization remain pending verification of copyright and related rights.


## V17 — Collection 05 routing

- `MPS-0024` and `MPS-0025` remain archive video masters, but they are catalogued and displayed under **Collection 05 — Уметнички слики – Попац** because their archival context is the atelier/artwork/old-Skopje collection.
- They are removed from the general Screening Room list to avoid presenting them as ordinary external videos.
- Their original MPG masters remain outside public deployment; only metadata is shown until source/context/rights verification is complete.
- Canonical collection metadata is maintained in `data/artworks-popac.json`.


## V18 — Collection 05 staging video players

- `MPS-0024` web derivative: `assets/video/mps-0024-atelje-popac-web.mp4`.
- `MPS-0025` web derivative: `assets/video/mps-0025-staro-skopje-popac-web.mp4`.
- Both records now render as native HTML5 video players directly inside **Collection 05 — Уметнички слики – Попац**.
- They remain excluded from the general Screening Room.
- Playback is intended for the password-protected staging environment; original MPG masters remain outside GitHub.
- Public release, licensing and monetization remain pending verification of copyright and related rights.


## V19 — artwork video poster frames

- Collection 05 video players now show a title-card thumbnail before playback instead of a blank/black player.
- `MPS-0024` captures its representative poster frame at ~00:20.
- `MPS-0025` captures its representative poster frame at ~00:06.
- A built-in SVG title card is used as an immediate fallback while the representative frame is being loaded.
- Playback still starts from the beginning; this change affects only the pre-play visual presentation.


## MPS-0019 — Интервјуа на Попац

- YouTube ID: `nrLDNVtzWUY`.
- Archive curator classification: **Интервјуа на Попац**.
- Display title: **Интервју со Миодраг Станојковиќ – Попац**.
- The record is displayed in the dedicated Popac interviews subsection and no longer appears in the general video grid.
- Exact date, programme/station, host and other participants remain pending verification.
- Source remains an external YouTube embed; no local copy is stored.


## MPS-0024 — YouTube Content ID gate

- Current public-upload candidate remains **Private**.
- YouTube notice date: **2026-10-05**.
- Claimant shown by YouTube: **SME**.
- Claimed audio 1: **“Rose (From "Titanic" Soundtrack)” — James Horner**; effect: blocked in 1 territory.
- Claimed audio 2: **“My Heart Will Go On” — Céline Dion**; effect shown by YouTube: no current impact until channel monetization.
- YouTube states this is **not a copyright strike** and has **no impact on the channel**.
- Archive decision: preserve the original MPS-0024 master unchanged and private; prepare **MPS-0024-PUB v1** as a public derivative without the claimed audio before any canonical public YouTube release.
