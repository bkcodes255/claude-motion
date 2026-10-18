import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {clamp01, lerp} from '../lib';
import {B, BF} from './theme';

const SHIELD_PATH = 'M50 4 L92 17 V57 C92 85 73 104 50 116 C27 104 8 85 8 57 V17 Z';

/**
 * Shield with a padlock. `draw` strokes the outline on, `fill` floods it,
 * `lock` pops the padlock in, `glow` drives the halo.
 */
export const Shield: React.FC<{
  size: number;
  draw: number;
  fill: number;
  lock: number;
  glow: number;
}> = ({size, draw, fill, lock, glow}) => (
  <svg
    width={size}
    height={size * 1.2}
    viewBox="0 0 100 120"
    style={{
      overflow: 'visible',
      display: 'block',
      filter: `drop-shadow(0 0 ${8 + 34 * glow}px rgba(${B.blueGlow},${0.25 + 0.5 * glow}))`,
    }}
  >
    <defs>
      <linearGradient id="shieldFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2A6BE0" />
        <stop offset="100%" stopColor={B.navy} />
      </linearGradient>
    </defs>
    <path d={SHIELD_PATH} fill="url(#shieldFill)" opacity={fill} />
    <path
      d={SHIELD_PATH}
      fill="none"
      stroke={B.gold}
      strokeWidth={3.2}
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
    <g
      opacity={clamp01(lock * 2)}
      transform={`translate(50 66) scale(${lerp(0.4, 1, lock)}) translate(-50 -66)`}
    >
      <path
        d="M40 60 V50 A10 10 0 0 1 60 50 V60"
        fill="none"
        stroke={B.white}
        strokeWidth={4.2}
        strokeLinecap="round"
      />
      <rect x={34} y={58} width={32} height={26} rx={5} fill={B.white} />
      <circle cx={50} cy={69} r={3.4} fill={B.navy} />
      <rect x={48.6} y={69} width={2.8} height={8} rx={1.4} fill={B.navy} />
    </g>
  </svg>
);

/** A phone notification that can be stamped BLOCKED and thrown off screen. */
export const Alert: React.FC<{
  app: string;
  icon: string;
  msg: string;
  time: string;
  k: number;
  blocked: number;
  stamp: number;
  out: number;
  style?: React.CSSProperties;
}> = ({app, icon, msg, time, k, blocked, stamp, out, style}) => (
  <div
    style={{
      position: 'absolute',
      width: 880,
      boxSizing: 'border-box',
      padding: '28px 34px',
      borderRadius: 32,
      background: B.panel,
      border: `1.5px solid ${B.line}`,
      display: 'flex',
      gap: 26,
      opacity: clamp01(k * 1.6) * (1 - 0.45 * blocked) * (1 - out),
      transform: `translate(${-out * 900}px, ${(1 - k) * 70}px) scale(${0.93 + 0.07 * k}) rotate(${-out * 6}deg)`,
      ...style,
    }}
  >
    <div
      style={{
        width: 76,
        height: 76,
        flexShrink: 0,
        borderRadius: 22,
        background: blocked > 0.5 ? B.muted : B.threat,
        color: B.white,
        fontFamily: BF.sans,
        fontWeight: 700,
        fontSize: 38,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {icon}
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: BF.mono,
          fontSize: 22,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: B.muted,
          marginBottom: 10,
        }}
      >
        <span>{app}</span>
        <span>{time}</span>
      </div>
      <div style={{position: 'relative'}}>
        <div
          style={{
            fontFamily: BF.sans,
            fontWeight: 500,
            fontSize: 36,
            lineHeight: 1.28,
            color: B.white,
          }}
        >
          {msg}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            height: 4,
            borderRadius: 2,
            width: `${blocked * 100}%`,
            background: B.gold,
          }}
        />
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        right: 26,
        top: -22,
        padding: '8px 18px',
        borderRadius: 999,
        background: B.gold,
        color: B.bg,
        fontFamily: BF.mono,
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: '0.2em',
        opacity: clamp01(stamp * 3),
        transform: `scale(${stamp}) rotate(${(1 - stamp) * -12}deg)`,
      }}
    >
      BLOCKED
    </div>
  </div>
);

/** Navy field with a blue bloom, a drifting dot grid and a vignette. */
export const BookBackground: React.FC<{t: number; glow: number; glowY: number}> = ({
  t,
  glow,
  glowY,
}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: B.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 45% at 50% ${glowY}%, rgba(${B.blueGlow},${
            0.08 + 0.26 * glow
          }) 0%, rgba(${B.blueGlow},0) 72%)`,
        }}
      />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern
            id="bookDots"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${-t * 3} ${-t * 9})`}
          >
            <circle cx="20" cy="20" r="1.3" fill="rgba(170,200,255,0.16)" />
          </pattern>
          <radialGradient id="bookGridFade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="75%" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="bookGridMask">
            <rect width={width} height={height} fill="url(#bookGridFade)" />
          </mask>
        </defs>
        <rect width={width} height={height} fill="url(#bookDots)" mask="url(#bookGridMask)" />
      </svg>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
