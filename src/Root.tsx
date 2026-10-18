import React from 'react';
import {Composition, Still} from 'remotion';
import {ArticleCover} from './ArticleCover';
import {BookLaunch} from './book/BookLaunch';
import {ChurchMaster} from './church/ChurchMaster';
import {CFPS, CH, CTL, CW} from './church/theme';
import {BFPS, BH, BTL, BW} from './book/theme';
import {EffortVideo} from './EffortVideo';
import {FPS, H, TL, W} from './lib';

export const Root: React.FC = () => (
  <>
    <Composition
      id="EffortVideo"
      component={EffortVideo}
      durationInFrames={Math.round(TL.duration * FPS)}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="BookLaunch"
      component={BookLaunch}
      durationInFrames={Math.round(BTL.duration * BFPS)}
      fps={BFPS}
      width={BW}
      height={BH}
    />
    <Composition
      id="ChurchMaster"
      component={ChurchMaster}
      durationInFrames={Math.round(CTL.duration * CFPS)}
      fps={CFPS}
      width={CW}
      height={CH}
    />
    <Still id="ArticleCover" component={ArticleCover} width={2000} height={800} />
  </>
);
