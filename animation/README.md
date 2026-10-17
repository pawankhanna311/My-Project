# Mata Ki Chowki animation (Remotion)

Shot list: [SHOTLIST.md](SHOTLIST.md). Workflow: `.claude/skills/motion-design/SKILL.md`.

## Setup

```bash
cd animation
npm install
# The soundtrack is not committed; extract it from the source clip:
ffmpeg -i <reference-clip>.mp4 -vn -c:a copy public/reference.m4a
```

## How the layers in `public/layers/` were made

The source clip is a 478x850 InShot export of a static poster, so the layers are rebuilt from it:

1. Average 60 frames to remove compression noise, then crop to the poster (the watermark sits outside it):
   `ffmpeg -i clip.mp4 -vf "tmix=frames=60" -ss 5 -frames:v 1 avg.png`, then
   `ffmpeg -i avg.png -vf crop=478:726:0:62 poster_crop.png`
2. Upscale 4x with ESRGAN (UpscalerJS from npm; Hugging Face is not needed):
   `npm i upscaler @upscalerjs/esrgan-thick @tensorflow/tfjs-node` in a scratch folder, then
   `node scripts/upscale.cjs <scratch>/ esrgan-thick/4x poster_crop.png poster_x4.png`
3. Cut the layers and fit the background gradient:
   `python3 scripts/layers.py poster_x4.png public/layers` (needs `numpy` and `opencv-python-headless`).
   All the text is rebuilt as live type in `src/Typography.tsx`.

## Render

```bash
npx remotion studio src/index.ts                                  # live preview
npx remotion still src/index.ts MataKiChowki out/f150.png --frame=150
npx remotion render src/index.ts MataKiChowki out/mata-ki-chowki.mp4
```

`remotion.config.ts` points at the pre-installed headless Chromium in the cloud container; change or remove `setBrowserExecutable` when running elsewhere.
