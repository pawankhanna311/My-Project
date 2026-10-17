import {continueRender, delayRender, staticFile} from 'remotion';

export const FONT = 'Montserrat';

const weights = [500, 700, 800] as const;

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading Montserrat');
  Promise.all(
    weights.map((w) => {
      const face = new FontFace(FONT, `url(${staticFile(`fonts/montserrat-latin-${w}-normal.woff2`)}) format('woff2')`, {
        weight: String(w),
      });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
