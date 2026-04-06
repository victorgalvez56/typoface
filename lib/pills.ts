import { DENSITY_PRESETS, DensityKey } from './constants';

export interface Pill {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  cx: number;
  cy: number;
  text: string;
  fs: number;
  fontStr: string;
  color: string;
  phase: number;
  speed: number;
  pulseAmp: number;
  row: number;
}

// Simple seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generatePills(
  W: number,
  H: number,
  words: string[],
  colors: string[],
  densityKey: DensityKey
): Pill[] {
  if (W === 0 || H === 0 || words.length === 0) return [];

  const preset = DENSITY_PRESETS[densityKey];
  const pillH = preset.pillH;
  const maxChars = preset.maxChars;
  const seed = W * 10000 + H;
  const rand = mulberry32(seed);

  const pills: Pill[] = [];
  const padY = 4;
  const gapY = 4;
  const rowH = pillH + gapY;
  const numRows = Math.ceil(H / rowH) + 1;
  let wordIdx = 0;

  for (let row = 0; row < numRows; row++) {
    const y = row * rowH - padY;
    let x = (rand() * 40 - 20); // jitter start

    while (x < W + 20) {
      const word = words[wordIdx % words.length];
      wordIdx++;

      // Limit display length
      const displayText = word.length > maxChars ? word.slice(0, maxChars) : word;

      const fs = pillH * 0.56;
      const fontStr = `bold ${fs}px 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans Arabic', sans-serif`;

      // Estimate character width (CJK chars are wider)
      const isWide = /[\u3000-\u9FFF\uAC00-\uD7AF\u0600-\u06FF]/.test(displayText);
      const charW = isWide ? fs * 0.95 : fs * 0.6;
      const textW = displayText.length * charW;
      const padX = pillH * 0.55;
      const w = textW + padX * 2;
      const r = pillH / 2;

      const cx = x + w / 2;
      const cy = y + pillH / 2;

      const color = colors[Math.floor(rand() * colors.length)];
      const phase = rand() * Math.PI * 2;
      const speed = 0.4 + rand() * 0.8; // Hz
      const pulseAmp = 0.04 + rand() * 0.08;

      pills.push({ x, y, w, h: pillH, r, cx, cy, text: displayText, fs, fontStr, color, phase, speed, pulseAmp, row });

      x += w + 6 + rand() * 8;
    }
  }

  return pills;
}
