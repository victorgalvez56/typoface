export const THEMES: Record<string, string[]> = {
  'K-Pop':  ['#FF3366','#FF6B35','#FFD700','#00FF88','#00BFFF','#9B59B6','#FF1493','#00CED1','#FF4500','#7FFF00'],
  'Matrix': ['#00FF41','#008F11','#00D600','#007A00','#39FF14','#00E500','#00B300','#33FF33','#66FF00','#00FF7F'],
  'Sakura': ['#FFB7C5','#FF8FAB','#FFDDE1','#FFC0CB','#FFE4E1','#FF69B4','#FFB6C1','#FFA0B4','#FF85A1','#FFADC5'],
  'Ocean':  ['#0077B6','#00B4D8','#48CAE4','#90E0EF','#023E8A','#0096C7','#ADE8F4','#00BFFF','#1E90FF','#4169E1'],
  'Fire':   ['#FF0000','#FF4500','#FF6B35','#FFD700','#FF8C00','#FF3300','#FF6000','#FFAA00','#FF2200','#FFC200'],
  'Neon':   ['#39FF14','#FF00FF','#00FFFF','#FF3300','#FFFF00','#FF1493','#00FF7F','#FF4500','#7FFF00','#FF6600'],
  'Mono':   ['#FFFFFF','#E8E8E8','#D0D0D0','#B8B8B8','#A0A0A0','#888888','#707070','#585858','#C8C8C8','#F0F0F0'],
  'Pastel': ['#FFB3C6','#CAFFBF','#9BF6FF','#BDB2FF','#FFADAD','#FFC6FF','#FFD6A5','#FDFFB6','#A0C4FF','#FFAFCC'],
};

export type ThemeKey = keyof typeof THEMES;

export const DEFAULT_THEME: ThemeKey = 'K-Pop';

export function getThemeColors(theme: string): string[] {
  return THEMES[theme] ?? THEMES['K-Pop'];
}

/** Parse a hex color to [r, g, b] 0-255 */
export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Build an rgba string with the given alpha */
export function hexWithAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}
