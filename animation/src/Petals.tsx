import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {T} from './timeline';

// Colours sampled from the garlands: white, blush pink and deep rose.
const COLORS = ['#fff3f8', '#f9b8d6', '#f37fb5', '#b8135f'];
const COUNT = 46;

type Petal = {x: number; delay: number; speed: number; size: number; spin: number; sway: number; phase: number; depth: number; color: string; tilt: number};

const petals: Petal[] = Array.from({length: COUNT}, (_, i) => {
  const r = (k: string) => random(`petal-${i}-${k}`);
  const depth = r('d'); // 0 = far, 1 = near
  return {
    x: r('x') * 1080,
    delay: r('t') * 210,
    speed: 2.2 + depth * 3.2 + r('s') * 1.2,
    size: 14 + depth * 26 + r('z') * 6,
    spin: (r('r') - 0.5) * 6,
    sway: 20 + r('w') * 45,
    phase: r('p') * Math.PI * 2,
    depth,
    color: COLORS[Math.floor(r('c') * COLORS.length)],
    tilt: r('k') * 360,
  };
});

export const Petals: React.FC<{layer: 'back' | 'front'}> = ({layer}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {petals
        .filter((p) => (layer === 'front' ? p.depth > 0.72 : p.depth <= 0.72))
        .map((p, i) => {
          const t = frame - T.petalsStart - p.delay;
          if (t < 0) return null;
          const y = -60 + t * p.speed;
          if (y > 1980) return null;
          const x = p.x + Math.sin(t / 22 + p.phase) * p.sway;
          const rot = p.tilt + t * p.spin;
          // 3D-ish flutter: squash on one axis as the petal turns over
          const flip = Math.cos(t / 14 + p.phase);
          const blur = p.depth > 0.85 ? (p.depth - 0.85) * 18 : p.depth < 0.25 ? 1.2 : 0;
          return (
            <svg
              key={i}
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 20 26"
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: `rotate(${rot}deg) scaleX(${0.35 + 0.65 * Math.abs(flip)})`,
                filter: blur ? `blur(${blur}px)` : undefined,
                opacity: 0.55 + p.depth * 0.45,
              }}
            >
              <defs>
                <radialGradient id={`pg-${layer}-${i}`} cx="50%" cy="80%" r="80%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} />
                  <stop offset="100%" stopColor={p.color} />
                </radialGradient>
              </defs>
              <path d="M10 0 C17 6 20 14 15 22 C13 25 7 25 5 22 C0 14 3 6 10 0 Z" fill={`url(#pg-${layer}-${i})`} />
              <path d="M10 3 L10 22" stroke="#ffffff" strokeOpacity={0.25} strokeWidth={0.8} />
            </svg>
          );
        })}
    </AbsoluteFill>
  );
};
