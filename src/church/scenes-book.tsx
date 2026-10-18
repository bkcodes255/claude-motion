import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {clamp01, easeInOut, easeOut, lerp, prog, sp} from '../lib';
import {display, Gold, Lines, rise} from './ui';
import {ASSETS, CFPS, CTL, K, KF} from './theme';
import type {SceneProps} from './scenes-story';

const spr = (frame: number, at: number, cfg = {}) => sp(frame, at, cfg, CFPS);

// Shots 13 and 14 share this spot so the cross-fade reads as one cover.
const COVER = {cx: 560, cy: 500, w: 500};

export const Cover: React.FC<{
  cx: number;
  cy: number;
  w: number;
  k?: number;
  sweep?: number;
  t: number;
}> = ({cx, cy, w, k = 1, sweep = 0, t}) => {
  const h = w * ASSETS.coverRatio;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        borderRadius: 6,
        overflow: 'hidden',
        opacity: clamp01(k * 1.6),
        transform: `perspective(2400px) translateY(${(1 - k) * 60}px) scale(${0.9 + 0.1 * k}) rotateY(${
          (1 - k) * -12 + 1.6 * Math.sin(t * 0.5)
        }deg)`,
        boxShadow: `0 50px 120px rgba(0,0,0,0.6), 0 0 80px rgba(${K.goldGlow},0.25)`,
      }}
    >
      <Img src={staticFile(ASSETS.cover)} style={{width: '100%', height: '100%', display: 'block'}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.25) 2.4%, rgba(255,255,255,0.06) 4%, rgba(0,0,0,0) 8%)',
        }}
      />
      {sweep > 0 && sweep < 1 ? (
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            bottom: '-20%',
            width: '45%',
            left: `${lerp(-60, 120, sweep)}%`,
            transform: 'rotate(14deg)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0) 100%)',
          }}
        />
      ) : null}
    </div>
  );
};

/** 13: the actual cover, slow reveal, title beside it. */
export const S13: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s13;
  const k = spr(frame, p.reveal, {damping: 22, stiffness: 60, mass: 1.4});
  return (
    <AbsoluteFill>
      <Cover {...COVER} k={k} sweep={prog(t, p.sweep, p.sweep + 1.6, easeInOut)} t={t} />
      <Lines
        t={t}
        at={[p.line1, p.line1 + 0.3]}
        lines={['Cybersecurity for', 'everyday people™']}
        size={64}
        color={K.dim}
        style={{left: 1000, top: 250}}
      />
      <Lines
        t={t}
        at={[p.line2, p.line2 + 0.3]}
        lines={['Defend your', <Gold key="g">digital life</Gold>]}
        size={124}
        style={{left: 1000, top: 410}}
      />
      <div
        style={{
          position: 'absolute',
          left: 1000,
          top: 720,
          width: 820,
          fontFamily: KF.sans,
          fontSize: 34,
          lineHeight: 1.4,
          color: K.dim,
          ...rise(prog(t, p.tagline, p.tagline + 1, easeOut), 20),
        }}
      >
        Protect Yourself. Protect Your Family. Protect Your Future.
      </div>
    </AbsoluteFill>
  );
};

/** 14: author and mission. Uses the real portrait when ASSETS.author is set, otherwise keeps the cover. */
export const S14: React.FC<SceneProps> = ({t}) => {
  const p = CTL.s14;
  const name = prog(t, p.name, p.name + 0.9, easeOut);
  const role = prog(t, p.role, p.role + 0.9, easeOut);
  const mission = prog(t, p.mission, p.mission + 1, easeOut);
  return (
    <AbsoluteFill>
      {ASSETS.author ? (
        <div
          style={{
            position: 'absolute',
            left: COVER.cx - 260,
            top: COVER.cy - 340,
            width: 520,
            height: 680,
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 50px 120px rgba(0,0,0,0.6)',
            ...rise(prog(t, p.cover, p.cover + 1.2, easeOut)),
          }}
        >
          <Img src={staticFile(ASSETS.author)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      ) : (
        <Cover {...COVER} t={t} />
      )}
      <div style={{position: 'absolute', left: 1000, top: 300}}>
        <div style={{width: 120 * name, height: 6, borderRadius: 3, background: K.gold, marginBottom: 34}} />
        <div style={{...display(110), ...rise(name, 30)}}>Godfrey Chinomona</div>
        <div
          style={{
            fontFamily: KF.mono,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: '0.2em',
            color: K.gold,
            marginTop: 20,
            ...rise(role, 20),
          }}
        >
          AUTHOR &amp; TECHNOLOGY PROFESSIONAL
        </div>
        <div
          style={{
            width: 780,
            marginTop: 70,
            fontFamily: KF.sans,
            fontSize: 38,
            lineHeight: 1.45,
            color: K.dim,
            ...rise(mission, 20),
          }}
        >
          Taking cybersecurity beyond IT departments, into our homes, churches, schools, businesses and communities.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 15: the purchase slate, exact copy from the plan, cover + QR + Acextic. */
export const S15: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s15;
  const cover = spr(frame, p.cover, {damping: 20, stiffness: 90, mass: 1});
  const L = p.lines.map((a) => prog(t, a, a + 0.8, easeOut));
  const qr = spr(frame, p.qr, {damping: 14, stiffness: 150});
  const brand = prog(t, p.brand, p.brand + 1, easeOut);
  const center = 1010;
  return (
    <AbsoluteFill>
      <Cover cx={330} cy={470} w={400} k={cover} t={t} />
      <div style={{position: 'absolute', left: center - 440, width: 880, top: 120, textAlign: 'center'}}>
        <div style={{...display(40, K.dim), ...rise(L[0], 16)}}>Cybersecurity for Everyday People™</div>
        <div style={{...display(84, K.gold), marginTop: 6, ...rise(L[0], 16)}}>Defend Your Digital Life</div>
        <div style={{fontFamily: KF.sans, fontSize: 30, color: K.dim, marginTop: 18, ...rise(L[1], 16)}}>
          Protect Yourself. Protect Your Family. Protect Your Future.
        </div>
        <div style={{...display(112), marginTop: 46, ...rise(L[2], 24)}}>Get your copy today</div>
        <div style={{fontFamily: KF.sans, fontWeight: 600, fontSize: 48, color: K.white, marginTop: 14, ...rise(L[3], 20)}}>
          Available here after the service
        </div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 34,
            padding: '16px 40px',
            borderRadius: 999,
            background: K.gold,
            color: K.ink,
            fontFamily: KF.sans,
            fontWeight: 700,
            fontSize: 34,
            ...rise(L[4], 16),
          }}
        >
          Meet the Author • Buy a Copy • Give a Copy
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1530,
          top: 250,
          width: 300,
          textAlign: 'center',
          opacity: clamp01(qr * 2),
          transform: `scale(${0.85 + 0.15 * qr})`,
        }}
      >
        <div style={{fontFamily: KF.mono, fontWeight: 600, fontSize: 22, letterSpacing: '0.18em', color: K.gold, marginBottom: 18}}>
          ALSO AVAILABLE ON AMAZON
        </div>
        <div style={{background: '#fff', borderRadius: 20, padding: 12}}>
          <Img src={staticFile(ASSETS.qr)} style={{width: 276, height: 276, display: 'block'}} />
        </div>
        <div style={{fontFamily: KF.sans, fontSize: 24, color: K.dim, marginTop: 16}}>Scan to buy on Amazon</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 820,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 26,
          ...rise(brand, 16),
        }}
      >
        <span style={{fontFamily: KF.sans, fontWeight: 600, fontSize: 34, color: K.white}}>Godfrey Chinomona</span>
        <span style={{width: 2, height: 40, background: K.line}} />
        <Img src={staticFile(ASSETS.logo)} style={{height: 46, width: 46 * ASSETS.logoRatio}} />
        <span style={{fontFamily: KF.sans, fontSize: 30, color: K.dim}}>Acextic Corporation</span>
      </div>
    </AbsoluteFill>
  );
};
