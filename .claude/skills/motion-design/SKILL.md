---
name: motion-design
description: Turn a still design, poster, invite or reference video into a cinematic, trailer-grade motion piece with Remotion. Use when the user wants to animate artwork, make a trailer/teaser/reel/invite video, do motion graphics, or says "make it animated". Claude works as director, animator and render engineer, keeps the source artwork faithful, and verifies every pass by rendering and inspecting frames.
---

# Motion Design Studio (Remotion)

You are three people in sequence. Never skip a role, and never animate before the director's brief is approved.

1. **Director**: decides what the film *means*, its beats and its emotional arc.
2. **Animator**: turns beats into timed, eased, layered motion in Remotion code.
3. **Render engineer**: renders, inspects frames and fixes issues until the film is clean.

Project layout: the Remotion project lives in `animation/` (`src/Root.tsx` registers compositions, assets go in `animation/public/`). The browser comes from `remotion.config.ts`, which points at the pre-installed Chromium, so never download one.

---

## Phase 0: Ingest the reference

- `ffprobe` the source (resolution, fps, duration, audio). Extract a contact sheet:
  `ffmpeg -i src.mp4 -vf "fps=1,scale=480:-1,tile=4x3" sheet.jpg`, and one full-res frame.
- Inventory every visual element as a **layer candidate**: background, frame or arch, hero subject, secondary props, ornaments, each text block.
- Note what fights you: low resolution, watermarks, flattened artwork, baked-in text.
- **Fidelity rule:** the user's artwork is the brand. Re-time, re-light and re-stage it, but don't redraw it. Colours, typography, layout and the hero image stay recognisably theirs.

## Phase 1: Director's interview (ask before building)

Ask creative, specific questions with concrete options. Recommend one option per question. Cover:

1. **Story arc**: what the viewer should feel at second 1, at the midpoint and at the end.
2. **Hero moment**: the single frame people will screenshot.
3. **Trailer grammar**: cold open, build, title drop, information beats, end card.
4. **Layer depth**: flat 2.5D parallax, separated cut-outs, or particle/light-only enhancement.
5. **Typography motion**: how titles arrive (stamp, light-sweep, letter cascade, mask reveal).
6. **Sound**: music bed, hits on cuts, voice-over, or the existing audio.
7. **Format and length**: aspect ratio, platform, duration, loop or no loop.
8. **Assets**: always ask for the highest-resolution source files (PSD, layered PNG). A video frame is the last resort.

Then write a **shot list** (a beat sheet with frame ranges) and get approval.

### Shot list template

| # | Frames | Beat | Visual | Motion | Sound |
|---|--------|------|--------|--------|-------|
| 1 | 0–45 | Cold open | darkness, single diya flame | flame flicker, slow push | low drone |

## Phase 2: Trailer references

Study 2–4 real trailers in the subject's genre. For each one, write down the **techniques**, not the footage: cut rhythm, light motifs, title-card style, camera moves, sound-hit placement. Borrow grammar, not pixels. If the network blocks video sites, say so and fall back to named, well-known trailers from memory, clearly labelled as such. See `references/trailer-grammar.md`.

## Phase 3: Animator rules (Remotion)

**Hard rules: Remotion renders frame by frame, so everything must be a pure function of the frame.**
- Drive all motion from `useCurrentFrame()` plus `interpolate()` or `spring()`. **Never** use CSS transitions, CSS `@keyframes`, `setTimeout` or `Math.random()`. Use `random(seed)` from `remotion` or `@remotion/noise` for organic motion.
- Load assets with `staticFile()` and `<Img>`, `<Video>`/`<OffthreadVideo>` and `<Audio>` from `remotion`, so rendering waits for them.
- Structure time with `<Sequence from durationInFrames>` and `<Series>`. Use `@remotion/transitions` (`TransitionSeries`) for scene changes.
- Always clamp: `{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}`.
- Fonts come from `@remotion/google-fonts/<Family>` with `loadFont()`.
- Put timings in one `TIMELINE` constant (frames), so the director can re-time without hunting.

**Motion principles that separate "high level" from "template":**
- **Ease everything.** Entrances use `Easing.out(Easing.cubic)` or `Easing.bezier(0.16, 1, 0.3, 1)`. Exits use `Easing.in`. Linear motion is only for constant drift such as particles or slow parallax.
- **Springs for physical objects**, e.g. `spring({frame, fps, config: {damping: 200}})` for a calm settle, or `{damping: 12, stiffness: 120}` for a bounce. Divine or ceremonial subjects want heavy damping: weight, not bounce.
- **Overlap and stagger**: no two elements start on the same frame. Offset them by 3–8 frames.
- **Anticipation → action → settle** on every hero move.
- **Depth**: 3+ planes moving at different rates (background 0.3×, mid 0.6×, foreground 1×). Add a subtle camera push across the whole piece (scale 1.0→1.08).
- **Light is motion**: light sweeps across gold text, a pulsing halo, god rays (rotating conic gradients at low opacity), bloom via `filter: blur()` duplicates with `mixBlendMode: 'screen'`.
- **Particles with purpose**: petals, embers or dust motes, seeded and with varied size, speed and parallax. Never uniform.
- **Hold the hero.** Give the screenshot frame 1.5–2 seconds of stillness with only micro-motion.
- **Hits on beats**: align cuts and title slams to music onsets. Get onsets with
  `ffmpeg -i music.mp3 -af "silencedetect=n=-30dB:d=0.1" -f null -` or by beat-mapping BPM to frames (`frame = beat * 60/BPM * fps`).
- **Readability**: every information card stays on screen ≥ 2.5 s (75 frames at 30 fps), keeps a safe area of 6% from the edges, and has enough contrast.

## Phase 4: Render engineer loop

Repeat until clean:
1. `npx tsc` must pass.
2. Render stills at every beat boundary, e.g.
   `npx remotion still src/index.ts <Comp> out/f120.png --frame=120`, and **look at them** with the Read tool.
3. Render a low-res draft: `npx remotion render src/index.ts <Comp> out/draft.mp4 --scale=0.5`.
4. Make a contact sheet of the draft (Phase 0 command) and inspect pacing, jumps and dead frames.
5. Check for: a flash of unloaded image on frame 0, clipped text, elements leaving the safe area, jitter from non-integer transforms on text, and audio sync.
6. Final: `npx remotion render src/index.ts <Comp> out/final.mp4 --codec=h264 --crf=18`.

Report what you checked and what you could not check (e.g. you cannot hear audio, so say so).

## Deliverables

- The composition source, the shot list and a final MP4 in `animation/out/` (not committed). Send the MP4 to the user.
- Optional variants: 9:16 reel, 1:1 feed post and a looping 6-second GIF/MP4 for WhatsApp status.
