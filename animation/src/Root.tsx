import {Composition} from 'remotion';
import {MataKiChowki} from './MataKiChowki';

// 1080x1920 vertical (reels / WhatsApp status), 30fps.
export const RemotionRoot: React.FC = () => (
  <Composition
    id="MataKiChowki"
    component={MataKiChowki}
    durationInFrames={30 * 12}
    fps={30}
    width={1080}
    height={1920}
  />
);
