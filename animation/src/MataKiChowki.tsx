import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

// Placeholder pass: proves the pipeline renders. The real scene breakdown
// gets built once the creative direction is locked.
export const MataKiChowki: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 360], [1.15, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#b0126f'}}>
      <Img
        src={staticFile('reference.png')}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`, opacity}}
      />
    </AbsoluteFill>
  );
};
