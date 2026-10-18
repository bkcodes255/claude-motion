import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';

const DEFAULT_FONTS = [
  '400 100px "Instrument Serif"',
  'italic 400 100px "Instrument Serif"',
  '400 20px "JetBrains Mono"',
  '600 20px "JetBrains Mono"',
  '400 20px "Inter Variable"',
];

export const useFonts = (fonts: string[] = DEFAULT_FONTS) => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(fonts.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle, fonts]);
};
