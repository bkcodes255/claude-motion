import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeIn, easeInOut, easeOut, lerp, prog, sp} from '../lib';
import {DEFENSES} from './copy';
import {Badge, Bubble, CheckIcon, display, Lines, LockIcon, Phone, rise, WarnIcon} from './ui';
import {CFPS, CTL, K, KF} from './theme';
import type {SceneProps} from './scenes-story';

const spr = (frame: number, at: number, cfg = {}) => sp(frame, at, cfg, CFPS);
const POP = {damping: 11, stiffness: 200, mass: 0.7};
const TX = 1030;

/** Shared right column: number badge, then the habit in two lines. */
const Heading: React.FC<{n: number; t: number; frame: number; badge: number; title: number; out?: number}> = ({
  n,
  t,
  frame,
  badge,
  title,
  out = 0,
}) => {
  const words = DEFENSES[n - 1].split(' ');
  const cut = Math.ceil(words.length / 2);
  return (
    <div style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', left: TX, top: 230}}>
        <Badge n={n} k={spr(frame, badge, POP)} />
      </div>
      <Lines
        t={t}
        at={[title, title + 0.3]}
        lines={[words.slice(0, cut).join(' '), <span key="g" style={{color: K.gold}}>{words.slice(cut).join(' ')}</span>]}
        size={92}
        style={{left: TX, top: 420}}
      />
    </div>
  );
};

/** Five dots along the top: which habit we're on. Drawn across shots 08–12. */
export const DefenseRail: React.FC<{t: number}> = ({t}) => {
  const ids = ['s08', 's09', 's10', 's11', 's12'] as const;
  const a = CTL.shots.find((s) => s.id === 's08')!;
  const b = CTL.shots.find((s) => s.id === 's12')!;
  const vis = prog(t, a.start, a.start + 0.8, easeOut) * (1 - prog(t, b.end - 0.6, b.end, easeIn));
  if (vis <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 18,
        opacity: vis,
      }}
    >
      {ids.map((id, i) => {
        const on = prog(t, CTL[id].badge, CTL[id].badge + 0.4, easeOut);
        return (
          <div
            key={id}
            style={{
              width: 18 + 46 * on,
              height: 18,
              borderRadius: 9,
              background: on > 0 ? K.gold : K.line,
            }}
          >
            <span style={{display: 'none'}}>{i}</span>
          </div>
        );
      })}
    </div>
  );
};

const Finger: React.FC<{x: number; y: number; k: number; press?: number}> = ({x, y, k, press = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 37,
      top: y - 37,
      width: 74,
      height: 74,
      borderRadius: 37,
      background: `rgba(246,247,250,${0.28 + 0.3 * press})`,
      border: `3px solid ${K.white}`,
      opacity: k,
      transform: `scale(${1 - 0.15 * press})`,
    }}
  />
);

/** 08: the finger stops short of the link. */
export const S08: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s08;
  const sms = spr(frame, p.sms, {damping: 15, stiffness: 140});
  const approach = prog(t, p.finger, p.stop, easeInOut);
  const stop = spr(frame, p.stop, POP);
  const warn = spr(frame, p.warn, POP);
  return (
    <AbsoluteFill>
      <Phone x={560} y={490} w={400} h={800} style={rise(prog(t, p.sms - 0.8, p.sms + 0.2, easeOut))}>
        <Bubble from="Unknown sender" k={sms} tone="threat" style={{top: 130}}>
          Your parcel couldn't be delivered. Reschedule within 1 hour or it will be returned:{' '}
          <span style={{color: K.threat, textDecoration: 'underline', textDecorationThickness: 3}}>
            parcel-redelivery.example
          </span>
        </Bubble>
        <div style={{position: 'absolute', left: 290, top: 300}}>
          <WarnIcon size={64} k={warn} />
        </div>
      </Phone>
      <Finger x={lerp(900, 640, approach)} y={lerp(900, 470, approach)} k={clamp01(approach * 3)} />
      <div
        style={{
          position: 'absolute',
          left: 700,
          top: 420,
          display: 'flex',
          gap: 12,
          opacity: clamp01(stop * 2),
          transform: `scale(${stop})`,
        }}
      >
        <div style={{width: 18, height: 64, borderRadius: 6, background: K.gold}} />
        <div style={{width: 18, height: 64, borderRadius: 6, background: K.gold}} />
      </div>
      <Heading n={1} t={t} frame={frame} badge={p.badge} title={p.title} />
    </AbsoluteFill>
  );
};

/** 09: a password manager: masked, unique, strong. */
export const S09: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s09;
  const card = prog(t, p.badge, p.badge + 1, easeOut);
  const rows = ['Email', 'Bank', 'Shopping', 'Social media'];
  const meter = prog(t, p.meter, p.meter + 2, easeInOut);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 180,
          top: 170,
          width: 760,
          height: 620,
          borderRadius: 36,
          background: '#13244D',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(170,200,255,0.18)',
          padding: '40px 48px',
          boxSizing: 'border-box',
          ...rise(card),
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 34}}>
          <LockIcon size={40} open={0} />
          <span style={{fontFamily: KF.sans, fontWeight: 600, fontSize: 34, color: K.white}}>Password manager</span>
        </div>
        {rows.map((r, i) => {
          const k = prog(t, p.rows[i], p.rows[i] + 0.7, easeOut);
          const lock = spr(frame, p.locks + i * 0.25, POP);
          return (
            <div
              key={r}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '20px 0',
                borderTop: `1.5px solid ${K.line}`,
                ...rise(k, 16),
              }}
            >
              <div style={{width: 190, fontFamily: KF.sans, fontWeight: 600, fontSize: 30, color: K.white}}>{r}</div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: KF.mono, fontSize: 30, letterSpacing: '0.12em', color: K.dim}}>
                  {'•'.repeat(14 + (i % 3) * 2)}
                </div>
                <div style={{marginTop: 10, height: 8, borderRadius: 4, background: K.line, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${100 * clamp01(meter * 1.3 - i * 0.1)}%`, background: K.gold}} />
                </div>
              </div>
              <div style={{opacity: clamp01(lock * 2), transform: `scale(${0.6 + 0.4 * lock})`}}>
                <LockIcon size={34} open={1 - lock} />
              </div>
            </div>
          );
        })}
      </div>
      <Heading n={2} t={t} frame={frame} badge={p.badge} title={p.title} />
    </AbsoluteFill>
  );
};

/** 10: a generic "is this you?" approval as the second layer. */
export const S10: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s10;
  const phone = prog(t, p.signin - 0.6, p.signin + 0.4, easeOut);
  const prompt = spr(frame, p.prompt, {damping: 15, stiffness: 150});
  const tap = prog(t, p.approve - 0.9, p.approve, easeInOut);
  const press = Math.max(0, 1 - Math.abs(t - p.approve) / 0.15);
  const done = spr(frame, p.done, POP);
  return (
    <AbsoluteFill>
      <Phone x={560} y={490} w={400} h={800} style={rise(phone)}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 110}}>
          <div style={{fontFamily: KF.sans, fontSize: 22, color: K.muted}}>Sign in</div>
          <div
            style={{
              marginTop: 14,
              padding: '16px 20px',
              borderRadius: 14,
              background: K.panelHi,
              fontFamily: KF.mono,
              fontSize: 26,
              color: K.dim,
            }}
          >
            ••••••••••••
          </div>
          <div style={{marginTop: 26, fontFamily: KF.sans, fontSize: 22, color: K.muted}}>Second step</div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: 310,
            padding: 26,
            borderRadius: 26,
            background: '#1C3060',
            border: `2px solid ${K.gold}`,
            ...rise(prompt, 40),
          }}
        >
          <div style={{fontFamily: KF.sans, fontWeight: 600, fontSize: 30, color: K.white, lineHeight: 1.25}}>
            Is this you trying to sign in?
          </div>
          <div style={{fontFamily: KF.sans, fontSize: 21, color: K.muted, marginTop: 10}}>New device · just now</div>
          <div style={{display: 'flex', gap: 14, marginTop: 26}}>
            <div
              style={{
                flex: 1,
                padding: '14px 0',
                borderRadius: 14,
                textAlign: 'center',
                background: K.panel,
                fontFamily: KF.sans,
                fontWeight: 600,
                fontSize: 24,
                color: K.dim,
              }}
            >
              Deny
            </div>
            <div
              style={{
                flex: 1,
                padding: '14px 0',
                borderRadius: 14,
                textAlign: 'center',
                background: K.gold,
                fontFamily: KF.sans,
                fontWeight: 700,
                fontSize: 24,
                color: K.ink,
              }}
            >
              Approve
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 620,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 14,
            opacity: clamp01(done * 2),
          }}
        >
          <CheckIcon size={44} k={done} />
          <span style={{fontFamily: KF.sans, fontWeight: 600, fontSize: 24, color: K.gold}}>Verified by you</span>
        </div>
      </Phone>
      <Finger x={lerp(900, 662, tap)} y={lerp(950, 555, tap)} k={clamp01(tap * 3) * (1 - prog(t, p.done, p.done + 0.5))} press={press} />
      <Heading n={3} t={t} frame={frame} badge={p.badge} title={p.title} />
    </AbsoluteFill>
  );
};

const Progress: React.FC<{k: number; done: number; width: number; size?: number}> = ({k, done, width, size = 24}) => (
  <div style={{width}}>
    <div style={{fontFamily: KF.sans, fontWeight: 600, fontSize: size, color: done > 0.5 ? K.gold : K.white, marginBottom: 12}}>
      {done > 0.5 ? 'Up to date' : 'Installing security update…'}
    </div>
    <div style={{height: 12, borderRadius: 6, background: K.line, overflow: 'hidden'}}>
      <div style={{height: '100%', width: `${100 * k}%`, background: K.gold}} />
    </div>
  </div>
);

/** 11: a laptop and a phone installing updates side by side. */
export const S11: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s11;
  const dev = prog(t, p.devices, p.devices + 1, easeOut);
  const prog1 = prog(t, p.progress, p.done, (x) => 1 - Math.pow(1 - x, 1.6));
  const prog2 = prog(t, p.progress + 0.4, p.done, (x) => x);
  const done = spr(frame, p.done, POP);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 240, ...rise(dev)}}>
        <div
          style={{
            width: 640,
            height: 400,
            borderRadius: 24,
            background: '#16213F',
            padding: 16,
            boxSizing: 'border-box',
            boxShadow: 'inset 0 0 0 2px rgba(170,200,255,0.18)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 12,
              background: 'linear-gradient(180deg, #13244D 0%, #0A1430 100%)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div style={{display: 'grid', placeItems: 'center', gap: 26}}>
              <CheckIcon size={80} k={done} />
              <Progress k={prog1} done={done} width={440} size={28} />
            </div>
          </div>
        </div>
        <div style={{width: 740, height: 26, marginLeft: -50, borderRadius: '0 0 20px 20px', background: '#22305A'}} />
      </div>
      <Phone x={850} y={560} w={250} h={500} style={rise(prog(t, p.devices + 0.4, p.devices + 1.4, easeOut))}>
        <div style={{position: 'absolute', left: 22, right: 22, top: 150, display: 'grid', placeItems: 'center', gap: 22}}>
          <CheckIcon size={60} k={spr(frame, p.done + 0.3, POP)} />
          <Progress k={prog2} done={spr(frame, p.done + 0.3, POP)} width={180} size={18} />
        </div>
      </Phone>
      <Heading n={4} t={t} frame={frame} badge={p.badge} title={p.title} />
    </AbsoluteFill>
  );
};

/** 12: a money request is not answered in the thread; a known number is called instead. Then all five. */
export const S12: React.FC<SceneProps> = ({t, frame}) => {
  const p = CTL.s12;
  const req = spr(frame, p.request, {damping: 15, stiffness: 140});
  const cross = spr(frame, p.cross, POP);
  const dial = prog(t, p.dial, p.dial + 0.8, easeInOut);
  const ok = spr(frame, p.verified, POP);
  const all = prog(t, p.all - 0.5, p.all, easeIn);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - all}}>
        <Phone x={560} y={490} w={400} h={800} style={rise(prog(t, p.request - 0.8, p.request + 0.2, easeOut))}>
          <div style={{opacity: 1 - dial}}>
            <Bubble from="New number" k={req} tone="threat" style={{top: 130}}>
              Hi, it's me on a new number. I need money urgently. Please send it now to this account.
            </Bubble>
            <div
              style={{
                position: 'absolute',
                left: 40,
                right: 40,
                top: 400,
                padding: '12px 0',
                borderRadius: 12,
                border: `3px solid ${K.threat}`,
                textAlign: 'center',
                fontFamily: KF.mono,
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: '0.16em',
                color: K.threat,
                opacity: clamp01(cross * 2),
                transform: `scale(${cross}) rotate(${(1 - cross) * -8}deg)`,
              }}
            >
              DON'T REPLY HERE
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', opacity: dial}}>
            <div
              style={{
                width: 140,
                height: 140,
                margin: '0 auto',
                borderRadius: 70,
                background: K.gold,
                display: 'grid',
                placeItems: 'center',
                fontFamily: KF.display,
                fontWeight: 700,
                fontSize: 64,
                color: K.ink,
              }}
            >
              D
            </div>
            <div style={{fontFamily: KF.sans, fontWeight: 600, fontSize: 32, color: K.white, marginTop: 28}}>Daniel</div>
            <div style={{fontFamily: KF.sans, fontSize: 22, color: K.muted, marginTop: 8}}>Saved contact · calling…</div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 70, opacity: clamp01(ok * 2)}}>
              <CheckIcon size={50} k={ok} />
              <span style={{fontFamily: KF.sans, fontWeight: 600, fontSize: 24, color: K.gold}}>Checked with them directly</span>
            </div>
          </div>
        </Phone>
        <Heading n={5} t={t} frame={frame} badge={p.badge} title={p.title} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 160, display: 'flex', justifyContent: 'center'}}>
        <div>
          <div style={{...display(64, K.gold), marginBottom: 34, ...rise(prog(t, p.all, p.all + 0.8, easeOut))}}>
            Five habits that protect you
          </div>
          {DEFENSES.map((d, i) => {
            const k = prog(t, p.all + 0.3 + i * 0.25, p.all + 1.1 + i * 0.25, easeOut);
            return (
              <div key={d} style={{display: 'flex', alignItems: 'center', gap: 30, marginBottom: 22, ...rise(k, 20)}}>
                <Badge n={i + 1} k={k} size={74} />
                <span style={display(58)}>{d}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
