'use client';

import React from 'react';
import { CameraState } from '../hooks/useCamera';

interface StartOverlayProps {
  state: CameraState;
  error: string | null;
  onStart: () => void;
}

export default function StartOverlay({ state, error, onStart }: StartOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#060606]">
      {/* Animated background pills */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full text-[10px] font-bold whitespace-nowrap px-2 py-0.5"
            style={{
              left: `${(i * 37.3) % 110 - 5}%`,
              top: `${(i * 19.7) % 105 - 2}%`,
              backgroundColor: ['#FF3366','#FF6B35','#FFD700','#00FF88','#00BFFF','#9B59B6'][i % 6],
              color: '#000',
              animation: `float-pill ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 4}s`,
              transform: `rotate(${(i * 13) % 20 - 10}deg)`,
            }}
          >
            {['빛','그림자','사랑','꿈','시간','기억','공간','마음','소리','시작','光','愛','夢','海','空','love','dream','light','soul','wave','luz','alma'][i % 21]}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
        {/* Logo */}
        <div className="mb-2">
          <h1 className="text-5xl font-black tracking-tight text-white">
            typo<span className="text-[#FF3366]">face</span>
          </h1>
          <p className="text-white/50 text-sm tracking-widest mt-1 uppercase">
            typographic portrait
          </p>
        </div>

        {state === 'denied' || state === 'error' ? (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 px-6 py-4 max-w-sm">
              <p className="text-red-400 text-sm">
                {error ?? 'Camera access required to render your portrait.'}
              </p>
            </div>
            <button
              onClick={onStart}
              className="rounded-full px-8 py-3 bg-white text-black font-bold text-sm tracking-widest hover:bg-white/90 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : state === 'requesting' ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <p className="text-white/50 text-sm tracking-widest">Requesting camera&hellip;</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Your webcam feed is processed locally — no data is sent anywhere.
            </p>
            <button
              onClick={onStart}
              className="group relative rounded-full px-10 py-4 bg-white text-black font-bold text-sm tracking-widest hover:bg-white/90 transition-all shadow-2xl"
            >
              <span className="relative z-10">Enable Camera</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
            <p className="text-white/20 text-xs tracking-wider">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/40 font-mono">Space</kbd> to randomize colors
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
