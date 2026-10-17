# Trailer grammar cheat-sheet

Techniques to borrow, not footage. Map each one to a Remotion pattern.

| Technique | What it does | Remotion pattern |
|---|---|---|
| Cold open in darkness | Builds anticipation before the reveal | Black `AbsoluteFill`; a single light source fades in via `interpolate` |
| Light-leak / flare transition | Hides cuts and feels divine or epic | Radial-gradient div, `mixBlendMode: 'screen'`, opacity peak at the cut |
| Slow reveal push-in | Gives the subject scale and majesty | Scale 1.25→1.0 over 3–4 s, `Easing.out(Easing.cubic)` |
| Title slam | Punctuation on a beat | `spring` scale 1.4→1 with heavy damping, plus a camera shake of 4–6 frames |
| Text light sweep | Makes gold text feel metallic | `background-clip: text` with a moving linear gradient |
| Ember / petal drift | Atmosphere and depth | Seeded particles with `random(seed)` and per-particle speed and parallax |
| Rhythmic cut acceleration | Builds energy toward the title | Shorten `Sequence` lengths: 45 → 30 → 20 → 12 frames |
| Silence before the drop | Gives contrast to the hero moment | Dip music volume to 0 for 8–12 frames before the title |
| End card hold | Delivers the information clearly | A static, calm layout with only a breathing glow and particles |

## Genre notes: Indian devotional / mythological

- Palette: deep magenta/vermilion, temple gold and diya-flame amber. Gold is light, not paint, so animate it as light.
- Motifs: diya flames flickering, marigold/rose petals falling, a halo (prabhamandal) that slowly rotates, conch or bell hits on beats, incense smoke, and temple-arch reveals with doors or curtains opening.
- Pacing: reverent. Use slow pushes and heavy springs, avoid bouncy UI motion, and place one big crescendo near the title.
- Sound: tanpura drone, then dhol/nagada build, then a bell/conch hit on the title, then bhajan or aarti, then "Jai Mata Di" chant on the end card.
- Common reference trailers: big Indian mythological films (*Baahubali*, *Adipurush*, *Brahmastra*, *Kantara*, *Hanu-Man*) for light, scale and title cards, and Navratri/Durga Puja promo films for festive tone.
