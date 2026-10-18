import timeline from './timeline.json';
import {F} from '../lib';

export const CTL = timeline;
export const CFPS = CTL.fps;
export const CW = 1920;
export const CH = 1080;

// From the production plan (midnight navy, warm gold, soft white), with the cover's electric blue.
export const K = {
  bg: '#0D1935',
  deep: '#081127',
  panel: 'rgba(170,200,255,0.08)',
  panelHi: 'rgba(170,200,255,0.14)',
  line: 'rgba(170,200,255,0.18)',
  white: '#F6F7FA',
  dim: 'rgba(246,247,250,0.72)',
  muted: 'rgba(246,247,250,0.45)',
  gold: '#D9B65B',
  goldHi: '#F0D488',
  goldGlow: '217,182,91',
  blue: '#3E8BFF',
  blueGlow: '62,139,255',
  threat: '#FF5468',
  ink: '#081127',
};

export const KF = {
  display: '"Oswald", Impact, sans-serif',
  sans: F.sans,
  mono: F.mono,
};

export const ASSETS = {
  intro: 'church/intro.mp4',
  introBg: 'church/intro-bg.mp4',
  cover: 'book/cover.jpg',
  coverRatio: 2048 / 1366,
  logo: 'book/acextic-white.png',
  logoRatio: 1561 / 295,
  qr: 'church/amazon-qr.jpg',
  author: 'church/author.jpg' as string | null,
};

export const CHURCH_FONTS = [
  '700 100px "Oswald"',
  '600 100px "Oswald"',
  '400 20px "JetBrains Mono"',
  '600 20px "JetBrains Mono"',
  '400 20px "Inter Variable"',
  '600 20px "Inter Variable"',
];

export type ShotId = (typeof CTL.shots)[number]['id'];
export const shot = (id: ShotId) => CTL.shots.find((s) => s.id === id)!;
