import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEAD, T} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const RAYS =
  'repeating-conic-gradient(from 0deg, rgba(255,214,120,0.9) 0deg 2.2deg, rgba(255,214,120,0) 4deg 11deg, rgba(255,240,190,0.7) 12deg 13deg, rgba(255,214,120,0) 15deg 20deg)';

const useHalo = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {
    frame,
    burst: spring({frame: frame - T.halo, fps, config: {damping: 200, mass: 1.4}}),
    breathe: 0.85 + 0.15 * Math.sin((frame - T.halo) / 18),
    rot: (frame - T.halo) * 0.18,
  };
};

// Long rays sit behind the arch, so the light pours out around the shrine
// without striping Mata herself.
export const HaloRays: React.FC = () => {
  const {frame, burst, breathe, rot} = useHalo();
  const size = 1700;
  if (frame < T.halo - 4) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: HEAD.x - size / 2,
        top: HEAD.y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        mixBlendMode: 'screen',
        transform: `scale(${0.2 + 0.8 * burst}) rotate(${rot}deg)`,
        opacity: burst * 0.8 * breathe,
        background: RAYS,
        WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 10%, rgba(0,0,0,0.55) 32%, rgba(0,0,0,0) 60%)',
      }}
    />
  );
};

// The hero beat over the artwork: a flash, a warm aura and short rays around the halo ring.
export const Halo: React.FC = () => {
  const {frame, burst, breathe, rot} = useHalo();
  const flash = interpolate(frame, [T.halo - 4, T.halo + 3, T.halo + 26], [0, 0.55, 0], clamp);
  const size = 520;

  if (frame < T.halo - 4) return null;

  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      {/* rays */}
      <div
        style={{
          position: 'absolute',
          left: HEAD.x - size / 2,
          top: HEAD.y - size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          transform: `scale(${0.2 + 0.8 * burst}) rotate(${rot}deg)`,
          opacity: burst * 0.45 * breathe,
          background: RAYS,
          // ring only: clear of the face, fading out before the shoulders
          WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,0) 17%, rgba(0,0,0,1) 24%, rgba(0,0,0,0.4) 34%, rgba(0,0,0,0) 46%)',
        }}
      />
      {/* sustained aura */}
      <div
        style={{
          position: 'absolute',
          left: HEAD.x - 260,
          top: HEAD.y - 260,
          width: 520,
          height: 520,
          borderRadius: '50%',
          opacity: burst * 0.4 * breathe,
          background: 'radial-gradient(circle, rgba(255,236,170,0.55) 0%, rgba(255,190,90,0.3) 30%, rgba(255,120,60,0) 68%)',
        }}
      />
      {/* ignition flash */}
      <div
        style={{
          position: 'absolute',
          left: HEAD.x - 520,
          top: HEAD.y - 520,
          width: 1040,
          height: 1040,
          borderRadius: '50%',
          opacity: Easing.out(Easing.quad)(flash),
          background: 'radial-gradient(circle, rgba(255,250,225,1) 0%, rgba(255,215,140,0.55) 22%, rgba(255,160,90,0) 60%)',
        }}
      />
    </AbsoluteFill>
  );
};
