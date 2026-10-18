import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';
import {clamp01, easeInOut, easeOut, lerp, prog, sp} from '../lib';
import {Shield} from '../book/parts';
import {Bubble, CheckIcon, display, Gold, Lines, LockIcon, Person, Phone, rise, WarnIcon} from './ui';
import {ASSETS, CFPS, CTL, K, KF, shot} from './theme';

export type SceneProps = {t: number; frame: number};

const spr = (frame: number, at: number, cfg = {}) => sp(frame, at, cfg, CFPS);
const POP = {damping: 11, stiffness: 200, mass: 0.7};

// Text column on the right of every story shot.
const TX = 1030;

/** 01: the 19 s launch clip, portrait inside 16:9 over a blurred copy. */
export const S01: React.FC<SceneProps> = ({t}) => {
  const p = CTL.s01;
  const clipW = (1080 * 1080) / 1920;
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(ASSETS.introBg)} muted style={{position: 'absolute', width: 1920, height: 1080}} />
      <OffthreadVideo
        src={staticFile(ASSETS.intro)}
        muted
        style={{
          position: 'absolute',
          left: (1920 - clipW) / 2,
          top: 0,
          width: clipW,
          height: 1080,
          boxShadow: '0 0 80px rgba(0,0,0,0.6)',
        }}
      />
      {['Bank alert', 'Parcel service', 'Unknown number'].map((l, i) => {
        const k = prog(t, p.labels[i], p.labels[i] + 0.7, easeOut);
        return (
          <div
            key={l}
            style={{
              position: 'absolute',
              right: 1920 / 2 + clipW / 2 + 70,
              top: 300 + i * 120,
              textAlign: 'right',
              ...display(58),
              ...rise(k, 24),
            }}
          >
            {l} <span style={{color: K.threat}}>●</span>
          </div>
        );
      })}
      <Lines
        t={t}
        at={[p.title, p.title + 0.4]}
        lines={['3 messages.', <Gold key="g">3 possible traps.</Gold>]}
        size={66}
        style={{left: 1920 / 2 + clipW / 2 + 70, top: 380}}
      />
    </AbsoluteFill>
  );
};

/** 02: a front door locks, then the same spot becomes a phone that's wide open. */
export const S02: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s02;
  const doorIn = prog(t, p.door, p.door + 1.0, easeOut);
  const keyIn = prog(t, p.door + 0.6, p.keyTurn, easeInOut);
  const turn = prog(t, p.keyTurn, p.keyTurn + 0.6, easeInOut);
  const bolt = spr(frame, p.bolt, {damping: 18, stiffness: 260, mass: 0.6});
  const match = prog(t, p.match, p.match + 1.4, easeInOut);
  const unlock = prog(t, p.phoneUnlock, p.phoneUnlock + 0.8, easeInOut);
  const cx = 560;
  const cy = 470;
  return (
    <AbsoluteFill>
      <div style={{opacity: (1 - match) * clamp01(doorIn * 1.5), transform: `scale(${lerp(1, 0.86, match)})`}}>
        <svg
          width={420}
          height={680}
          viewBox="0 0 420 680"
          style={{position: 'absolute', left: cx - 210, top: cy - 340 + (1 - doorIn) * 40}}
        >
          <rect x={10} y={10} width={400} height={660} rx={10} fill="none" stroke={K.gold} strokeWidth={8} />
          <rect x={34} y={34} width={352} height={636} rx={6} fill="#1A2B57" />
          <rect x={70} y={74} width={280} height={230} rx={10} fill="none" stroke={K.line} strokeWidth={5} />
          <rect x={70} y={344} width={280} height={270} rx={10} fill="none" stroke={K.line} strokeWidth={5} />
          <circle cx={326} cy={350} r={20} fill={K.gold} />
          <rect x={318} y={384} width={16} height={34} rx={8} fill={K.ink} />
          <rect x={386 - 30 * bolt} y={392} width={54} height={18} rx={4} fill={K.gold} opacity={0.9} />
        </svg>
        <svg
          width={200}
          height={70}
          viewBox="0 0 200 70"
          style={{
            position: 'absolute',
            left: cx - 210 + 326 - 8 + lerp(260, 0, keyIn),
            top: cy - 340 + 401 - 35,
            opacity: clamp01(keyIn * 2) * (1 - prog(t, p.bolt + 0.8, p.bolt + 1.3)),
            transform: `rotate(${turn * 90}deg)`,
            transformOrigin: '8px 35px',
          }}
        >
          <rect x={0} y={29} width={120} height={12} rx={6} fill={K.goldHi} />
          <rect x={40} y={41} width={12} height={16} rx={3} fill={K.goldHi} />
          <rect x={70} y={41} width={12} height={22} rx={3} fill={K.goldHi} />
          <circle cx={150} cy={35} r={32} fill="none" stroke={K.goldHi} strokeWidth={12} />
        </svg>
        <div style={{position: 'absolute', left: cx - 40, top: 70, ...rise(doorIn)}}>
          <LockIcon size={80} open={1 - bolt} />
        </div>
      </div>

      <Phone
        x={cx}
        y={cy}
        w={380}
        h={760}
        style={{opacity: match, transform: `scale(${lerp(1.12, 1, match)})`}}
      >
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'grid', placeItems: 'center'}}>
          <LockIcon size={110} open={unlock} color={K.white} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 330,
            textAlign: 'center',
            fontFamily: KF.sans,
            fontWeight: 600,
            fontSize: 30,
            color: K.white,
            opacity: 1 - unlock,
          }}
        >
          Swipe up to unlock
        </div>
        <div
          style={{
            position: 'absolute',
            left: 34,
            right: 34,
            top: 330,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 22,
          }}
        >
          {Array.from({length: 16}, (_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                borderRadius: 18,
                background: [K.blue, K.gold, '#5E7CC9', '#2C4A8C'][i % 4],
                opacity: clamp01(unlock * 3 - i * 0.12) * 0.85,
              }}
            />
          ))}
        </div>
      </Phone>

      <Lines
        t={t}
        at={[p.title1]}
        lines={['You lock your doors.']}
        out={prog(t, p.title2 - 0.6, p.title2 - 0.1)}
        style={{left: TX, top: 400}}
      />
      <Lines
        t={t}
        at={[p.title2, p.title2 + 0.3, p.title2 + 0.6]}
        lines={['But have you', 'locked your', <Gold key="g">digital life?</Gold>]}
        size={96}
        style={{left: TX, top: 300}}
      />
    </AbsoluteFill>
  );
};

/** 03: a fictional bank text with a lookalike link; the finger hesitates. */
export const S03: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s03;
  const phone = prog(t, p.phone, p.phone + 1, easeOut);
  const sms = spr(frame, p.sms, {damping: 15, stiffness: 140});
  const link = prog(t, p.link, p.link + 0.6, easeOut);
  const hover = prog(t, p.hover, p.hesitate, easeInOut);
  const back = prog(t, p.warn, p.warn + 0.8, easeInOut);
  const wob = t > p.hesitate && t < p.warn ? Math.sin((t - p.hesitate) * 9) * 6 : 0;
  const warn = spr(frame, p.warn, POP);
  const cx = 560;
  return (
    <AbsoluteFill>
      <Phone x={cx} y={470} w={400} h={800} style={rise(phone)}>
        <div
          style={{
            position: 'absolute',
            top: 70,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: KF.mono,
            fontSize: 15,
            letterSpacing: '0.2em',
            color: K.muted,
          }}
        >
          FICTIONAL EXAMPLE
        </div>
        <Bubble from="Your Bank" k={sms} tone="threat" style={{top: 120}}>
          We detected suspicious activity on your account. Confirm your details now or it will be suspended:{' '}
          <span
            style={{
              color: link > 0 ? K.threat : K.white,
              textDecoration: 'underline',
              textDecorationThickness: 3,
              background: `rgba(255,84,104,${0.18 * link})`,
              borderRadius: 4,
            }}
          >
            bank-secure-verify.example/login
          </span>
        </Bubble>
        <div style={{position: 'absolute', left: 280, top: 370}}>
          <WarnIcon size={70} k={warn} />
        </div>
      </Phone>
      <div
        style={{
          position: 'absolute',
          left: lerp(cx + 330, cx + 30, hover) + back * 240,
          top: lerp(900, 470, hover) + wob + back * 300,
          width: 74,
          height: 74,
          borderRadius: 37,
          background: 'rgba(246,247,250,0.28)',
          border: `3px solid ${K.white}`,
          opacity: clamp01(hover * 3) * (1 - back),
        }}
      />
      <Lines
        t={t}
        at={[p.title1, p.title1 + 0.35]}
        lines={['One click can put', 'your money at risk.']}
        out={prog(t, p.title2 - 0.6, p.title2 - 0.1)}
        style={{left: TX, top: 380}}
      />
      <Lines
        t={t}
        at={[p.title2, p.title2 + 0.35]}
        lines={['Stop.', <Gold key="g">Verify.</Gold>]}
        size={150}
        style={{left: TX, top: 270}}
      />
    </AbsoluteFill>
  );
};

/** 04: a grandparent's phone rings, a parent's phone gets a text "from" their child. */
export const S04: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s04;
  const s = shot('s04');
  const zoom = lerp(1, 1.06, prog(t, s.start, s.end, (x) => x));
  const call = prog(t, p.call, p.call + 1, easeOut);
  const text = spr(frame, p.text, {damping: 16, stiffness: 140});
  const ring = (t * 1.2) % 1;
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '30% 45%'}}>
      <Phone x={330} y={470} w={340} h={700} style={rise(call)}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'grid', placeItems: 'center'}}>
          <div style={{position: 'relative', width: 130, height: 130}}>
            {t > p.call + 0.6 && t < p.text + 2 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: -60 * ring,
                  borderRadius: '50%',
                  border: `3px solid ${K.gold}`,
                  opacity: 1 - ring,
                }}
              />
            ) : null}
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: 65,
                background: K.panelHi,
                display: 'grid',
                placeItems: 'center',
                fontFamily: KF.display,
                fontSize: 70,
                color: K.dim,
              }}
            >
              ?
            </div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center'}}>
          <div style={{fontFamily: KF.sans, fontWeight: 600, fontSize: 30, color: K.white}}>Unknown number</div>
          <div style={{fontFamily: KF.sans, fontSize: 22, color: K.muted, marginTop: 8}}>incoming call…</div>
          <div
            style={{
              fontFamily: KF.sans,
              fontStyle: 'italic',
              fontSize: 24,
              color: K.gold,
              marginTop: 40,
              opacity: prog(t, p.call + 2, p.call + 2.8),
            }}
          >
            "Grandma, it's me…"
          </div>
        </div>
      </Phone>
      <Phone x={760} y={500} w={340} h={700} style={rise(clamp01(text * 1.2))}>
        <div
          style={{
            position: 'absolute',
            top: 70,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: KF.mono,
            fontSize: 14,
            letterSpacing: '0.2em',
            color: K.muted,
          }}
        >
          FICTIONAL EXAMPLE
        </div>
        <Bubble from="New number" k={text} tone="threat" style={{top: 120}}>
          Mum, it's me. I lost my phone and I'm in trouble. Please send money today, I'll explain later.
        </Bubble>
        <Bubble from="New number" k={spr(frame, p.text + 1.6, {damping: 16, stiffness: 140})} style={{top: 400}}>
          Please don't tell anyone.
        </Bubble>
      </Phone>
      <Lines
        t={t}
        at={[p.title, p.title + 0.35]}
        lines={['Criminals exploit', <>trust and <Gold key="g">love.</Gold></>]}
        size={92}
        style={{left: TX + 40, top: 380}}
      />
    </AbsoluteFill>
  );
};

const Tablet: React.FC<{k: number; children?: React.ReactNode}> = ({k, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 210,
      top: 150,
      width: 700,
      height: 470,
      borderRadius: 40,
      background: '#16213F',
      padding: 18,
      boxSizing: 'border-box',
      boxShadow: '0 40px 100px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(170,200,255,0.18)',
      ...rise(k),
    }}
  >
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 26,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #13244D 0%, #0A1430 100%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 26,
        padding: 40,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  </div>
);

/** 05: parent and child at a tablet; a shield and three habits. */
export const S05: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s05;
  const tab = prog(t, p.tablet, p.tablet + 1, easeOut);
  const shield = spr(frame, p.shield, {damping: 13, stiffness: 160});
  const habits = ['Recognize harmful messages', 'Protect their privacy', 'Ask for help'];
  return (
    <AbsoluteFill>
      <Tablet k={tab}>
        {Array.from({length: 10}, (_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: '1',
              borderRadius: 22,
              background: ['#5E7CC9', K.gold, K.blue, '#7FA7E8', '#2C4A8C'][i % 5],
              opacity: 0.8 * clamp01(tab * 2 - i * 0.08),
            }}
          />
        ))}
      </Tablet>
      <div
        style={{
          position: 'absolute',
          left: 790,
          top: 90,
          opacity: clamp01(shield * 2),
          transform: `scale(${0.5 + 0.5 * shield})`,
        }}
      >
        <Shield size={150} draw={clamp01(shield * 1.2)} fill={shield} lock={shield} glow={0.6} />
      </div>
      <div style={{position: 'absolute', left: 330, top: 520, display: 'flex', alignItems: 'flex-end', gap: 30, ...rise(tab)}}>
        <Person h={360} color="#24386B" />
        <Person h={250} color="#2E4A85" />
      </div>
      <Lines
        t={t}
        at={[p.title, p.title + 0.35]}
        lines={['Who is protecting', <>our <Gold key="g">children</Gold> online?</>]}
        size={80}
        style={{left: TX, top: 240}}
      />
      {habits.map((h, i) => {
        const k = prog(t, p.checks[i], p.checks[i] + 0.8, easeOut);
        return (
          <div
            key={h}
            style={{
              position: 'absolute',
              left: TX,
              top: 500 + i * 100,
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              ...rise(k, 20),
            }}
          >
            <CheckIcon size={58} k={k} />
            <span style={{fontFamily: KF.sans, fontWeight: 600, fontSize: 44, color: K.white}}>{h}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const TileIcon: React.FC<{i: number}> = ({i}) => {
  const c = K.white;
  if (i === 0)
    return (
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 6}}>
        <Person h={110} color={c} />
        <Person h={80} color={c} />
        <Person h={100} color={c} />
      </div>
    );
  const paths = [
    '',
    'M10 40 L50 15 L90 40 Z M18 46 H82 V52 H18 Z M24 56 H34 V80 H24 Z M45 56 H55 V80 H45 Z M66 56 H76 V80 H66 Z M12 84 H88 V92 H12 Z',
    'M50 30 m-16 0 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0 M18 90 C18 66 32 56 50 56 C68 56 82 66 82 90 Z',
    'M10 18 H70 A8 8 0 0 1 78 26 V56 A8 8 0 0 1 70 64 H34 L20 78 V64 H18 A8 8 0 0 1 10 56 V26 A8 8 0 0 1 18 18 Z M40 70 H82 A8 8 0 0 1 90 78 V88 L80 82 H48 Z',
    'M24 8 H62 L80 26 V92 H24 Z M34 40 H70 V46 H34 Z M34 54 H70 V60 H34 Z M34 68 H58 V74 H34 Z',
  ];
  return (
    <svg width={110} height={110} viewBox="0 0 100 100">
      <path d={paths[i]} fill={c} fillRule="evenodd" />
    </svg>
  );
};

/** 06: what lives on a phone (family, money, contacts, messages, documents) tied to one line. */
export const S06: React.FC<SceneProps> = ({t}) => {
  const p = CTL.s06;
  const labels = ['Family', 'Savings', 'Contacts', 'Messages', 'Documents'];
  const people = prog(t, p.people, p.people + 1.2, easeInOut);
  const link = prog(t, p.link, p.link + 1.4, easeInOut);
  const xs = labels.map((_, i) => 260 + i * 350);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={xs[0]} y1={330} x2={xs[0] + (xs[4] - xs[0]) * link} y2={330} stroke={K.gold} strokeWidth={3} opacity={0.6} />
      </svg>
      {labels.map((l, i) => {
        const k = prog(t, p.tiles[i], p.tiles[i] + 0.9, easeOut);
        const hero = i === 0 ? people : 0;
        return (
          <div
            key={l}
            style={{
              position: 'absolute',
              left: xs[i] - 120,
              top: 210,
              width: 240,
              height: 240,
              borderRadius: 36,
              background: K.panelHi,
              border: `2px solid ${hero > 0 ? K.gold : K.line}`,
              boxShadow: `0 0 ${60 * hero}px rgba(${K.goldGlow},0.5)`,
              display: 'grid',
              placeItems: 'center',
              ...rise(k),
              opacity: clamp01(k * 1.4) * (1 - 0.45 * people * (i === 0 ? 0 : 1)),
              transform: `translateY(${(1 - k) * 40}px) scale(${1 + 0.08 * hero})`,
            }}
          >
            <TileIcon i={i} />
            <div
              style={{
                position: 'absolute',
                bottom: -56,
                fontFamily: KF.mono,
                fontSize: 22,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: K.dim,
              }}
            >
              {l}
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center', ...display(88)}}>
        {['Your identity.', 'Your family.', 'Your future.'].map((w, i) => {
          const k = prog(t, p.words[i], p.words[i] + 0.8, easeOut);
          return (
            <span key={w} style={{display: 'inline-block', margin: '0 22px', color: i === 2 ? K.gold : K.white, ...rise(k, 30)}}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** 07: three generations, each with a phone, each gets a check. */
export const S07: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s07;
  const sizes = [380, 300, 230];
  const xs = [200, 460, 690];
  return (
    <AbsoluteFill>
      {sizes.map((h, i) => {
        const k = prog(t, p.people[i], p.people[i] + 1, easeOut);
        const c = spr(frame, p.checks[i], POP);
        return (
          <div key={i} style={{position: 'absolute', left: xs[i], top: 820 - h, ...rise(k)}}>
            <Person h={h} color={['#2C4A8C', '#24386B', '#3A5AA0'][i]} />
            <div
              style={{
                position: 'absolute',
                left: h * 0.31 - 26,
                top: h * 0.55,
                width: 52,
                height: 88,
                borderRadius: 12,
                background: K.ink,
                border: `3px solid ${K.gold}`,
                boxShadow: `0 0 ${30 * c}px rgba(${K.goldGlow},0.6)`,
              }}
            />
            <div style={{position: 'absolute', left: h * 0.31 - 35, top: -90, opacity: clamp01(c * 2), transform: `scale(${c})`}}>
              <CheckIcon size={70} k={c} />
            </div>
          </div>
        );
      })}
      <Lines
        t={t}
        at={[p.title, p.title + 0.35]}
        lines={['You do not need to be', <>an <Gold key="g">IT expert.</Gold></>]}
        size={92}
        style={{left: TX, top: 360}}
      />
    </AbsoluteFill>
  );
};
