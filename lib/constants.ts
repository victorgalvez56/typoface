// Shared constants for the Typoface app

export const BS = 22; // block size for luminance blur
export const ENHANCE = 1.6; // unsharp mask enhancement factor
export const THRESHOLD = 0.18; // luminance threshold below which pills are invisible
export const ALPHA_GAMMA = 0.75; // gamma for alpha mapping

export const DENSITY_PRESETS = {
  Normal: { maxChars: 8, pillH: 22 },
  Dense: { maxChars: 4, pillH: 18 },
  Micro: { maxChars: 2, pillH: 14 },
} as const;

export type DensityKey = keyof typeof DENSITY_PRESETS;

export const CONTRAST_PRESETS = {
  Low: 1.2,
  Normal: 1.8,
  High: 2.6,
  Extreme: 3.5,
} as const;

export type ContrastKey = keyof typeof CONTRAST_PRESETS;

export type FxMode = 'None' | 'Wave' | 'Glitch' | 'Breathe';

export const FX_MODES: FxMode[] = ['None', 'Wave', 'Glitch', 'Breathe'];
