import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import layers from '../public/layers/layers.json';
import './fonts';
import {Halo, HaloRays} from './Halo';
import {Petals} from './Petals';
import {Typography} from './Typography';
import {ARCH_DY, DURATION, HEAD, T} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type LayerName = keyof typeof layers;

const Layer: React.FC<{name: LayerName; dx?: number; dy?: number; scale?: number; style?: React.CSSProperties}> = ({name, dx = 0, dy = 0, scale = 1, style}) => {
  const b = layers[name];
  const w = b.w * scale;
  const h = b.h * scale;
  return (
    <Img
      src={staticFile(`layers/${name}.png`)}
      style={{position: 'absolute', left: b.x + dx - (w - b.w) / 2, top: b.y + dy - (h - b.h) / 2, width: w, height: h, ...style}}
    />
  );
};

// Each depth plane scales around Mata's head and travels by a different amount,
// giving 2.5D parallax. Planes that must cover the top edge (background,
// garlands) never travel so far that the edge comes into view.
type Cam = {s: number; ty: number};
const plane = (cam: Cam, k: number, coverTop = false): React.CSSProperties => {
  const s = 1 + (cam.s - 1) * k;
  let ty = cam.ty * k;
  if (coverTop) ty = Math.min(ty, HEAD.y * (s - 1));
  return {transform: `translateY(${ty}px) scale(${s})`, transformOrigin: `${HEAD.x}px ${HEAD.y}px`};
};

export const MataKiChowki: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera: push in through the reveal onto a shrine-centred hero framing,
  // then pull back to the full invitation as the title arrives.
  const push = interpolate(frame, [0, T.cameraSettle, T.pullBack], [1.55, 1.3, 1.28], {...clamp, easing: Easing.bezier(0.3, 0, 0.15, 1)});
  const back = interpolate(frame, [T.pullBack, T.pullBackEnd], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)});
  const cam: Cam = {
    s: push + (1 - push) * back + Math.max(0, frame - T.pullBackEnd) * 0.00007,
    ty: 330 * (1 - back),
  };
  const headY = HEAD.y + cam.ty;

  // Darkness lifts top-down; p is the wipe edge in % of frame height.
  const p = interpolate(frame, [T.revealStart, T.revealEnd], [-2, 125], {...clamp, easing: Easing.inOut(Easing.sin)});
  const bandY = ((p - 9) / 100) * 1920;
  const sweepOn = interpolate(frame, [T.revealStart, T.revealStart + 10, T.revealEnd - 15, T.revealEnd], [0, 1, 1, 0], clamp);

  const flicker = 0.88 + 0.12 * noise2D('flame', frame / 9, 0);
  const coldGlow = interpolate(frame, [T.glowIn, 40, 95, 140], [0, 1, 1, 0], clamp) * flicker * 1.15;
  const glowSize = interpolate(frame, [T.glowIn, 60], [120, 300], {...clamp, easing: Easing.out(Easing.cubic)});

  const border = interpolate(frame, [110, 150], [0, 1], clamp);
  const diya = interpolate(frame, [T.diyas, T.diyas + 26], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const vol = (f: number) => interpolate(f, [0, 12, DURATION - 24, DURATION], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('reference.m4a')} volume={vol} />

      {/* ---------- world (moves with the camera) ---------- */}
      <AbsoluteFill>
        <AbsoluteFill style={plane(cam, 0.45, true)}>
          <Img src={staticFile('layers/bg.png')} style={{width: '100%', height: '100%'}} />
        </AbsoluteFill>
        <AbsoluteFill style={plane(cam, 0.8)}>
          <Petals layer="back" />
        </AbsoluteFill>
        <AbsoluteFill style={plane(cam, 1)}>
          <HaloRays />
          <Layer name="arch" dy={ARCH_DY} style={{filter: 'drop-shadow(0 18px 40px rgba(70,0,35,0.45))'}} />
          {/* gold light sweep, confined to the arch artwork */}
          <div
            style={{
              position: 'absolute',
              left: layers.arch.x,
              top: layers.arch.y + ARCH_DY,
              width: layers.arch.w,
              height: layers.arch.h,
              WebkitMaskImage: `url(${staticFile('layers/arch.png')})`,
              WebkitMaskSize: '100% 100%',
              mixBlendMode: 'screen',
              opacity: sweepOn,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: bandY - layers.arch.y - ARCH_DY - 150,
                height: 300,
                background: 'linear-gradient(180deg, rgba(255,210,120,0) 0%, rgba(255,226,150,0.85) 50%, rgba(255,210,120,0) 100%)',
              }}
            />
          </div>
          <Halo />
        </AbsoluteFill>
        <AbsoluteFill style={plane(cam, 1.35, true)}>
          <Layer name="garlandL" />
          <Layer name="garlandR" />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ---------- darkness wipe + cold-open glow ---------- */}
      {p < 125 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            WebkitMaskImage: `linear-gradient(180deg, rgba(0,0,0,0) ${p - 22}%, rgba(0,0,0,1) ${p}%)`,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: HEAD.x - glowSize,
          top: headY - glowSize,
          width: glowSize * 2,
          height: glowSize * 2,
          borderRadius: '50%',
          opacity: coldGlow,
          mixBlendMode: 'screen',
          background: 'radial-gradient(circle, rgba(255,232,170,0.95) 0%, rgba(255,170,70,0.45) 28%, rgba(200,60,40,0) 70%)',
        }}
      />

      {/* ---------- frame + foreground ---------- */}
      <AbsoluteFill style={{opacity: border, pointerEvents: 'none'}}>
        <div style={{position: 'absolute', inset: 24, border: '3px solid rgba(255,196,220,0.8)'}} />
        <div style={{position: 'absolute', inset: 40, border: '2px solid rgba(255,196,220,0.65)', borderRadius: 36}} />
      </AbsoluteFill>

      <AbsoluteFill style={{opacity: diya, transform: `translateY(${(1 - diya) * 30}px)`}}>
        <Layer name="diyaL" dx={-10} dy={160} scale={1.08} />
        <Layer name="diyaR" dx={10} dy={160} scale={1.08} />
      </AbsoluteFill>

      <Typography />
      <Petals layer="front" />

      {/* vignette */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 65% at 50% 42%, rgba(0,0,0,0) 55%, rgba(50,0,25,0.42) 100%)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
