import Link from 'next/link';

const features = [
  {
    icon: '🎵',
    title: 'Audio Reactive',
    desc: 'Pills pulse to the beat of your mic — bass drives the amplitude, mid shapes the brightness.',
  },
  {
    icon: '🌍',
    title: 'Multi-language',
    desc: 'Render your portrait in Korean, Japanese, Arabic, English, Spanish, or your own custom words.',
  },
  {
    icon: '🎨',
    title: 'Named Themes',
    desc: '8 curated color palettes — K-Pop, Matrix, Sakura, Ocean, Fire, Neon, Mono, Pastel.',
  },
  {
    icon: '🌊',
    title: 'Visual Effects',
    desc: 'Wave ripple, Glitch bands, and Breathe sync — cycle through live FX with one button.',
  },
  {
    icon: '📷',
    title: 'Capture & Record',
    desc: 'Save a PNG snapshot or record a WebM video. Timer mode for hands-free capture.',
  },
  {
    icon: '⚡',
    title: 'Real-time Canvas',
    desc: 'All processing runs on-device via requestAnimationFrame — zero backend, zero latency.',
  },
];

const WORDS_PREVIEW = [
  { text: '빛', color: '#FF3366' },
  { text: '그림자', color: '#FF6B35' },
  { text: '사랑', color: '#FFD700' },
  { text: '꿈', color: '#00FF88' },
  { text: '시간', color: '#00BFFF' },
  { text: '기억', color: '#9B59B6' },
  { text: 'love', color: '#FF1493' },
  { text: 'light', color: '#00CED1' },
  { text: '自然', color: '#FF4500' },
  { text: '時間', color: '#7FFF00' },
  { text: 'alma', color: '#FF3366' },
  { text: 'نور', color: '#FFD700' },
  { text: 'dream', color: '#00FF88' },
  { text: '空', color: '#00BFFF' },
  { text: 'luz', color: '#FF6B35' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060606] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated pill background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-bg-grid" />
          {WORDS_PREVIEW.map((w, i) => (
            <div
              key={i}
              className="absolute rounded-full px-3 py-1 text-sm font-bold text-black select-none"
              style={{
                backgroundColor: w.color,
                left: `${(i * 7.3 + 5) % 90}%`,
                top: `${(i * 13.7 + 3) % 90}%`,
                opacity: 0.15 + (i % 5) * 0.06,
                animation: `float-hero ${4 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.4) % 5}s`,
                transform: `rotate(${(i * 11) % 20 - 10}deg)`,
              }}
            >
              {w.text}
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-3xl">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs text-white/50 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366] animate-pulse" />
            Real-time &bull; Open source &bull; On-device
          </div>

          <h1 className="font-black tracking-tight leading-none">
            <span
              className="block text-5xl sm:text-7xl md:text-8xl text-white"
              style={{ letterSpacing: '-0.03em' }}
            >
              타이포그래픽
            </span>
            <span
              className="block text-5xl sm:text-7xl md:text-8xl"
              style={{ letterSpacing: '-0.03em', color: '#FF3366' }}
            >
              포트레이트
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-white/50 font-light">
            Your face, written in words.
          </p>

          <p className="text-white/30 max-w-lg text-sm leading-relaxed">
            Typoface turns your webcam feed into a living mosaic of colored pill-shaped word badges.
            Brightness maps to opacity — your portrait emerges, letter by letter.
          </p>

          <Link
            href="/studio"
            className="group mt-2 inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-black font-bold text-sm tracking-widest hover:bg-white/90 transition-all shadow-2xl shadow-white/10"
          >
            Open Studio
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <p className="text-white/20 text-xs">
            No sign-up. No data sent. Works entirely in your browser.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-bounce">
          <div className="w-px h-8 bg-white/40" />
          <span className="text-xs text-white/40 tracking-widest">scroll</span>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black tracking-tight text-white">What makes it special</h2>
          <p className="text-white/30 mt-3 text-sm">Everything runs at 60fps, locally, in your browser.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/6 bg-white/3 p-6 hover:bg-white/5 hover:border-white/10 transition-all group"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-white text-sm tracking-wide mb-2">{f.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="px-6 py-16 text-center">
        <div className="inline-flex flex-col items-center gap-4">
          <p className="text-white/30 text-sm tracking-widest uppercase">Ready to see yourself in words?</p>
          <Link
            href="/studio"
            className="rounded-full bg-[#FF3366] px-10 py-4 text-white font-bold text-sm tracking-widest hover:bg-[#ff1a57] transition-all shadow-2xl shadow-[#FF3366]/20"
          >
            Launch Studio →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-lg">
              typo<span className="text-[#FF3366]">face</span>
            </span>
            <span className="text-white/20 text-xs">v0.1.0</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/30">
            <a
              href="https://github.com/victorgalvez56/typoface"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/victorgalvez56"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              @victorgalvez56
            </a>
            <span>MIT License</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
