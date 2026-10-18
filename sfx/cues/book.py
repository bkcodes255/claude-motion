"""Sound design for BookLaunch. Every time comes from src/book/timeline.json.

    python3 -m sfx sfx/cues/book.py
"""

from sfx.synth import blip, chime, click, envelope, impact, pad, pop, riser, whoosh

TIMELINE = "src/book/timeline.json"
OUT = "public/book.wav"
TARGET_LUFS = -14.0

# A minor while the threats stack up, opening to A major (add9) when the book lands.
BED_A = [110.0, 164.81, 220.0, 261.63, 329.63]
BED_B = [110.0, 164.81, 220.0, 277.18, 329.63, 493.88]
BLOCK_NOTES = [440.0, 523.25, 659.25]
ITEM_NOTES = [440.0, 554.37, 659.25, 880.0]


def score(mix, tl):
    s1, s2, s3, s4, s5 = tl["s1"], tl["s2"], tl["s3"], tl["s4"], tl["s5"]
    dur = tl["duration"]
    put = mix.put

    hit = s3["hit"]
    volume = envelope([
        (0, 0.5), (1.2, 1), (s3["grow"], 1), (hit - 0.05, 0.3),
        (hit + 0.4, 0.3), (hit + 1.0, 1.15), (dur - 1.2, 1.15), (dur, 0),
    ])
    mix.put_stereo(0, *pad(dur, [(0, BED_A), (hit, BED_B)], volume=volume), gain=0.03)

    # scene 1: alerts buzz in, the hook line lands
    for i, c in enumerate(s1["cards"]):
        at = max(c, 0) + 0.05
        put(at, pop(1400, 700, dur=0.12), 0.22, -0.2 + i * 0.2)
        put(at + 0.08, pop(1400, 700, dur=0.12), 0.14, -0.2 + i * 0.2)
    for i, w in enumerate([s1["line1"], s1["line2"]]):
        put(w, whoosh(0.3, 500, 2400, peak=0.45), 0.12, -0.2 + i * 0.4)
        put(w + 0.14, blip(110, dur=0.4, tau=0.1), 0.24)
    put(s1["exit"], whoosh(0.4, 2400, 600, peak=0.4), 0.12)

    # scene 2: the shield draws on and blocks every alert
    put(s2["shield"], whoosh(0.9, 300, 2000, peak=0.6), 0.14)
    put(s2["shield"] + 0.75, click(2200), 0.2)
    put(s2["shield"] + 0.78, chime([220.0, 329.63, 440.0], dur=1.4, tau=0.5), 0.12)
    for i, b in enumerate(s2["blocks"]):
        put(b, click(1800 + i * 200), 0.24, -0.3 + i * 0.3)
        put(b + 0.01, blip(BLOCK_NOTES[i], dur=0.4, tau=0.12), 0.16, -0.3 + i * 0.3)
    put(s2["cardsExit"], whoosh(0.5, 3000, 500, peak=0.4), 0.18, -0.5)
    put(s2["rise"], whoosh(0.75, 400, 1800, peak=0.6), 0.1)
    for i, it in enumerate(s2["items"]):
        put(it, whoosh(0.28, 500, 2400, peak=0.45), 0.09, -0.3 + i * 0.2)
        put(it + 0.12, blip(ITEM_NOTES[i], dur=0.35, tau=0.1), 0.14, -0.3 + i * 0.2)
    put(s2["exit"], whoosh(0.4, 2600, 600, peak=0.4), 0.12)

    # scene 3: the shield swells into the cover — the only impact in the mix
    put(s3["grow"] - 0.4, riser(hit - s3["grow"] + 0.4), 0.24)
    put(hit, impact(), 0.34)
    put(hit, chime([220.0, 277.18, 329.63, 440.0, 554.37], dur=2.4, tau=0.9), 0.14)
    put(s3["label"], pop(1760, 880), 0.12)
    put(s3["sweep"], whoosh(1.1, 1200, 6000, peak=0.5, q=0.5), 0.06, 0.3)

    # scene 4: cover docks, the SHIELD System line
    put(s4["move"], whoosh(0.8, 300, 1500, peak=0.5), 0.12)
    for i, w in enumerate([s4["line1"], s4["line2"]]):
        put(w, whoosh(0.3, 500, 2400, peak=0.45), 0.1)
        put(w + 0.13, blip([659.25, 554.37][i], dur=0.4, tau=0.12), 0.14)
    put(s4["exit"], whoosh(0.4, 2400, 600, peak=0.4), 0.1)

    # end card
    put(s5["headline"], whoosh(0.3, 500, 2600, peak=0.45), 0.12)
    put(s5["headline"] + 0.14, blip(880.0, dur=0.5, tau=0.14), 0.14)
    put(s5["pill"], pop(1320, 660), 0.3)
    put(s5["pill"] + 0.05, chime([440.0, 554.37, 659.25, 880.0], dur=2.6, tau=1.0), 0.13)
    put(s5["author"], click(2600), 0.08)
