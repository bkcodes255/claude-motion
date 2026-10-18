"""Sound design for BookLaunch. Every time comes from src/book/timeline.json.

    python3 -m sfx sfx/cues/book.py

A 112 BPM track in A minor, its bar grid anchored so a downbeat lands on the
cover reveal (s3.hit). Am–F–G–E builds under the threats, the drums drop out
for a snare roll into the hit, then it opens into A major for the book.
"""

import math

from sfx.synth import bass, braaam, chime, click, envelope, hat, impact, kick, pad, pluck, pop, riser, snare, whoosh

TIMELINE = "src/book/timeline.json"
OUT = "public/book.wav"
TARGET_LUFS = -14.0

BPM = 112

# bar index relative to the hit (bar 0 starts on s3.hit) -> (bass root, arp notes)
BEFORE = {-1: 82.41, -2: 98.0, -3: 87.31}  # E, G, F; everything earlier is Am
AM_ROOT = 110.0
AFTER = [
    (110.0, [440.0, 554.37, 659.25, 880.0]),  # A
    (92.5, [369.99, 440.0, 554.37, 739.99]),  # F#m
    (73.42, [293.66, 369.99, 440.0, 587.33]),  # D
    (82.41, [329.63, 415.3, 493.88, 659.25]),  # E
]
FINAL = [220.0, 277.18, 329.63, 440.0, 554.37, 659.25]
ARP = [0, 1, 2, 3, 2, 1, 2, 3]


def score(mix, tl):
    s1, s2, s3, s5 = tl["s1"], tl["s2"], tl["s3"], tl["s5"]
    dur = tl["duration"]
    put = mix.put
    hit, grow = s3["hit"], s3["grow"]

    beat = 60.0 / BPM
    bar = 4 * beat
    k0 = math.ceil(-hit / beat)
    k1 = math.floor((dur - hit) / beat)
    beats = [(k, hit + k * beat) for k in range(k0, k1 + 1)]
    final_bar = hit + len(AFTER) * bar  # the last chord rings out from here
    resume = hit + 2 * beat  # groove comes back after the hit has breathed

    def root(k):
        b = math.floor(k / 4)
        if b < 0:
            return BEFORE.get(b, AM_ROOT)
        return AFTER[min(b, len(AFTER) - 1)][0]

    # pads: a low Am drone under the threats, A major after the reveal
    pre = envelope([(0, 0.6), (grow, 1.0), (hit, 0.0)])
    mix.put_stereo(0, *pad(hit + 0.4, [(0, [110.0, 164.81, 220.0, 261.63])], volume=pre), gain=0.022)
    post = envelope([(0, 0), (0.6, 0.7), (final_bar - hit, 1.0), (dur - hit - 0.3, 1.0), (dur - hit, 0)])
    mix.put_stereo(hit, *pad(dur - hit, [(0, FINAL[:4]), (final_bar - hit, FINAL)], volume=post), gain=0.024)

    for k, t in beats:
        pre_hit = t < grow - 0.02
        groove = resume - 0.01 <= t < final_bar - 0.01
        if not (pre_hit or groove):
            continue
        pos = k % 4
        # bass opens up as the threat builds; once the kick is in it sits on the off-beats
        open_ = min(1.0, t / grow) if pre_hit else 0.8
        swell = 0.55 + 0.45 * min(1.0, t / s1["line1"])
        kicking = t >= s1["line1"] - 0.1
        for half in ((0.5,) if kicking else (0, 0.5)):
            note = bass(root(k), dur=beat * (0.4 if kicking else 0.28), cutoff=200 + 450 * open_, env=700 + 1300 * open_)
            put(t + half * beat, note, 0.1 * swell)
        if kicking:
            put(t, kick(), 0.3)
        # backbeat from the shield on
        if pos in (1, 3) and t >= s2["shield"] + 0.4:
            put(t, snare(), 0.16, 0.05)
        # hats: 16th ticks, louder on the off-beat 8th
        for q in range(4):
            g = (0.05 if q == 2 else 0.022) * swell
            put(t + q * beat / 4, hat(tau=0.035 if q == 2 and groove else 0.012), g, 0.3 if q % 2 else -0.15)
        # A-major arpeggio after the reveal
        if groove:
            notes = AFTER[min(math.floor(k / 4), len(AFTER) - 1)][1]
            for q in range(2):
                i = (pos * 2 + q) % len(ARP)
                put(t + q * beat / 2, pluck(notes[ARP[i]]), 0.075, -0.35 if q else 0.35)

    # snare roll from the drum drop into the hit: 8ths, 16ths, then 32nds
    t, step = grow - 0.02, beat / 2
    while t < hit - 0.01:
        k = (t - grow) / (hit - grow)
        put(t, snare(dur=0.18), 0.04 + 0.16 * k * k, 0.1)
        step = beat / 2 if k < 0.35 else beat / 4 if k < 0.75 else beat / 8
        t += step

    # last chord: one kick, a crash of light, and a ring-out
    put(final_bar, kick(), 0.3)
    put(final_bar, hat(dur=1.2, tau=0.35), 0.06, 0.2)
    put(final_bar, chime([440.0, 554.37, 659.25, 880.0], dur=2.0, tau=0.9), 0.08)

    # sound effects on top of the music, kept sparse
    for i, c in enumerate(s1["cards"]):
        at = max(c, 0) + 0.05
        put(at, pop(1400, 700, dur=0.12), 0.14, -0.2 + i * 0.2)
        put(at + 0.08, pop(1400, 700, dur=0.12), 0.09, -0.2 + i * 0.2)
    put(s2["shield"], whoosh(0.9, 300, 2000, peak=0.6), 0.1)
    for i, b in enumerate(s2["blocks"]):
        put(b, click(1800 + i * 200), 0.16, -0.3 + i * 0.3)
    put(grow - 0.4, riser(hit - grow + 0.4), 0.18)
    put(hit, impact(), 0.3)
    put(hit, braaam(110.0), 0.26)
    put(s5["pill"], pop(1320, 660), 0.18)
