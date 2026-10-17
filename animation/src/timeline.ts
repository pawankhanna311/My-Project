// All timings in frames at 30fps. See SHOTLIST.md for the beat sheet.
export const FPS = 30;
export const DURATION = 360;

export const T = {
  glowIn: 8, // warm glow appears in the dark
  revealStart: 45, // light sweep starts down the arch
  revealEnd: 135,
  halo: 135, // hero: halo ignites (4.5s phrase)
  petalsStart: 120,
  cameraSettle: 175, // push-in lands on the hero framing
  pullBack: 184, // camera pulls back to the full invitation as the title arrives
  pullBackEnd: 224,
  titleIn: 204,
  titleShine: 230,
  info: 252, // invitation, date, address stagger
  diyas: 250,
  divider: 292,
  jai: 300,
  jaiPulse: 315, // 10.5s phrase
} as const;

// Layout in frame space (1080x1920). Poster space is 1080x1640; the upper
// group keeps poster coordinates shifted down by ARCH_DY.
export const ARCH_DY = 60;
export const HEAD = {x: 540, y: 382 + ARCH_DY};
