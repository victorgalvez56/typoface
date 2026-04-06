'use client';

import React, { useState } from 'react';
import { THEMES, ThemeKey } from '../lib/themes';
import { LANGUAGE_FLAGS, LanguageKey } from '../lib/languages';
import { DENSITY_PRESETS, DensityKey, FxMode, FX_MODES, ContrastKey, CONTRAST_PRESETS } from '../lib/constants';

interface SidePanelProps {
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
  onFxChange: (fx: FxMode) => void;
  onAudioToggle: () => void;
  onCapture: () => void;
  onTimerCapture: () => void;
  onRecordToggle: () => void;
  onRandomize: () => void;
  onCustomTextChange: (t: string) => void;
}

// ── Reusable primitives ────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-zinc-600 text-[10px] font-mono tracking-widest uppercase mb-2">
      {children}
    </div>
  );
}

function ToggleBtn({
  label,
  active,
  onClick,
  accent = 'orange',
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: string;
}) {
  const accentMap: Record<string, string> = {
    orange: 'bg-orange-400/10 text-orange-400 border-orange-400/30',
    pink:   'bg-pink-500/10  text-pink-400  border-pink-500/30',
    green:  'bg-green-400/10 text-green-400 border-green-400/30',
    red:    'bg-red-400/10   text-red-400   border-red-400/30',
    blue:   'bg-blue-400/10  text-blue-400  border-blue-400/30',
  };
  const dotMap: Record<string, string> = {
    orange: 'bg-orange-400',
    pink:   'bg-pink-400',
    green:  'bg-green-400',
    red:    'bg-red-400',
    blue:   'bg-blue-400',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-[11px] font-mono transition-colors border ${
        active
          ? accentMap[accent]
          : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-400'
      }`}
    >
      <span>{label}</span>
      <span className={`w-2 h-2 rounded-full ${active ? dotMap[accent] : 'bg-zinc-700'}`} />
    </button>
  );
}

function SegmentedPicker<T extends string>({
  options,
  value,
  onChange,
  accent = 'orange',
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  accent?: string;
}) {
  const accentActive: Record<string, string> = {
    orange: 'bg-orange-400/10 text-orange-400 border-orange-400/30',
    pink:   'bg-pink-500/10  text-pink-400  border-pink-500/30',
    blue:   'bg-blue-400/10  text-blue-400  border-blue-400/30',
  };

  return (
    <div className="flex gap-1 flex-wrap">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-2.5 py-1 rounded text-[10px] font-mono border transition-colors ${
            value === opt
              ? accentActive[accent]
              : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-400'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  color = 'zinc',
  full = false,
}: {
  label: string;
  onClick: () => void;
  color?: 'zinc' | 'orange' | 'red' | 'pink' | 'green';
  full?: boolean;
}) {
  const colors = {
    zinc:   'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300',
    orange: 'bg-orange-400/10 text-orange-400 border-orange-400/30 hover:bg-orange-400/20',
    red:    'bg-red-400/10 text-red-400 border-red-400/30 hover:bg-red-400/20',
    pink:   'bg-pink-500/10 text-pink-400 border-pink-500/30 hover:bg-pink-500/20',
    green:  'bg-green-400/10 text-green-400 border-green-400/30 hover:bg-green-400/20',
  };
  return (
    <button
      onClick={onClick}
      className={`${full ? 'w-full' : 'flex-1'} px-3 py-2 rounded text-[11px] font-mono border transition-colors ${colors[color]}`}
    >
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function SidePanel({
  mirror, invert, theme, language, density, contrast,
  fxMode, audioEnabled, isRecording, customText,
  onMirrorToggle, onInvertToggle, onThemeChange, onLanguageChange,
  onDensityChange, onContrastChange, onFxChange, onAudioToggle,
  onCapture, onTimerCapture, onRecordToggle, onRandomize,
  onCustomTextChange,
}: SidePanelProps) {
  const [customOpen, setCustomOpen] = useState(false);

  const themeKeys = Object.keys(THEMES) as ThemeKey[];
  const langKeys  = Object.keys(LANGUAGE_FLAGS) as LanguageKey[];
  const densityKeys = Object.keys(DENSITY_PRESETS) as DensityKey[];
  const contrastKeys = Object.keys(CONTRAST_PRESETS) as ContrastKey[];

  return (
    <div
      className="hidden lg:flex flex-col w-[300px] xl:w-[320px] shrink-0 h-full select-none overflow-y-auto"
      style={{ background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.06)', scrollbarWidth: 'none' }}
    >
      {/* ── Header ── */}
      <div className="shrink-0 px-7 pt-8 pb-5 border-b border-zinc-900">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366] animate-pulse" />
          <span className="text-zinc-600 text-[10px] font-mono tracking-widest uppercase">Live · On-device</span>
        </div>
        <div className="font-black text-white text-2xl tracking-tight font-mono leading-none">
          typo<span style={{ color: '#FF3366' }}>face</span>
        </div>
        <p className="text-zinc-600 text-[10px] font-mono mt-1.5">Typographic Portrait Studio</p>
      </div>

      {/* ── Scrollable controls ── */}
      <div className="flex-1 px-7 py-5 space-y-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

        {/* Camera */}
        <div>
          <SectionLabel>Camera</SectionLabel>
          <div className="space-y-1.5">
            <ToggleBtn label="⟺  Mirror"  active={mirror} onClick={onMirrorToggle} accent="orange" />
            <ToggleBtn label="◑  Invert"  active={invert} onClick={onInvertToggle} accent="orange" />
          </div>
        </div>

        {/* Contrast */}
        <div>
          <SectionLabel>Contrast</SectionLabel>
          <SegmentedPicker
            options={contrastKeys}
            value={contrast}
            onChange={onContrastChange}
            accent="orange"
          />
        </div>

        {/* Density */}
        <div>
          <SectionLabel>Density</SectionLabel>
          <SegmentedPicker
            options={densityKeys}
            value={density}
            onChange={onDensityChange}
            accent="orange"
          />
        </div>

        {/* Theme */}
        <div>
          <SectionLabel>Theme</SectionLabel>
          <div className="space-y-1.5">
            {themeKeys.map(t => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-[11px] font-mono border transition-colors ${
                  theme === t
                    ? 'bg-white/8 text-white border-white/20'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-400'
                }`}
              >
                {/* Color dots */}
                <div className="flex gap-0.5 flex-shrink-0">
                  {THEMES[t].slice(0, 5).map((c, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="flex-1 text-left">{t}</span>
                {theme === t && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <SectionLabel>Language</SectionLabel>
          <div className="space-y-1.5">
            {langKeys.map(l => (
              <button
                key={l}
                onClick={() => {
                  onLanguageChange(l);
                  if (l === 'Custom') setCustomOpen(true);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-[11px] font-mono border transition-colors ${
                  language === l
                    ? 'bg-blue-400/10 text-blue-300 border-blue-400/30'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-400'
                }`}
              >
                <span>{LANGUAGE_FLAGS[l]}  {l}</span>
                {language === l && <span className="w-2 h-2 rounded-full bg-blue-400" />}
              </button>
            ))}
          </div>

          {/* Custom text input */}
          {language === 'Custom' && customOpen && (
            <div className="mt-2">
              <textarea
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white/70 text-[11px] font-mono resize-none focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
                rows={3}
                placeholder="Type your words, space or newline separated…"
                value={customText}
                onChange={e => onCustomTextChange(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Effects */}
        <div>
          <SectionLabel>Visual FX</SectionLabel>
          <div className="space-y-1.5">
            {FX_MODES.map(fx => (
              <button
                key={fx}
                onClick={() => onFxChange(fx)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-[11px] font-mono border transition-colors ${
                  fxMode === fx
                    ? 'bg-pink-500/10 text-pink-300 border-pink-500/30'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-400'
                }`}
              >
                <span>
                  {fx === 'None' ? '○  None' :
                   fx === 'Wave' ? '〰  Wave' :
                   fx === 'Glitch' ? '▦  Glitch' :
                   '◉  Breathe'}
                </span>
                {fxMode === fx && <span className="w-2 h-2 rounded-full bg-pink-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Audio */}
        <div>
          <SectionLabel>Audio</SectionLabel>
          <ToggleBtn
            label="🎵  Reactive to mic"
            active={audioEnabled}
            onClick={onAudioToggle}
            accent="green"
          />
        </div>

        {/* Export */}
        <div>
          <SectionLabel>Export</SectionLabel>
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <ActionBtn label="📷 Capture" onClick={onCapture} color="zinc" />
              <ActionBtn label="⏱ Timer"   onClick={onTimerCapture} color="zinc" />
            </div>
            <ActionBtn
              label={isRecording ? '⏹  Stop Recording' : '⏺  Record Video'}
              onClick={onRecordToggle}
              color={isRecording ? 'red' : 'zinc'}
              full
            />
          </div>
        </div>
      </div>

      {/* ── Randomize button ── */}
      <div className="shrink-0 px-7 py-4 border-t border-zinc-900">
        <button
          onClick={onRandomize}
          className="w-full py-3 rounded-lg text-[11px] font-mono font-bold tracking-widest uppercase border transition-all
            bg-gradient-to-r from-[#FF3366]/10 via-[#FFD700]/10 to-[#00FF88]/10
            border-white/10 text-white/60 hover:text-white hover:border-white/25
            hover:from-[#FF3366]/20 hover:via-[#FFD700]/20 hover:to-[#00FF88]/20"
        >
          ⟳  Randomize Everything
        </button>
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 px-7 py-4 border-t border-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-zinc-600 text-[10px] font-mono">M · I · C · Space</span>
          </div>
          <a
            href="https://github.com/victorgalvez56/typoface"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 hover:text-zinc-400 text-[10px] font-mono transition-colors"
          >
            GitHub ↗
          </a>
        </div>
        <div className="mt-3 text-zinc-700 text-[9px] font-mono">
          by <a href="https://github.com/victorgalvez56" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-500 transition-colors">victorgalvez56</a>
        </div>
      </div>
    </div>
  );
}
