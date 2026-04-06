'use client';

import React, { useState } from 'react';
import { THEMES, ThemeKey } from '../lib/themes';
import { LANGUAGE_FLAGS, LanguageKey } from '../lib/languages';
import { DENSITY_PRESETS, DensityKey, FxMode, FX_MODES, ContrastKey, CONTRAST_PRESETS } from '../lib/constants';

interface ControlPanelProps {
  mirror: boolean;
  invert: boolean;
  theme: string;
  language: LanguageKey;
  density: DensityKey;
  contrast: ContrastKey;
  fxMode: FxMode;
  audioEnabled: boolean;
  isRecording: boolean;
  customText: string;
  onMirrorToggle: () => void;
  onInvertToggle: () => void;
  onThemeChange: (t: string) => void;
  onLanguageChange: (l: LanguageKey) => void;
  onDensityChange: (d: DensityKey) => void;
  onContrastChange: (c: ContrastKey) => void;
  onFxCycle: () => void;
  onAudioToggle: () => void;
  onCapture: () => void;
  onTimerCapture: () => void;
  onRecordToggle: () => void;
  onRandomizeColors: () => void;
  onCustomTextChange: (t: string) => void;
}

const btnBase =
  'rounded-full px-4 py-2 text-xs tracking-widest border border-white/10 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all whitespace-nowrap select-none cursor-pointer';
const btnActive = 'bg-white/20 border-white/30 text-white';
const btnRed = 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse';

export default function ControlPanel({
  mirror,
  invert,
  theme,
  language,
  density,
  contrast,
  fxMode,
  audioEnabled,
  isRecording,
  customText,
  onMirrorToggle,
  onInvertToggle,
  onThemeChange,
  onLanguageChange,
  onDensityChange,
  onContrastChange,
  onFxCycle,
  onAudioToggle,
  onCapture,
  onTimerCapture,
  onRecordToggle,
  onRandomizeColors,
  onCustomTextChange,
}: ControlPanelProps) {
  const [showCustom, setShowCustom] = useState(false);

  const languages = Object.keys(LANGUAGE_FLAGS) as LanguageKey[];
  const densities = Object.keys(DENSITY_PRESETS) as DensityKey[];
  const contrasts = Object.keys(CONTRAST_PRESETS) as ContrastKey[];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-10 lg:hidden"
      style={{
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="overflow-x-auto">
        <div className="flex items-center gap-2 px-4 py-3 min-w-max mx-auto justify-center flex-wrap md:flex-nowrap">

          {/* Divider label */}
          <span className="text-white/20 text-[10px] tracking-widest uppercase hidden md:block">Camera</span>

          {/* Mirror */}
          <button
            className={`${btnBase} ${mirror ? btnActive : ''}`}
            onClick={onMirrorToggle}
            title="Mirror (M)"
          >
            ⟺ Mirror
          </button>

          {/* Invert */}
          <button
            className={`${btnBase} ${invert ? btnActive : ''}`}
            onClick={onInvertToggle}
            title="Invert (I)"
          >
            ◑ Invert
          </button>

          <div className="w-px h-6 bg-white/10 hidden md:block" />

          {/* Contrast */}
          <span className="text-white/20 text-[10px] tracking-widest uppercase hidden md:block">Contrast</span>
          {contrasts.map(c => (
            <button
              key={c}
              className={`${btnBase} ${contrast === c ? btnActive : ''}`}
              onClick={() => onContrastChange(c)}
            >
              {c}
            </button>
          ))}

          <div className="w-px h-6 bg-white/10 hidden md:block" />

          {/* Density */}
          <span className="text-white/20 text-[10px] tracking-widest uppercase hidden md:block">Density</span>
          {densities.map(d => (
            <button
              key={d}
              className={`${btnBase} ${density === d ? btnActive : ''}`}
              onClick={() => onDensityChange(d)}
            >
              {d}
            </button>
          ))}

          <div className="w-px h-6 bg-white/10 hidden md:block" />

          {/* FX */}
          <button
            className={`${btnBase} ${fxMode !== 'None' ? btnActive : ''}`}
            onClick={onFxCycle}
            title="Cycle visual effects"
          >
            ✦ {fxMode === 'None' ? 'FX' : fxMode}
          </button>

          {/* Audio */}
          <button
            className={`${btnBase} ${audioEnabled ? btnActive : ''}`}
            onClick={onAudioToggle}
          >
            🎵 Audio
          </button>

          <div className="w-px h-6 bg-white/10 hidden md:block" />

          {/* Theme */}
          <span className="text-white/20 text-[10px] tracking-widest uppercase hidden md:block">Theme</span>
          {Object.keys(THEMES).map(t => (
            <button
              key={t}
              className={`${btnBase} flex items-center gap-1.5 ${theme === t ? btnActive : ''}`}
              onClick={() => onThemeChange(t)}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: THEMES[t as ThemeKey][0] }}
              />
              {t}
            </button>
          ))}

          <button
            className={`${btnBase}`}
            onClick={onRandomizeColors}
            title="Randomize colors (Space)"
          >
            ⟳ Random
          </button>

          <div className="w-px h-6 bg-white/10 hidden md:block" />

          {/* Language */}
          <span className="text-white/20 text-[10px] tracking-widest uppercase hidden md:block">Lang</span>
          {languages.map(l => (
            <button
              key={l}
              className={`${btnBase} ${language === l ? btnActive : ''}`}
              onClick={() => {
                onLanguageChange(l);
                if (l === 'Custom') setShowCustom(true);
              }}
            >
              {LANGUAGE_FLAGS[l]} {l}
            </button>
          ))}

          <div className="w-px h-6 bg-white/10 hidden md:block" />

          {/* Capture */}
          <button
            className={`${btnBase} border-white/20`}
            onClick={onCapture}
            title="Capture (C)"
          >
            📷 Capture
          </button>

          {/* Timer */}
          <button
            className={`${btnBase}`}
            onClick={onTimerCapture}
            title="Timer capture"
          >
            ⏱ Timer
          </button>

          {/* Record */}
          <button
            className={`${btnBase} ${isRecording ? btnRed : ''}`}
            onClick={onRecordToggle}
            title="Record (R)"
          >
            {isRecording ? '⏹ Stop' : '⏺ Record'}
          </button>
        </div>
      </div>

      {/* Custom text panel */}
      {showCustom && language === 'Custom' && (
        <div
          className="border-t px-4 py-3 flex items-start gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <span className="text-white/40 text-xs tracking-widest uppercase pt-2 flex-shrink-0">Words</span>
          <textarea
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/80 text-xs resize-none focus:outline-none focus:border-white/30 placeholder-white/20"
            rows={2}
            placeholder="Type your words here, separated by spaces or newlines…"
            value={customText}
            onChange={e => onCustomTextChange(e.target.value)}
          />
          <button
            className="text-white/30 hover:text-white/60 text-xs mt-2 transition-colors"
            onClick={() => setShowCustom(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
