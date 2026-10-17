import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {FONT} from './fonts';
import {T} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);

// Gold from the original title: pale butter highlight into deeper marigold.
const GOLD = 'linear-gradient(180deg, #fff3b0 0%, #ffe07a 45%, #f3b938 100%)';

const fadeUp = (frame: number, start: number, dist = 16, dur = 20): React.CSSProperties => {
  const p = interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: OUT});
  return {opacity: p, transform: `translateY(${(1 - p) * dist}px)`};
};

const GoldText: React.FC<{children: string; size: number; shineAt: number; spacing?: number}> = ({children, size, shineAt, spacing = 1}) => {
  const frame = useCurrentFrame();
  // A white-gold highlight sweeps left to right once, then rests off-text.
  const shine = interpolate(frame, [shineAt, shineAt + 26], [130, -30], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <div style={{filter: 'drop-shadow(0 3px 0 rgba(120,0,50,0.55)) drop-shadow(0 6px 14px rgba(80,0,40,0.35))'}}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: size,
          letterSpacing: spacing,
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          color: 'transparent',
          backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,248,0.95) 50%, rgba(255,255,255,0) 60%), ${GOLD}`,
          backgroundSize: '300% 100%, 100% 100%',
          backgroundPosition: `${shine}% 0, 0 0`,
          backgroundRepeat: 'no-repeat',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const body: React.CSSProperties = {fontFamily: FONT, color: '#ffffff', textAlign: 'center', textShadow: '0 2px 8px rgba(90,0,45,0.45)'};

const Center: React.FC<{y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({y, children, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);

export const Typography: React.FC = () => {
  const frame = useCurrentFrame();
  const titleRise = interpolate(frame, [T.titleIn, T.titleIn + 22], [110, 0], {...clamp, easing: OUT});
  const divider = interpolate(frame, [T.divider, T.divider + 16], [0, 1], {...clamp, easing: OUT});
  const jaiPulse = interpolate(frame, [T.jaiPulse - 6, T.jaiPulse + 4, T.jaiPulse + 30], [0, 1, 0], clamp);

  return (
    <AbsoluteFill>
      {/* Title: masked rise, then a single metallic sweep */}
      <Center y={1108}>
        <div style={{overflow: 'hidden', padding: '6px 20px 14px'}}>
          <div style={{transform: `translateY(${titleRise}%)`}}>
            <GoldText size={90} shineAt={T.titleShine}>MATA KI CHOWKI</GoldText>
          </div>
        </div>
      </Center>

      <Center y={1240} style={fadeUp(frame, T.info)}>
        <div style={{...body, fontWeight: 500, fontSize: 33, lineHeight: 1.42}}>
          We cordially invite you and your family to join us
          <br />
          in seeking the divine blessings of Mata Rani.
        </div>
      </Center>

      <Center y={1376} style={fadeUp(frame, T.info + 8)}>
        <div style={{...body, fontWeight: 800, fontSize: 46, lineHeight: 1.3}}>
          Saturday, 17th October
          <br />
          7:30 PM onwards
        </div>
      </Center>

      <Center y={1526} style={fadeUp(frame, T.info + 16)}>
        <div style={{...body, fontWeight: 500, fontSize: 34, lineHeight: 1.42}}>
          Blk 157A, Rivervale Crescent,
          <br />
          #03-605, Sengkang 541157
        </div>
      </Center>

      {/* Divider draws outward from the centre diamond */}
      <Center y={1650}>
        <svg width={360} height={20} viewBox="0 0 360 20" style={{opacity: divider}}>
          <line x1={180 - 22} y1={10} x2={180 - 22 - 150 * divider} y2={10} stroke="#ffd98a" strokeWidth={2} />
          <line x1={180 + 22} y1={10} x2={180 + 22 + 150 * divider} y2={10} stroke="#ffd98a" strokeWidth={2} />
          <circle cx={180 - 15} cy={10} r={3.2} fill="none" stroke="#ffd98a" strokeWidth={1.6} />
          <circle cx={180 + 15} cy={10} r={3.2} fill="none" stroke="#ffd98a" strokeWidth={1.6} />
          <rect x={174} y={4} width={12} height={12} fill="#ffe07a" transform={`rotate(45 180 10) scale(1)`} style={{transformOrigin: '180px 10px', transform: `rotate(45deg) scale(${divider})`}} />
        </svg>
      </Center>

      <Center y={1694} style={fadeUp(frame, T.jai, 20, 24)}>
        <div style={{position: 'relative'}}>
          <div
            style={{
              position: 'absolute',
              inset: '-40px -80px',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(255,226,140,0.55), rgba(255,226,140,0))',
              opacity: jaiPulse,
              mixBlendMode: 'screen',
            }}
          />
          <GoldText size={68} spacing={3} shineAt={T.jaiPulse - 4}>JAI MATA DI</GoldText>
        </div>
      </Center>
    </AbsoluteFill>
  );
};
