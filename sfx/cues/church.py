"""Music + sound for ChurchMaster (5:00). Every time comes from src/church/timeline.json.

    python3 -m sfx sfx/cues/church.py

Follows the plan's music direction, all in A: low suspense (Am drone and a
heartbeat), subtle tension (Am-F-G-E with a quiet pulse), warm lift (A major
arpeggios), an understated 96 BPM beat under the five defenses, an uplift for
the book, and a final A-major resolve. Mastered quieter than social (-16 LUFS)
so narration can sit on top.
"""

import math

from sfx.synth import bass, blip, chime, click, envelope, hat, impact, kick, pad, pluck, pop, whoosh

TIMELINE = "src/church/timeline.json"
OUT = "public/church.wav"
TARGET_LUFS = -16.0

AM = [110.0, 164.81, 220.0, 261.63]
F = [87.31, 130.81, 174.61, 220.0]
G = [98.0, 146.83, 196.0, 246.94]
E = [82.41, 123.47, 164.81, 207.65]
A = [110.0, 164.81, 220.0, 277.18]
FSM = [92.5, 138.59, 185.0, 220.0]
D = [73.42, 110.0, 146.83, 185.0]
A_FULL = [110.0, 164.81, 220.0, 277.18, 329.63, 440.0]

MINOR = [AM, F, G, E]
MAJOR = [A, E, FSM, D]
ARP = [0, 1, 2, 3, 2, 1, 2, 3]


def score(mix, tl):
    sh = {s["id"]: s for s in tl["shots"]}
    dur = tl["duration"]
    put = mix.put

    tension = sh["s03"]["start"]
    warm = sh["s06"]["start"]
    beat_in = sh["s08"]["start"]
    book = sh["s13"]["start"]
    slate = sh["s15"]["start"]
    bar = 4.0

    def bars(a, b):
        n = int((b - a) // bar)
        return [a + i * bar for i in range(n)]

    # --- pad: one long bed with every chord change
    chords = [(0, AM)]
    chords += [(t, MINOR[i % 4]) for i, t in enumerate(bars(tension, warm))]
    chords += [(t, MAJOR[i % 4]) for i, t in enumerate(bars(warm, slate))]
    chords += [(slate, A_FULL)]
    chords = [(t, [f * 2 for f in c]) for t, c in chords]  # voiced up an octave: bass and kick own the low end
    volume = envelope([
        (0, 0.0), (2, 0.7), (tension, 0.8), (warm, 0.9), (beat_in, 0.75),
        (book - 1, 0.8), (book + 3, 1.3), (slate, 1.4), (dur - 3, 1.4), (dur, 0.0),
    ])
    mix.put_stereo(0, *pad(dur, chords, volume=volume, xfade=0.8), gain=0.02)

    # --- suspense: a slow heartbeat under shots 01-02
    t = 2.0
    while t < tension - 0.5:
        put(t, kick(punch=0.3), 0.18)
        put(t + 0.28, kick(punch=0.2), 0.11)
        t += 1.6

    # --- tension: quiet 8th-note pulse and ticks
    for i, b in enumerate(bars(tension, warm)):
        root = MINOR[i % 4][0]
        for q in range(8):
            tq = b + q * 0.5
            put(tq, bass(root, dur=0.22, cutoff=180, env=500), 0.06)
            put(tq + 0.25, hat(), 0.015, 0.25)

    # --- warm lift and everything after: A-major arpeggio in 8ths
    for i, b in enumerate(bars(warm, slate)):
        notes = [f * 4 for f in MAJOR[i % 4]]
        dense = b >= beat_in
        for q in range(8 if dense or b >= book else 4):
            step = 0.5 if (dense or b >= book) else 1.0
            put(b + q * step, pluck(notes[ARP[q % 8]], dur=0.6, tau=0.25, bright=2200), 0.08, -0.3 if q % 2 else 0.3)

    # --- understated beat under the five defenses
    beat = 60.0 / 96
    t = beat_in
    k = 0
    while t < book - 0.2:
        if k % 2 == 0:
            put(t, kick(punch=0.5), 0.17)
        put(t + beat / 2, hat(tau=0.02), 0.02, 0.25)
        put(t + beat / 2, bass(MAJOR[int((t - warm) // bar) % 4][0], dur=beat * 0.4, cutoff=240, env=700), 0.06)
        t += beat
        k += 1

    # --- sound effects
    for a in tl["s01"]["labels"]:
        put(a + 0.05, pop(1400, 700, dur=0.12), 0.1)
    s02 = tl["s02"]
    put(s02["keyTurn"], click(1400), 0.14)
    put(s02["bolt"], kick(punch=0.6), 0.14)
    put(s02["bolt"], click(900, dur=0.08), 0.16)
    put(s02["match"], whoosh(1.4, 300, 1800, peak=0.5), 0.06)
    put(s02["phoneUnlock"], click(2600), 0.1)
    put(tl["s03"]["sms"], pop(1200, 600), 0.1)
    put(tl["s03"]["warn"], pop(700, 350, dur=0.2), 0.14)
    s04 = tl["s04"]
    t = s04["call"] + 0.6
    while t < s04["call"] + 4.6:
        put(t, blip(659.25, dur=0.25, tau=0.08), 0.05)
        put(t + 0.2, blip(523.25, dur=0.25, tau=0.08), 0.05)
        t += 1.2
    put(s04["text"], pop(1200, 600), 0.1)
    for a in tl["s05"]["checks"]:
        put(a, blip(880.0, dur=0.4), 0.06)
    for i, a in enumerate(tl["s06"]["tiles"]):
        put(a, pop(900 + i * 120, 500), 0.06, -0.6 + i * 0.3)
    for i, a in enumerate(tl["s07"]["checks"]):
        put(a, blip([554.37, 659.25, 880.0][i], dur=0.45), 0.07)

    for n, sid in enumerate(["s08", "s09", "s10", "s11", "s12"]):
        p = tl[sid]
        put(p["badge"], pop(880 + n * 110, 440), 0.12)
        put(p["badge"] + 0.05, chime([440.0, 554.37, 659.25], dur=1.4, tau=0.5), 0.05)
    put(tl["s08"]["stop"], click(1600), 0.1)
    put(tl["s08"]["warn"], pop(700, 350, dur=0.2), 0.1)
    for i in range(4):
        put(tl["s09"]["locks"] + i * 0.25, click(2000 + i * 200), 0.08)
    put(tl["s10"]["approve"], click(2200), 0.1)
    put(tl["s10"]["done"], blip(880.0, dur=0.5), 0.07)
    put(tl["s11"]["done"], chime([659.25, 880.0, 1108.73], dur=1.6, tau=0.6), 0.06)
    put(tl["s12"]["cross"], pop(700, 350, dur=0.2), 0.1)
    put(tl["s12"]["verified"], blip(880.0, dur=0.5), 0.07)
    for i in range(5):
        put(tl["s12"]["all"] + 0.3 + i * 0.25, blip([440.0, 554.37, 659.25, 880.0, 1108.73][i], dur=0.45), 0.06)

    # the book: one soft low boom, a bell, and the slate's resolve
    put(tl["s13"]["reveal"], impact(1.6), 0.12)
    put(tl["s13"]["reveal"] + 0.1, chime([220.0, 277.18, 329.63, 440.0, 554.37], dur=3.0, tau=1.2), 0.08)
    put(tl["s13"]["sweep"], whoosh(1.6, 1200, 6000, peak=0.5, q=0.5), 0.03)
    put(tl["s15"]["qr"], pop(1320, 660), 0.08)
    put(tl["s15"]["brand"], chime([440.0, 554.37, 659.25, 880.0], dur=3.0, tau=1.2), 0.07)
