# Mata Ki Chowki: shot list (v2, as built)

**Direction:** Darkness → Divine reveal, made from the same artwork split into layers.
**Format:** 1080×1920 (9:16), 30 fps, 12 s (360 frames), using the original clip's audio.
**Hero frame:** the halo ignites behind Mata (about 5 s).
**Typography:** gold light-sweep reveal. **Atmosphere:** falling petals. **Ending:** calm info hold.

The audio phrases breathe at about 4.5 s, 7.5 s and 10.5 s (loudness dips), so the beats land on them.

| # | Frames | Time | Beat | Visual | Motion |
|---|--------|------|------|--------|--------|
| 1 | 0–45 | 0–1.5 s | Cold open | Black. One warm glow appears where Mata sits | Glow fades up, slow push starts (scale 1.25) |
| 2 | 45–135 | 1.5–4.5 s | Temple wakes | Arch and carvings emerge from darkness top-down as a gold light sweep passes. Magenta background blooms in. Garlands fade in | Light sweep down the arch; background radial bloom; slow push continues |
| 3 | 135–195 | 4.5–6.5 s | **Hero: halo ignites** | Halo behind Mata bursts into slowly rotating rays; the tiger and offerings brighten; petals begin to fall | Ray burst on the 4.5 s phrase start; a heavily damped spring settles the camera at scale 1.0; held for about 2 s |
| 4 | 195–255 | 6.5–8.5 s | Title | "MATA KI CHOWKI" rises with a mask and a metallic shine sweeps across it | Mask rise of 20 frames, then a 25-frame shine |
| 5 | 255–300 | 8.5–10 s | Information | Invitation lines, then date/time, then address fade up 6 frames apart. Diyas fade in on both sides | Staggered fade + 12 px rise, ease-out |
| 6 | 300–360 | 10–12 s | Blessing hold | "JAI MATA DI" glow pulse on the 10.5 s phrase. Everything is readable; only petals and the halo keep moving | Single glow pulse; ambient motion only |

## Camera (added in v2)

The camera pushes in from 1.55x to 1.3x through the reveal, framed so the shrine is centred for the hero beat. From frame 184 to 224 it pulls back to the full invitation while the title rises. The long halo rays sit *behind* the arch so they pour out around the shrine without striping Mata's face. Only a soft aura and short rays around the halo ring sit over the artwork.

## Layer plan (from the original artwork)

1. Background magenta gradient (rebuilt as a CSS gradient for crispness)
2. Temple arch with carvings
3. Mata + tiger + offerings (hero cut-out)
4. Halo rays (generated overlay)
5. Garland strings, left and right
6. Brass diyas, left and right
7. Text blocks (rebuilt as live text in a matching gold font, so they stay crisp)
8. Petal particles (generated, seeded, 3 depth layers)

## Source

Built from the video itself (no original artwork was available): 60-frame average, then ESRGAN 4x upscale, then layer cut-outs. See README.md. If the original poster turns up, rerun the layer scripts on it for a sharper result.
