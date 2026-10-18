import timeline from './timeline.json';
import {F} from '../lib';

export const BTL = timeline;
export const BFPS = BTL.fps;
export const BW = 1080;
export const BH = 1920;

// Taken from the book cover: midnight navy, electric blue, gold title type.
export const B = {
  bg: '#060E24',
  navy: '#0C1A3E',
  panel: 'rgba(170,200,255,0.07)',
  line: 'rgba(170,200,255,0.14)',
  white: '#F4F6FB',
  dim: 'rgba(244,246,251,0.66)',
  muted: 'rgba(244,246,251,0.4)',
  blue: '#3E8BFF',
  blueGlow: '62,139,255',
  gold: '#F5B921',
  goldHi: '#FFD25A',
  threat: '#FF5468',
  flash: '#FFF6DD',
};

export const BF = {
  display: '"Oswald", Impact, sans-serif',
  sans: F.sans,
  mono: F.mono,
};

export const BOOK_FONTS = [
  '700 100px "Oswald"',
  '600 100px "Oswald"',
  '400 20px "JetBrains Mono"',
  '600 20px "JetBrains Mono"',
  '400 20px "Inter Variable"',
];
