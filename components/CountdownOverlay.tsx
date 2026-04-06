'use client';

import React, { useEffect, useState } from 'react';

interface CountdownOverlayProps {
  onCapture: () => void;
  onDone: () => void;
}

export default function CountdownOverlay({ onCapture, onDone }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onCapture();
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onCapture, onDone]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
      <div
        key={count}
        className="text-white font-black select-none"
        style={{
          fontSize: 'clamp(6rem, 20vw, 14rem)',
          lineHeight: 1,
          textShadow: '0 0 60px rgba(255,51,102,0.8), 0 0 120px rgba(255,51,102,0.4)',
          animation: 'countdown-pop 0.9s ease-out forwards',
        }}
      >
        {count === 0 ? '✦' : count}
      </div>
    </div>
  );
}
