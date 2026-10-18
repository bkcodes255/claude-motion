# 02 · Defend Your Digital Life — book launch

19.2 s · 1080×1920 (9:16) · 60 fps · stereo, −14 LUFS · source: [`src/book/BookLaunch.tsx`](../../src/book/BookLaunch.tsx), timeline [`src/book/timeline.json`](../../src/book/timeline.json), sound [`sfx/cues/book.py`](../../sfx/cues/book.py)

A launch teaser for *Cybersecurity for Everyday People: Defend Your Digital Life* by Godfrey Chinomona, for Reels, TikTok and Shorts.

## Prompt

> Are those repos all I need to create a product launch social media post? for marketing etc.

> the product is a book launch, https://amzn.eu/d/01JsLNRI

Plus a screenshot of the Amazon "Look inside" preview, which supplied the cover, subtitle and the book's own hook line.

## Storyboard

| Beat | Time | On screen |
|---|---|---|
| Hook | 0–3.9 s | Three scam alerts stack up (bank, parcel, "Hi Mum"); *You are already in a war.* (the book's opening line) |
| Defence | 4.2–8.7 s | A shield draws on and stamps every alert BLOCKED; *Your identity. Your money. Your family. Your privacy.* |
| Hero | 8.8–11.3 s | The shield swells to fill the frame and opens onto the cover |
| System | 11.3–14 s | Cover docks; *The SHIELD System — for personal cybersecurity* |
| End card | 14.4–19.2 s | *Available now* · Kindle & Paperback on Amazon · by Godfrey Chinomona |

The palette (navy, electric blue, gold) and the condensed display type (Oswald) come from the cover.

## Build

```bash
npm run book:build     # sound + render + mux → out/book-launch.mp4
npx remotion still BookLaunch out/book-poster.png --frame=1134   # end-card still for feed posts
```

`public/book/cover.jpg` is cropped from a screenshot of the Amazon preview, so it's soft and carries Amazon's "Copyrighted Material" watermark. Replace it with the original cover file (same 2:3 ratio) before posting.

## Post copy

**Instagram / TikTok**

> You are already in a war. 📱⚔️
> Scam texts, fake bank alerts, "Hi Mum, I lost my phone"… they're aimed at you every day.
>
> *Defend Your Digital Life* is out now: simple, practical steps to protect your identity, money, family and privacy, built around the SHIELD System for personal cybersecurity.
>
> 📘 Kindle & Paperback on Amazon (link in bio)
>
> #cybersecurity #onlinesafety #scamawareness #newbook #booklaunch #digitalsafety #identitytheft #privacy

**X**

> You are already in a war. This book is your weapon.
>
> Defend Your Digital Life: simple, practical steps to protect your identity, money, family and privacy online.
>
> Out now on Kindle & paperback → [link]

**LinkedIn**

> Today I'm launching *Cybersecurity for Everyday People: Defend Your Digital Life*.
>
> Most people don't think of themselves as targets. But every phishing text, fake delivery notice and "verify your account" email says otherwise. I wrote this book for everyone who isn't a security professional: clear, practical steps to protect your identity, money, family and privacy, organised around the SHIELD System.
>
> Available now on Kindle and paperback: [link]
> If it helps someone you know, please share it.

**Alt text:** Scam text alerts get blocked by a gold shield, which opens onto the cover of "Defend Your Digital Life" by Godfrey Chinomona, available now on Kindle and paperback on Amazon.
