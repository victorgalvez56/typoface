'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import PortraitCanvas, { PortraitCanvasHandle } from '../../components/PortraitCanvas';
import SidePanel from '../../components/SidePanel';
import ControlPanel from '../../components/ControlPanel';
import StartOverlay from '../../components/StartOverlay';
import CountdownOverlay from '../../components/CountdownOverlay';
import { useCamera } from '../../hooks/useCamera';
import { usePillLayout } from '../../hooks/usePillLayout';
import { useAudioReactive } from '../../hooks/useAudioReactive';
import { THEMES, ThemeKey } from '../../lib/themes';
import { LanguageKey } from '../../lib/languages';
import { DensityKey, ContrastKey, FxMode, FX_MODES, DENSITY_PRESETS, CONTRAST_PRESETS } from '../../lib/constants';

const NON_CUSTOM_LANGUAGES: Exclude<LanguageKey, 'Custom'>[] = [
  'Korean', 'Japanese', 'Arabic', 'English', 'Spanish',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function StudioPage() {
  const { videoRef, streamRef: _s, state: camState, error: camError, start: startCamera } = useCamera();

  const [mirror, setMirror] = useState(true);
  const [invert, setInvert] = useState(false);
  const [theme, setTheme] = useState<string>('K-Pop');
  const [language, setLanguage] = useState<LanguageKey>('Korean');
  const [density, setDensity] = useState<DensityKey>('Normal');
  const [contrast, setContrast] = useState<ContrastKey>('Normal');
  const [fxMode, setFxMode] = useState<FxMode>('None');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [customText, setCustomText] = useState('');
  const [canvasSize, setCanvasSize] = useState({ W: 0, H: 0 });

  const canvasRef = useRef<PortraitCanvasHandle>(null);

  const audioData = useAudioReactive(audioEnabled);
  const { pills, buildLayout } = usePillLayout();

  // Track canvas size
  useEffect(() => {
    function onResize() {
      setCanvasSize({ W: window.innerWidth, H: window.innerHeight });
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Rebuild pill layout when relevant params change
  useEffect(() => {
    if (canvasSize.W === 0 || canvasSize.H === 0) return;
    buildLayout({
      W: canvasSize.W,
      H: canvasSize.H,
      density,
      language,
      customText,
      theme,
    });
  }, [canvasSize, density, language, customText, theme, buildLayout]);

  const handleCapture = useCallback(() => {
    canvasRef.current?.capture();
  }, []);

  const handleRecordToggle = useCallback(() => {
    if (isRecording) {
      canvasRef.current?.stopRecording();
      setIsRecording(false);
    } else {
      canvasRef.current?.startRecording();
      setIsRecording(true);
    }
  }, [isRecording]);

  const handleFxCycle = useCallback(() => {
    setFxMode(prev => {
      const idx = FX_MODES.indexOf(prev);
      return FX_MODES[(idx + 1) % FX_MODES.length];
    });
  }, []);

  const handleRandomize = useCallback(() => {
    const themeKeys = Object.keys(THEMES) as ThemeKey[];
    const densityKeys = Object.keys(DENSITY_PRESETS) as DensityKey[];
    const contrastKeys = Object.keys(CONTRAST_PRESETS) as ContrastKey[];
    const fxOptions = FX_MODES.filter(f => f !== 'None');

    setTheme(pick(themeKeys));
    setDensity(pick(densityKeys));
    setContrast(pick(contrastKeys));
    setFxMode(pick(fxOptions));
    setLanguage(pick(NON_CUSTOM_LANGUAGES));
    setMirror(Math.random() > 0.5);
    setInvert(Math.random() > 0.7);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      switch (e.key.toLowerCase()) {
        case 'm': setMirror(v => !v); break;
        case 'i': setInvert(v => !v); break;
        case 'c': handleCapture(); break;
        case 'r': handleRecordToggle(); break;
        case ' ':
          e.preventDefault();
          handleRandomize();
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleCapture, handleRecordToggle, handleRandomize]);

  const isCameraReady = camState === 'active';

  return (
    <div className="relative w-screen h-screen bg-[#060606] overflow-hidden flex">
      {/* ── Left sidebar (lg+) ── */}
      {isCameraReady && (
        <SidePanel
          mirror={mirror}
          invert={invert}
          theme={theme}
          language={language}
          density={density}
          contrast={contrast}
          fxMode={fxMode}
          audioEnabled={audioEnabled}
          isRecording={isRecording}
          customText={customText}
          onMirrorToggle={() => setMirror(v => !v)}
          onInvertToggle={() => setInvert(v => !v)}
          onThemeChange={setTheme}
          onLanguageChange={setLanguage}
          onDensityChange={setDensity}
          onContrastChange={setContrast}
          onFxChange={setFxMode}
          onAudioToggle={() => setAudioEnabled(v => !v)}
          onCapture={handleCapture}
          onTimerCapture={() => setShowCountdown(true)}
          onRecordToggle={handleRecordToggle}
          onRandomize={handleRandomize}
          onCustomTextChange={setCustomText}
        />
      )}

      {/* ── Canvas area ── */}
      <div className="relative flex-1 h-full">
        {/* Portrait canvas — renders once camera is active */}
        {isCameraReady && (
          <PortraitCanvas
            ref={canvasRef}
            pills={pills}
            videoRef={videoRef}
            mirror={mirror}
            invert={invert}
            contrastPreset={contrast}
            fxMode={fxMode}
            audioData={audioData}
          />
        )}

        {/* Start overlay: shown when camera isn't active */}
        {!isCameraReady && (
          <StartOverlay state={camState} error={camError} onStart={startCamera} />
        )}

        {/* Countdown overlay */}
        {showCountdown && (
          <CountdownOverlay
            onCapture={handleCapture}
            onDone={() => setShowCountdown(false)}
          />
        )}

        {/* Mobile bottom bar — shown on small screens where SidePanel is hidden */}
        {isCameraReady && (
          <ControlPanel
            mirror={mirror}
            invert={invert}
            theme={theme}
            language={language}
            density={density}
            contrast={contrast}
            fxMode={fxMode}
            audioEnabled={audioEnabled}
            isRecording={isRecording}
            customText={customText}
            onMirrorToggle={() => setMirror(v => !v)}
            onInvertToggle={() => setInvert(v => !v)}
            onThemeChange={setTheme}
            onLanguageChange={setLanguage}
            onDensityChange={setDensity}
            onContrastChange={setContrast}
            onFxCycle={handleFxCycle}
            onAudioToggle={() => setAudioEnabled(v => !v)}
            onCapture={handleCapture}
            onTimerCapture={() => setShowCountdown(true)}
            onRecordToggle={handleRecordToggle}
            onRandomizeColors={handleRandomize}
            onCustomTextChange={setCustomText}
          />
        )}
      </div>
    </div>
  );
}
