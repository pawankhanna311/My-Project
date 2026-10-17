# Mata Ki Chowki animation (Remotion)

Shot list: [SHOTLIST.md](SHOTLIST.md). Workflow: `.claude/skills/motion-design/SKILL.md`.

## Setup

```bash
cd animation
npm install
# Reference assets are not committed; recreate them from the source clip:
ffmpeg -ss 6 -i <reference-clip>.mp4 -frames:v 1 public/reference.png
ffmpeg -i <reference-clip>.mp4 -c copy public/reference.mp4
```

## Render

```bash
npx remotion studio src/index.ts                                  # live preview
npx remotion still src/index.ts MataKiChowki out/f150.png --frame=150
npx remotion render src/index.ts MataKiChowki out/mata-ki-chowki.mp4
```

`remotion.config.ts` points at the pre-installed headless Chromium in the cloud container; change or remove `setBrowserExecutable` when running elsewhere.
