'use client';

import { useEffect, useRef, useState } from 'react';

export interface AudioData {
  bass: number;
  mid: number;
}

export function useAudioReactive(enabled: boolean): AudioData {
  const [data, setData] = useState<AudioData>({ bass: 0, mid: 0 });
  const rafRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Smoothing values
  const smoothBassRef = useRef(0);
  const smoothMidRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      // Cleanup
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      analyserRef.current = null;
      streamRef.current = null;
      smoothBassRef.current = 0;
      smoothMidRef.current = 0;
      setData({ bass: 0, mid: 0 });
      return;
    }

    let cancelled = false;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        source.connect(analyser);
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;

        const tick = () => {
          if (cancelled || !analyserRef.current || !dataArrayRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArrayRef.current as Uint8Array<ArrayBuffer>);

          // Bass: bins 0-4 (~0-344 Hz), Mid: bins 5-20 (~344-1376 Hz)
          let bassSum = 0;
          for (let i = 0; i <= 4; i++) bassSum += dataArrayRef.current[i];
          const bassRaw = bassSum / (5 * 255);

          let midSum = 0;
          for (let i = 5; i <= 20; i++) midSum += dataArrayRef.current[i];
          const midRaw = midSum / (16 * 255);

          // Smooth with exponential moving average
          const alpha = 0.2;
          smoothBassRef.current = smoothBassRef.current * (1 - alpha) + bassRaw * alpha;
          smoothMidRef.current = smoothMidRef.current * (1 - alpha) + midRaw * alpha;

          setData({ bass: smoothBassRef.current, mid: smoothMidRef.current });
          rafRef.current = requestAnimationFrame(tick);
        };

        tick();
      } catch {
        // Audio permission denied or not available — silently disable
        setData({ bass: 0, mid: 0 });
      }
    }

    init();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [enabled]);

  return data;
}
