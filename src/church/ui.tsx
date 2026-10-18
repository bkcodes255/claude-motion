import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {clamp01, easeIn, easeOut, lerp, prog} from '../lib';
import {Mask} from '../components/primitives';
import {NARRATION} from './copy';
import {CTL, K, KF, ShotId} from './theme';

/** Navy field; `warm` shifts the bloom from blue to gold for the hopeful half. */
export const Stage: React.FC<{t: number; glow: number; warm: number; gx?: number; gy?: number}> = ({
  t,
  glow,
  warm,
  gx = 50,
  gy = 45,
}) => {
  const {width, height} = useVideoConfig();
  const c = (a: number) =>
    `rgba(${Math.round(lerp(62, 217, warm))},${Math.round(lerp(139, 182, warm))},${Math.round(
      lerp(255, 91, warm),
    )},${a})`;
  return (
    <AbsoluteFill style={{background: K.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 70% at ${gx}% ${gy}%, ${c(0.07 + 0.2 * glow)} 0%, ${c(0)} 72%)`,
        }}
      />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern
            id="churchDots"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${-t * 4} ${-t * 2})`}
          >
            <circle cx="22" cy="22" r="1.4" fill="rgba(170,200,255,0.13)" />
          </pattern>
          <radialGradient id="churchFade" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="80%" stopColor="#fff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="churchMask">
            <rect width={width} height={height} fill="url(#churchFade)" />
          </mask>
        </defs>
        <rect width={width} height={height} fill="url(#churchDots)" mask="url(#churchMask)" />
      </svg>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 85% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const display = (size: number, color: string = K.white): React.CSSProperties => ({
  fontFamily: KF.display,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 1.06,
  letterSpacing: '0.005em',
  textTransform: 'uppercase',
  color,
});

/** Masked lines that rise in one by one; `out` lifts them all away. */
export const Lines: React.FC<{
  t: number;
  at: number[];
  lines: React.ReactNode[];
  size?: number;
  color?: string;
  out?: number;
  style?: React.CSSProperties;
}> = ({t, at, lines, size = 84, color = K.white, out = 0, style}) => (
  <div style={{position: 'absolute', ...style}}>
    {lines.map((l, i) => (
      <div key={i} style={display(size, color)}>
        <Mask k={prog(t, at[i] ?? at[at.length - 1], (at[i] ?? at[at.length - 1]) + 0.8, easeOut)} out={out}>
          {l}
        </Mask>
      </div>
    ))}
  </div>
);

export const Gold: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{color: K.gold}}>{children}</span>
);

/** Fade + rise for anything that isn't type. */
export const rise = (k: number, px = 40): React.CSSProperties => ({
  opacity: clamp01(k * 1.4),
  transform: `translateY(${(1 - k) * px}px)`,
});

/** Burned-in narration: each shot's sentences share its window by length. */
export const Captions: React.FC<{t: number}> = ({t}) => {
  const s = CTL.shots.find((x) => t >= x.start && t < x.end);
  if (!s) return null;
  const lines = NARRATION[s.id as ShotId];
  const a = s.start + 0.8;
  const b = s.end - 0.5;
  const total = lines.reduce((n, l) => n + l.length + 12, 0);
  let acc = a;
  let cur = -1;
  let k = 0;
  lines.forEach((l, i) => {
    const d = ((l.length + 12) / total) * (b - a);
    if (t >= acc && t < acc + d) {
      cur = i;
      k = Math.min(prog(t, acc, acc + 0.3, easeOut), 1 - prog(t, acc + d - 0.25, acc + d, easeIn));
    }
    acc += d;
  });
  if (cur < 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 54,
        display: 'flex',
        justifyContent: 'center',
        opacity: k,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          padding: '14px 34px',
          borderRadius: 14,
          background: 'rgba(5,10,24,0.72)',
          fontFamily: KF.sans,
          fontWeight: 500,
          fontSize: 42,
          lineHeight: 1.3,
          color: K.white,
          textAlign: 'center',
        }}
      >
        {lines[cur]}
      </div>
    </div>
  );
};

/** Phone body; children draw the screen (inner size w-24 × h-24). */
export const Phone: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({x, y, w = 400, h = 800, style, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      borderRadius: 58,
      background: '#16213F',
      padding: 12,
      boxSizing: 'border-box',
      boxShadow: '0 40px 100px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(170,200,255,0.18)',
      ...style,
    }}
  >
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 46,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #13244D 0%, #0A1430 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: '50%',
          width: 110,
          height: 30,
          marginLeft: -55,
          borderRadius: 15,
          background: '#050A18',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 30,
          fontFamily: KF.sans,
          fontWeight: 600,
          fontSize: 20,
          color: K.dim,
        }}
      >
        9:41
      </div>
      {children}
    </div>
  </div>
);

/** A chat / SMS bubble on a phone screen. */
export const Bubble: React.FC<{
  from: string;
  children: React.ReactNode;
  k: number;
  tone?: 'threat' | 'safe' | 'plain';
  style?: React.CSSProperties;
}> = ({from, children, k, tone = 'plain', style}) => (
  <div
    style={{
      position: 'absolute',
      left: 22,
      right: 22,
      padding: '18px 22px',
      borderRadius: 24,
      background: K.panelHi,
      border: `1.5px solid ${tone === 'threat' ? 'rgba(255,84,104,0.5)' : tone === 'safe' ? K.gold : K.line}`,
      ...rise(k, 30),
      ...style,
    }}
  >
    <div
      style={{
        fontFamily: KF.mono,
        fontSize: 16,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: tone === 'threat' ? K.threat : K.muted,
        marginBottom: 8,
      }}
    >
      {from}
    </div>
    <div style={{fontFamily: KF.sans, fontWeight: 500, fontSize: 25, lineHeight: 1.34, color: K.white}}>
      {children}
    </div>
  </div>
);

export const LockIcon: React.FC<{size: number; open: number; color?: string; body?: string}> = ({
  size,
  open,
  color = K.gold,
  body,
}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{display: 'block', overflow: 'visible'}}>
    <path
      d={`M28 ${58 - open * 6} V36 A22 22 0 0 1 72 36 V58`}
      transform={`translate(0 ${-open * 20})`}
      fill="none"
      stroke={color}
      strokeWidth={10}
      strokeLinecap="round"
    />
    <rect x={14} y={50} width={72} height={60} rx={12} fill={body ?? color} />
    <circle cx={50} cy={76} r={7} fill={K.ink} />
    <rect x={46.5} y={76} width={7} height={18} rx={3.5} fill={K.ink} />
  </svg>
);

export const CheckIcon: React.FC<{size: number; k: number; color?: string}> = ({size, k, color = K.gold}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', overflow: 'visible'}}>
    <circle cx={50} cy={50} r={46} fill="none" stroke={color} strokeWidth={6} opacity={clamp01(k * 2)} />
    <path
      d="M28 52 L44 67 L73 36"
      fill="none"
      stroke={color}
      strokeWidth={9}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - k}
    />
  </svg>
);

export const WarnIcon: React.FC<{size: number; k: number}> = ({size, k}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{display: 'block', overflow: 'visible', opacity: clamp01(k * 2), transform: `scale(${0.6 + 0.4 * k})`}}
  >
    <path d="M50 8 L94 88 H6 Z" fill={K.threat} stroke={K.threat} strokeWidth={6} strokeLinejoin="round" />
    <rect x={45} y={36} width={10} height={30} rx={5} fill={K.white} />
    <circle cx={50} cy={76} r={6} fill={K.white} />
  </svg>
);

/** Rounded number badge for the five defenses. */
export const Badge: React.FC<{n: number; k: number; size?: number}> = ({n, k, size = 150}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: K.gold,
      color: K.ink,
      display: 'grid',
      placeItems: 'center',
      fontFamily: KF.display,
      fontWeight: 700,
      fontSize: size * 0.62,
      opacity: clamp01(k * 2),
      transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -10}deg)`,
      boxShadow: `0 0 ${40 * k}px rgba(${K.goldGlow},0.45)`,
    }}
  >
    {n}
  </div>
);

/** Simple person silhouette: head + shoulders. `h` is the full height. */
export const Person: React.FC<{h: number; color?: string}> = ({h, color = K.white}) => (
  <svg width={h * 0.62} height={h} viewBox="0 0 62 100" style={{display: 'block'}}>
    <circle cx={31} cy={22} r={17} fill={color} />
    <path d="M4 100 V72 C4 52 16 44 31 44 C46 44 58 52 58 72 V100 Z" fill={color} />
  </svg>
);
