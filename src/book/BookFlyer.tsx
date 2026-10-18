import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {useFonts} from '../components/useFonts';
import {B, BF, BOOK_FONTS} from './theme';

// The end card of BookLaunch (book/poster.png, from `remotion still BookLaunch --frame=1134`)
// with the Amazon QR added underneath, for sharing as a still.
export const BookFlyer: React.FC = () => {
  useFonts(BOOK_FONTS);
  return (
    <AbsoluteFill style={{background: B.bg}}>
      <Img src={staticFile('book/poster.png')} style={{width: 1080, height: 1920}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1630,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <div style={{background: '#fff', borderRadius: 22, padding: 12}}>
          <Img src={staticFile('church/amazon-qr.jpg')} style={{width: 216, height: 216, display: 'block'}} />
        </div>
        <div>
          <div style={{fontFamily: BF.display, fontWeight: 700, fontSize: 64, lineHeight: 1.05, color: B.white, textTransform: 'uppercase'}}>
            Scan to buy
          </div>
          <div style={{fontFamily: BF.display, fontWeight: 700, fontSize: 64, lineHeight: 1.05, color: B.gold, textTransform: 'uppercase'}}>
            on Amazon
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
