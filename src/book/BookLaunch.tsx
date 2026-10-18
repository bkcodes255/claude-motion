import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeIn, easeInOut, easeOut, lerp, prog, sp} from '../lib';
import {Grain, Mask} from '../components/primitives';
import {useFonts} from '../components/useFonts';
import {Alert, BookBackground, Shield} from './parts';
import {B, BF, BFPS, BOOK_FONTS, BTL, BW, LOGO} from './theme';

const ALERTS = [
  {app: 'Bank alert', icon: '£', time: 'now', msg: 'Unusual sign-in detected. Verify your account now.'},
  {app: 'Parcel service', icon: 'P', time: '2m', msg: 'Your parcel is on hold. Pay £1.99 to release it.'},
  {app: 'Unknown number', icon: '?', time: '5m', msg: 'Hi Mum, I lost my phone. Text me on this new number.'},
];
const ALERT_TOP = [400, 630, 860];

const ITEMS = ['identity.', 'money.', 'family.', 'privacy.'];

const COVER_RATIO = 834 / 555;
const COVER_HERO = {cx: BW / 2, cy: 1000, w: 640};
const COVER_END = {cx: BW / 2, cy: 270 + (470 * COVER_RATIO) / 2, w: 470};

const display = (size: number, color: string = B.white): React.CSSProperties => ({
  fontFamily: BF.display,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 1.04,
  letterSpacing: '0.005em',
  textTransform: 'uppercase',
  color,
});

const Centered: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  top,
  children,
  style,
}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', ...style}}>
    {children}
  </div>
);

export const BookLaunch: React.FC = () => {
  useFonts(BOOK_FONTS);
  const frame = useCurrentFrame();
  const t = frame / BFPS;
  const {s1, s2, s3, s4, s5} = BTL;
  const spr = (start: number, cfg = {}) => sp(frame, start, cfg, BFPS);

  // scene 1: alerts stack up, the hook line lands under them
  const hookOut = prog(t, s1.exit, s1.exit + 0.45, easeIn);
  const label = 1 - prog(t, s2.cardsExit, s2.cardsExit + 0.35, easeIn);

  // scene 2: the shield draws on, blocks every alert, then rises
  const draw = prog(t, s2.shield, s2.shield + 0.9, easeInOut);
  const fill = prog(t, s2.shield + 0.5, s2.shield + 1.2, easeOut);
  const lock = spr(s2.shield + 0.7, {damping: 10, stiffness: 210, mass: 0.7});
  const rise = prog(t, s2.rise, s2.rise + 0.75, easeInOut);
  const pulses = s2.blocks.reduce((a, b) => a + Math.max(0, 1 - Math.abs(t - b - 0.08) / 0.18), 0);
  const itemsOut = prog(t, s2.exit, s2.exit + 0.4, easeIn);

  // scene 3: the shield swells to fill the frame and opens onto the cover
  const grow = prog(t, s3.grow, s3.hit, easeIn);
  const flash = t < s3.hit ? grow ** 3 * 0.35 : 1 - prog(t, s3.hit, s3.hit + 0.5, easeOut);
  const shieldGone = t >= s3.hit;
  const shieldSize = 280 * (1 + 9 * grow * grow);
  const shieldCy = lerp(lerp(1310, 700, rise), 960, grow) + 6 * Math.sin(t * 2.1) * (1 - grow);

  const reveal = spr(s3.hit, {damping: 17, stiffness: 120, mass: 1});
  const move = prog(t, s4.move, s4.move + 0.8, easeInOut);
  const cw = lerp(COVER_HERO.w, COVER_END.w, move);
  const ccy = lerp(COVER_HERO.cy, COVER_END.cy, move);
  const sweep = prog(t, s3.sweep, s3.sweep + 1.1, easeInOut);
  const sweep2 = prog(t, s5.pill + 0.4, s5.pill + 1.5, easeInOut);
  const heroLabel = prog(t, s3.label, s3.label + 0.6, easeOut) * (1 - prog(t, s4.move, s4.move + 0.3, easeIn));

  const glow = shieldGone ? 0.55 + 0.45 * flash : Math.max(fill * 0.5, grow);
  const glowY = shieldGone ? (ccy / 1920) * 100 : (shieldCy / 1920) * 100;

  // scene 4 and end card
  const sysOut = prog(t, s4.exit, s4.exit + 0.4, easeIn);
  const pill = spr(s5.pill, {damping: 10, stiffness: 210, mass: 0.7});
  const brand = prog(t, s5.brand, s5.brand + 0.8, easeOut);
  const bug = 0.6 * (1 - prog(t, s5.brand - 0.4, s5.brand, easeIn));

  return (
    <AbsoluteFill style={{background: B.bg, overflow: 'hidden'}}>
      <BookBackground t={t} glow={glow} glowY={glowY} />

      {/* scene 1–2: alerts */}
      <Centered
        top={300}
        style={{
          fontFamily: BF.mono,
          fontSize: 26,
          letterSpacing: '0.24em',
          color: B.dim,
          opacity: label,
        }}
      >
        <span style={{color: B.threat}}>●</span>&nbsp; 3 NEW MESSAGES
      </Centered>
      {ALERTS.map((a, i) => (
        <Alert
          key={a.app}
          {...a}
          k={spr(s1.cards[i], {damping: 13, stiffness: 150, mass: 0.8})}
          blocked={prog(t, s2.blocks[i], s2.blocks[i] + 0.3, easeOut)}
          stamp={spr(s2.blocks[i], {damping: 9, stiffness: 230, mass: 0.7})}
          out={prog(t, s2.cardsExit + i * 0.06, s2.cardsExit + i * 0.06 + 0.4, easeIn)}
          style={{left: 100, top: ALERT_TOP[i]}}
        />
      ))}

      <Centered top={1170}>
        <div style={display(118)}>
          <Mask k={prog(t, s1.line1, s1.line1 + 0.8, easeOut)} out={hookOut}>
            You are already
          </Mask>
        </div>
        <div style={display(118)}>
          <Mask k={prog(t, s1.line2, s1.line2 + 0.8, easeOut)} out={hookOut}>
            in a <span style={{color: B.gold}}>war.</span>
          </Mask>
        </div>
      </Centered>

      {/* scene 2: what the book protects */}
      <Centered top={1000}>
        {ITEMS.map((w, i) => (
          <div key={w} style={{...display(104), lineHeight: 1.12}}>
            <Mask k={prog(t, s2.items[i], s2.items[i] + 0.8, easeOut)} out={itemsOut}>
              <span style={{color: B.muted}}>Your </span>
              {w}
            </Mask>
          </div>
        ))}
      </Centered>

      {!shieldGone && t >= s2.shield ? (
        <div
          style={{
            position: 'absolute',
            left: BW / 2 - shieldSize / 2,
            top: shieldCy - shieldSize * 0.6,
            transform: `scale(${1 + 0.06 * pulses})`,
          }}
        >
          <Shield size={shieldSize} draw={draw} fill={fill} lock={lock} glow={clamp01(fill * 0.6 + pulses)} />
        </div>
      ) : null}

      {/* scene 3–5: the book */}
      {shieldGone ? (
        <div
          style={{
            position: 'absolute',
            left: COVER_HERO.cx - cw / 2,
            top: ccy - (cw * COVER_RATIO) / 2,
            width: cw,
            height: cw * COVER_RATIO,
            opacity: clamp01(reveal * 2),
            transform: `perspective(2400px) translateY(${(1 - reveal) * 90}px) scale(${
              0.84 + 0.16 * reveal
            }) rotateY(${(1 - reveal) * -14 + 2.2 * Math.sin(t * 0.9)}deg)`,
            boxShadow: `0 50px 120px rgba(0,0,0,0.65), 0 0 ${60 + 80 * flash}px rgba(${B.blueGlow},0.45)`,
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <Img src={staticFile('book/cover.jpg')} style={{width: '100%', height: '100%', display: 'block'}} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.25) 2.4%, rgba(255,255,255,0.06) 4%, rgba(0,0,0,0) 8%)',
            }}
          />
          {[sweep, sweep2].map((s, i) =>
            s > 0 && s < 1 ? (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '-20%',
                  bottom: '-20%',
                  width: '45%',
                  left: `${lerp(-60, 120, s)}%`,
                  transform: 'rotate(14deg)',
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)',
                  mixBlendMode: 'screen',
                }}
              />
            ) : null,
          )}
        </div>
      ) : null}

      <Centered
        top={415}
        style={{
          fontFamily: BF.mono,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: '0.3em',
          color: B.gold,
          opacity: heroLabel,
          transform: `translateY(${(1 - heroLabel) * 16}px)`,
        }}
      >
        NEW BOOK
      </Centered>

      <Centered top={1048}>
        <div style={display(100, B.gold)}>
          <Mask k={prog(t, s4.line1, s4.line1 + 0.8, easeOut)} out={sysOut}>
            The SHIELD System
          </Mask>
        </div>
        <div style={{fontFamily: BF.sans, fontSize: 46, color: B.dim, marginTop: 18}}>
          <Mask k={prog(t, s4.line2, s4.line2 + 0.8, easeOut)} out={sysOut}>
            for personal cybersecurity
          </Mask>
        </div>
      </Centered>

      <Centered top={1048}>
        <div style={display(120)}>
          <Mask k={prog(t, s5.headline, s5.headline + 0.8, easeOut)}>
            Available <span style={{color: B.gold}}>now</span>
          </Mask>
        </div>
      </Centered>
      <Centered top={1222}>
        <span
          style={{
            display: 'inline-block',
            padding: '20px 44px',
            borderRadius: 999,
            background: B.gold,
            color: B.bg,
            fontFamily: BF.sans,
            fontWeight: 650,
            fontSize: 42,
            opacity: clamp01(pill * 3),
            transform: `scale(${pill})`,
          }}
        >
          Kindle &amp; Paperback on Amazon
        </span>
      </Centered>
      <Centered
        top={1372}
        style={{
          fontFamily: BF.mono,
          fontSize: 26,
          letterSpacing: '0.24em',
          color: B.dim,
          opacity: prog(t, s5.author, s5.author + 0.6, easeOut),
        }}
      >
        BY GODFREY CHINOMONA
      </Centered>

      {/* Acextic: a quiet corner mark all the way through, handed to the end card */}
      <Img
        src={staticFile(LOGO.src)}
        style={{position: 'absolute', right: 70, top: 200, height: 36, width: 36 * LOGO.ratio, opacity: bug}}
      />
      <Centered top={1446} style={{opacity: brand}}>
        <div
          style={{
            width: 96 * brand,
            height: 2,
            margin: '0 auto',
            borderRadius: 1,
            background: B.line,
          }}
        />
      </Centered>
      <Centered top={1478} style={{opacity: brand, transform: `translateY(${(1 - brand) * 20}px)`}}>
        <Img src={staticFile(LOGO.src)} style={{height: 56, width: 56 * LOGO.ratio, display: 'inline-block'}} />
      </Centered>

      <AbsoluteFill style={{background: B.flash, opacity: flash * 0.85, pointerEvents: 'none'}} />
      <Grain frame={frame} opacity={0.08} />
    </AbsoluteFill>
  );
};
