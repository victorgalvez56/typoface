'use client';

import { useState, useCallback, useRef } from 'react';
import { generatePills, Pill } from '../lib/pills';
import { DensityKey } from '../lib/constants';
import { getWordPool, LanguageKey } from '../lib/languages';
import { getThemeColors } from '../lib/themes';

interface PillLayoutOptions {
  W: number;
  H: number;
  density: DensityKey;
  language: LanguageKey;
  customText: string;
  theme: string;
}

export function usePillLayout() {
  const [pills, setPills] = useState<Pill[]>([]);
  const lastKeyRef = useRef<string>('');

  const buildLayout = useCallback((opts: PillLayoutOptions) => {
    const { W, H, density, language, customText, theme } = opts;
    if (W === 0 || H === 0) return;

    const key = `${W}x${H}-${density}-${language}-${customText.slice(0, 40)}-${theme}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    const words = getWordPool(language, customText);
    const colors = getThemeColors(theme);
    const newPills = generatePills(W, H, words, colors, density);
    setPills(newPills);
  }, []);

  return { pills, buildLayout };
}
