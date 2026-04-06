'use client';

import React, {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Pill } from '../lib/pills';
import { useLuminance } from '../hooks/useLuminance';
import { THRESHOLD, ALPHA_GAMMA, CONTRAST_PRESETS, ContrastKey, FxMode } from '../lib/constants';
import { hexWithAlpha } from '../lib/themes';
import { AudioData } from '../hooks/useAudioReactive';

export interface PortraitCanvasHandle {
  capture: () => void;
  startRecording: () => void;
  stopRecording: () => void;
}

interface PortraitCanvasProps {
  pills: Pill[];
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  mirror: boolean;
  invert: boolean;
  contrastPreset: ContrastKey;
  fxMode: FxMode;
  audioData: AudioData;
}

const PortraitCanvas = forwardRef<PortraitCanvasHandle, PortraitCanvasProps>(
  function PortraitCanvas(
    { pills, videoRef, mirror, invert, contrastPreset, fxMode, audioData },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const glitchRef = useRef<{ active: boolean; bands: number[]; frameCount: number }>({
      active: false,
      bands: [],
      frameCount: 0,
    });
    const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { computeLumBuffers, getLum } = useLuminance();

    // Glitch effect: trigger every 2s
    useEffect(() => {
      if (fxMode !== 'Glitch') {
        glitchRef.current.active = false;
        return;
      }

      function scheduleGlitch() {
        glitchTimerRef.current = setTimeout(() => {
          glitchRef.current.active = true;
          glitchRef.current.frameCount = 3;
          // Random horizontal bands (y positions)
          glitchRef.current.bands = Array.from({ length: 4 }, () =>
            Math.floor(Math.random() * window.innerHeight)
          );
          scheduleGlitch();
        }, 2000 + Math.random() * 1000);
      }

      scheduleGlitch();
      return () => {
        if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
        glitchRef.current.active = false;
      };
    }, [fxMode]);

    // Expose capture / record methods
    const capture = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `typoface-${Date.now()}.png`;
      a.click();
    }, []);

    const startRecording = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
      chunksRef.current = [];
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `typoface-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };
      recorder.start();
      recorderRef.current = recorder;
    }, []);

    const stopRecording = useCallback(() => {
      recorderRef.current?.stop();
      recorderRef.current = null;
    }, []);

    useImperativeHandle(ref, () => ({ capture, startRecording, stopRecording }), [
      capture,
      startRecording,
      stopRecording,
    ]);

    // Main render loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Ensure hidden canvas exists
      if (!hiddenCanvasRef.current) {
        hiddenCanvasRef.current = document.createElement('canvas');
      }
      const hCanvas = hiddenCanvasRef.current;
      const hCtx = hCanvas.getContext('2d', { willReadFrequently: true });
      if (!hCtx) return;

      let startT: number | null = null;

      function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      function drawFrame(ts: number) {
        if (!canvas || !ctx || !hCtx || !hCanvas) return;
        if (startT === null) startT = ts;
        const t = (ts - startT) / 1000; // seconds

        const W = canvas.width;
        const H = canvas.height;

        // Draw video to hidden canvas, applying contrast via filter
        const video = videoRef.current;
        if (!video || video.readyState < 2) {
          rafRef.current = requestAnimationFrame(drawFrame);
          return;
        }

        const vW = video.videoWidth || W;
        const vH = video.videoHeight || H;

        if (hCanvas.width !== W || hCanvas.height !== H) {
          hCanvas.width = W;
          hCanvas.height = H;
        }

        const contrast = CONTRAST_PRESETS[contrastPreset];
        hCtx.save();
        hCtx.filter = `contrast(${contrast}) ${invert ? 'invert(1)' : ''}`;

        // Mirror: flip horizontally so it feels like looking in a mirror
        if (mirror) {
          hCtx.translate(W, 0);
          hCtx.scale(-1, 1);
        }

        // Scale video to cover canvas
        const scale = Math.max(W / vW, H / vH);
        const sw = vW * scale;
        const sh = vH * scale;
        const sx = (W - sw) / 2;
        const sy = (H - sh) / 2;
        hCtx.drawImage(video, sx, sy, sw, sh);
        hCtx.restore();

        // Read pixel data
        const imageData = hCtx.getImageData(0, 0, W, H);
        const px = imageData.data;

        // Compute luminance buffers
        const lumBuf = computeLumBuffers(px, W, H);

        // Clear main canvas
        ctx.fillStyle = '#060606';
        ctx.fillRect(0, 0, W, H);

        const THR = THRESHOLD;
        const audioBassMul = 1 + audioData.bass * 1.5; // bass amplifies pulse
        const audioMidBright = audioData.mid * 0.15; // mid adds brightness

        // Glitch state
        const glitch = glitchRef.current;
        if (glitch.active && glitch.frameCount > 0) {
          glitch.frameCount--;
          if (glitch.frameCount === 0) glitch.active = false;
        }

        for (let i = 0; i < pills.length; i++) {
          const p = pills[i];

          // Compute enhanced luminance at pill center
          let lum = getLum(p.cx, p.cy, lumBuf);
          lum = Math.min(1, lum + audioMidBright);

          if (lum <= THR) continue;

          // Alpha mapping
          const normLum = (lum - THR) / (1 - THR);
          let alpha = Math.pow(normLum, ALPHA_GAMMA);

          // Per-pill spring-like pulse
          let pulse: number;
          if (fxMode === 'Breathe') {
            // All pills breathe in sync at 0.8 Hz
            pulse = Math.sin(t * 0.8 * Math.PI * 2);
          } else {
            pulse = Math.sin(t * p.speed * Math.PI * 2 + p.phase);
          }

          alpha *= 0.72 + 0.28 * pulse;
          alpha = Math.max(0, Math.min(1, alpha));

          if (alpha < 0.01) continue;

          // Scale factor
          const pulseAmp = p.pulseAmp * audioBassMul;
          const sc = 1 + pulseAmp * pulse;

          // Position with effects
          let px2 = p.x;
          let py2 = p.y;

          if (fxMode === 'Wave') {
            // Ripple sine wave across screen
            py2 += Math.sin(p.cx / 80 + t * 3) * 8;
          }

          if (fxMode === 'Glitch' && glitch.active) {
            // Shift horizontal bands
            for (const bandY of glitch.bands) {
              if (Math.abs(p.cy - bandY) < 30) {
                px2 += (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 15);
                break;
              }
            }
          }

          // Draw pill
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(px2 + p.w / 2, py2 + p.h / 2);
          ctx.scale(sc, sc);

          const hw = p.w / 2;
          const hh = p.h / 2;

          ctx.beginPath();
          ctx.roundRect(-hw, -hh, p.w, p.h, p.r);
          ctx.fillStyle = hexWithAlpha(p.color, 1);
          ctx.fill();

          // Black text on pill
          ctx.font = p.fontStr;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgba(0,0,0,0.85)';
          ctx.fillText(p.text, 0, 0);

          ctx.restore();
        }

        rafRef.current = requestAnimationFrame(drawFrame);
      }

      rafRef.current = requestAnimationFrame(drawFrame);

      return () => {
        window.removeEventListener('resize', resize);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [pills, videoRef, mirror, invert, contrastPreset, fxMode, audioData, computeLumBuffers, getLum]);

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
    );
  }
);

export default PortraitCanvas;
