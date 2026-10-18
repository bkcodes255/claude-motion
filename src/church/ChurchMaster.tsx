import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeIn, easeInOut, prog} from '../lib';
import {Grain} from '../components/primitives';
import {useFonts} from '../components/useFonts';
import {S01, S02, S03, S04, S05, S06, S07, SceneProps} from './scenes-story';
import {DefenseRail, S08, S09, S10, S11, S12} from './scenes-defense';
import {S13, S14, S15} from './scenes-book';
import {Captions, Stage} from './ui';
import {ASSETS, CFPS, CHURCH_FONTS, CTL, shot, ShotId} from './theme';

const SCENES: Record<ShotId, React.FC<SceneProps>> = {
  s01: S01, s02: S02, s03: S03, s04: S04, s05: S05, s06: S06, s07: S07, s08: S08,
  s09: S09, s10: S10, s11: S11, s12: S12, s13: S13, s14: S14, s15: S15,
};

export const ChurchMaster: React.FC = () => {
  useFonts(CHURCH_FONTS);
  const frame = useCurrentFrame();
  const t = frame / CFPS;
  const xf = CTL.xfade;

  // serious (blue) → personal → hopeful (gold) → book
  const warm = prog(t, shot('s06').start, shot('s07').end, easeInOut) * (1 - 0.4 * prog(t, shot('s08').start, shot('s08').start + 2)) +
    0.4 * prog(t, shot('s13').start - 1, shot('s13').start + 2, easeInOut);
  const glow = 0.5 + 0.3 * Math.sin(t * 0.4);
  const bug = 0.5 * (1 - prog(t, shot('s15').start - 0.5, shot('s15').start + 0.5, easeIn));

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Stage t={t} glow={glow} warm={Math.min(1, warm)} gx={35} />
      {CTL.shots.map((s) => {
        const Scene = SCENES[s.id as ShotId];
        const a = Math.max(0, s.start - xf / 2);
        const b = Math.min(CTL.duration, s.end + xf / 2);
        const fadeIn = s.start === 0 ? 1 : prog(t, s.start - xf / 2, s.start + xf / 2);
        const fadeOut = s.end >= CTL.duration ? 1 : 1 - prog(t, s.end - xf / 2, s.end + xf / 2);
        return (
          <Sequence key={s.id} from={Math.round(a * CFPS)} durationInFrames={Math.round((b - a) * CFPS)}>
            <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>
              <Scene t={t} frame={frame} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <DefenseRail t={t} />
      <Img
        src={staticFile(ASSETS.logo)}
        style={{position: 'absolute', right: 60, top: 52, height: 34, width: 34 * ASSETS.logoRatio, opacity: bug}}
      />
      <Captions t={t} />
      <Grain frame={frame} opacity={0.06} />
    </AbsoluteFill>
  );
};
