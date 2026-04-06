'use client';

import { useRef, useCallback } from 'react';
import { BS, ENHANCE } from '../lib/constants';

interface LumBuffers {
  lumBuf: Float32Array;
  blurBuf: Float32Array;
  W: number;
  H: number;
}

export function useLuminance() {
  const bufRef = useRef<LumBuffers | null>(null);

  const allocLumBuffers = useCallback((W: number, H: number): LumBuffers => {
    const numBlocks = Math.ceil(W / BS) * Math.ceil(H / BS);
    return {
      lumBuf: new Float32Array(W * H),
      blurBuf: new Float32Array(numBlocks),
      W,
      H,
    };
  }, []);

  const getOrAlloc = useCallback(
    (W: number, H: number): LumBuffers => {
      if (!bufRef.current || bufRef.current.W !== W || bufRef.current.H !== H) {
        bufRef.current = allocLumBuffers(W, H);
      }
      return bufRef.current;
    },
    [allocLumBuffers]
  );

  /**
   * Fill lumBuf with per-pixel luminance (0-1) from raw RGBA pixel data.
   * Fill blurBuf with mean luminance per BS×BS block.
   */
  const computeLumBuffers = useCallback(
    (px: Uint8ClampedArray, W: number, H: number): LumBuffers => {
      const buf = getOrAlloc(W, H);
      const { lumBuf, blurBuf } = buf;
      const bCols = Math.ceil(W / BS);

      // Fill lumBuf
      for (let i = 0; i < W * H; i++) {
        const o = i * 4;
        // BT.601 luma
        lumBuf[i] = (px[o] * 0.299 + px[o + 1] * 0.587 + px[o + 2] * 0.114) / 255;
      }

      // Fill blurBuf (block means)
      blurBuf.fill(0);
      const counts = new Uint32Array(blurBuf.length);
      for (let y = 0; y < H; y++) {
        const by = Math.floor(y / BS);
        for (let x = 0; x < W; x++) {
          const bx = Math.floor(x / BS);
          const bi = by * bCols + bx;
          blurBuf[bi] += lumBuf[y * W + x];
          counts[bi]++;
        }
      }
      for (let i = 0; i < blurBuf.length; i++) {
        if (counts[i] > 0) blurBuf[i] /= counts[i];
      }

      return buf;
    },
    [getOrAlloc]
  );

  /**
   * Return the enhanced luminance for pixel at (cx, cy).
   * Uses unsharp mask: lum + (lum - mean) * ENHANCE, clamped to [0,1].
   */
  const getLum = useCallback(
    (cx: number, cy: number, buf: LumBuffers): number => {
      const { lumBuf, blurBuf, W } = buf;
      const ix = Math.max(0, Math.min(W - 1, Math.round(cx)));
      const iy = Math.max(0, Math.min(buf.H - 1, Math.round(cy)));
      const local = lumBuf[iy * W + ix];
      const bCols = Math.ceil(W / BS);
      const bx = Math.floor(ix / BS);
      const by = Math.floor(iy / BS);
      const mean = blurBuf[by * bCols + bx];
      const enhanced = local + (local - mean) * ENHANCE;
      return Math.max(0, Math.min(1, enhanced));
    },
    []
  );

  return { computeLumBuffers, getLum };
}
