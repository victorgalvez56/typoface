'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type CameraState = 'idle' | 'requesting' | 'active' | 'denied' | 'error';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>('idle');
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;

      if (!videoRef.current) {
        // Create a hidden video element
        const video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.muted = true;
        video.style.position = 'fixed';
        video.style.opacity = '0';
        video.style.pointerEvents = 'none';
        video.style.width = '1px';
        video.style.height = '1px';
        document.body.appendChild(video);
        videoRef.current = video;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setState('active');
    } catch (err: unknown) {
      const e = err as Error;
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setState('denied');
        setError('Camera permission denied.');
      } else {
        setState('error');
        setError(e.message ?? 'Camera error.');
      }
    }
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState('idle');
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return { videoRef, streamRef, state, error, start, stop };
}
