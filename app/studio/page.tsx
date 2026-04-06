'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import PortraitCanvas, { PortraitCanvasHandle } from '../../components/PortraitCanvas';
import ControlPanel from '../../components/ControlPanel';
import StartOverlay from '../../components/StartOverlay';
import CountdownOverlay from '../../components/CountdownOverlay';
import { useCamera } from '../../hooks/useCamera';
import { usePillLayout } from '../../hooks/usePillLayout';
import { useAudioReactive } from '../../hooks/useAudioReactive';
import { THEMES, ThemeKey } from '../../lib/themes';
import { LanguageKey } from '../../lib/languages';
import { DensityKey, ContrastKey, FxMode, FX_MODES } from '../../lib/constants';

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

  const handleRandomizeColors = useCallback(() => {
    const keys = Object.keys(THEMES) as ThemeKey[];
    const randomTheme = keys[Math.floor(Math.random() * keys.length)];
    setTheme(randomTheme);
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
          handleRandomizeColors();
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleCapture, handleRecordToggle, handleRandomizeColors]);

  const isCameraReady = camState === 'active';

  return (
    <div className="relative w-screen h-screen bg-[#060606] overflow-hidden">
      {/* Portrait canvas — always mounted, renders once camera is active */}
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

      {/* Control panel — always visible when camera is ready */}
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
          onRandomizeColors={handleRandomizeColors}
          onCustomTextChange={setCustomText}
        />
      )}
    </div>
  );
}
