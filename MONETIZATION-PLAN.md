# Монетизациски план — Саздо & Попац

## Принцип на сопственост
Сите профили за наплата, YouTube/AdSense и продажба треба да бидат на Саздо Станојковиќ или на лице/субјект што тој писмено ќе го овласти. Јавниот GitHub код не смее да содржи банкарски податоци, лозинки, API keys или други тајни.

## Фаза 1 — веднаш
- Осумте книги добиваат посебна библиотека на веб-страницата.
- Копче „Нарачај / прашај“ отвора подготвен e-mail до `sashostanojkovik20@gmail.com`.
- За секоја книга се додаваат цена, формат, достапност, ISBN и начин на испорака дури откако авторот ќе ги потврди.

## Фаза 2 — продавница
- Може да се поврзе продавница/checkout на профил што го контролира Саздо.
- За дигитални PDF/ePub изданија се продаваат само верзии за кои авторот/издавачот ги има потребните права.
- За печатени книги може да се користи издавач, сопствена нарачка или друг легитимен продажен канал.

## Фаза 3 — YouTube
- Официјален YouTube канал со playlists за Попац, песни, настапи, интервјуа и Shorts.
- Монетизацијата се вклучува само по прифаќање во YouTube Partner Program и по проверка дека секое видео е подобно за монетизација.
- Content ID/claim за архивска музика не се оспорува автоматски; прво се проверуваат носителите на правата.

## Фаза 4 — лиценцирање и поддршка
- Медиумски лиценци за архивски фотографии/видеа со писмена согласност.
- Спонзорства и поддршка на архивата со јасно означување.
- Членство или fan-funding ако е достапно и соодветно.

## Пред јавна активација
1. Потврда на сите 8 наслови и нивниот редослед.
2. Оригинални корици (не screenshots), најмалку 1200 px по висина.
3. Цена и достапност за секоја книга.
4. Издавач и ISBN, ако постојат.
5. Потврда кој има право на продажба на печатена/дигитална верзија.
6. Посебни услови за приватност, колачиња и продажба ако се активира платежен систем или реклами.


## Book-sales activation gate (V5)

Do not display a fixed price or a “Buy now” checkout until Sazdo confirms, per edition: price, inventory/print-on-demand status, shipping territories/costs, seller/payment account, refund/return terms, and whether a digital edition may legally be sold. Until then the site uses “Прашај за достапност” via email.

The COBISS result supplied for the site shows 8 bibliographic records but only 6 distinct visible titles because `Вистински правец` appears in three records. Full COBISS identifiers/ISBNs should be checked before mapping each record to a commercial SKU.

## Digital-edition protection model

Digital sales remain disabled until the seller confirms that the relevant electronic-edition rights are available. When activated, the portal should not distribute one identical unrestricted master PDF to every buyer.

Planned delivery model:
1. Keep the archival/master PDF private.
2. Generate a buyer-specific derivative for each completed order.
3. Assign a unique licence/order ID to the delivered copy.
4. Add a visible but non-destructive copyright/licence footer and optional watermark.
5. Record the purchaser-to-licence mapping only in the seller's private order records; do not expose private customer data in the public repository.
6. State clearly that purchase grants a personal, non-transferable use licence and does not transfer copyright.
7. Prohibit resale, redistribution, public upload, sublicensing and commercial reproduction without written permission.
8. Prefer expiring/signed download delivery rather than a permanent public PDF URL.
9. Retain the SHA-256 of the archival master and a delivery audit record for provenance.
10. Do not claim that a PDF is technically impossible to copy; use traceability, contractual terms and rights enforcement instead.

No payment credentials, purchaser data or private order records belong in GitHub.

