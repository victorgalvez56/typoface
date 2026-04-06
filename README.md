# typoface

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Built With](https://img.shields.io/badge/built%20with-Next.js%2015-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss)

> Real-time typographic portrait — your webcam feed rendered as a mosaic of colored pill-shaped word badges.

![Demo placeholder](https://placehold.co/1200x630/060606/FF3366?text=typoface+demo)

---

## Description

**Typoface** captures your webcam stream and renders it as a dense grid of rounded Korean (or multi-language) word badges on a canvas. Each pill's opacity is computed from the local pixel brightness of the video frame — bright areas of your face produce opaque, vivid pills; shadows fade into the background. The result is a living, breathing typographic portrait.

All processing happens on-device, in your browser. No data is sent anywhere.

---

## Features

- 🎵 **Audio Reactive Mode** — AnalyserNode on your mic drives bass → pulse amplitude and mid → brightness
- 🌍 **Multi-language Word Pools** — Korean, Japanese, Arabic, English, Spanish, or fully custom text
- 🎨 **Named Color Themes** — K-Pop, Matrix, Sakura, Ocean, Fire, Neon, Mono, Pastel (8 total)
- 🌊 **Visual Effects** — Wave (sine ripple), Glitch (band shift), Breathe (sync pulse), or None
- ⏱ **Countdown Capture** — 3-2-1 animated overlay for hands-free snapshots
- 📷 **PNG Capture** — Save the current frame as a high-res PNG
- ⏺ **WebM Recording** — Record a video clip with one click
- ✏️ **Custom Text** — Type your own words; they replace the word pool live
- ⌨️ **Keyboard Shortcuts** — M, I, C, R, Space
- ⚡ **60fps Canvas** — Fully optimized render loop with pre-allocated Float32Array luminance buffers

---

## Tech Stack

| Layer        | Technology          |
|--------------|---------------------|
| Framework    | Next.js 15 (App Router) |
| Language     | TypeScript 5        |
| Styling      | Tailwind CSS 3      |
| Canvas       | Web Canvas API      |
| Camera       | getUserMedia        |
| Audio        | Web Audio API — AnalyserNode |
| Font         | Noto Sans KR (Google Fonts) |
| Recording    | MediaRecorder API   |

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/victorgalvez56/typoface.git
cd typoface

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:3000
```

---

## Available Controls

| Control      | Description                                      |
|--------------|--------------------------------------------------|
| Mirror       | Flip the canvas horizontally (selfie mode)       |
| Invert       | Invert the luminance map (dark face = lit pills) |
| Contrast     | Low / Normal / High / Extreme                    |
| Density      | Normal / Dense / Micro pill sizes                |
| FX           | Cycle Wave → Glitch → Breathe → None             |
| Audio        | Toggle mic-reactive pulse                        |
| Theme        | K-Pop, Matrix, Sakura, Ocean, Fire, Neon, Mono, Pastel |
| Random       | Randomize to a new theme                         |
| Language     | 🇰🇷 Korean, 🇯🇵 Japanese, 🇸🇦 Arabic, 🇺🇸 English, 🇪🇸 Spanish, ✏️ Custom |
| Capture      | Download PNG snapshot                            |
| Timer        | 3-2-1 countdown then capture                     |
| Record       | Start/stop WebM recording                        |

---

## Keyboard Shortcuts

| Key     | Action                    |
|---------|---------------------------|
| `M`     | Toggle mirror             |
| `I`     | Toggle invert             |
| `C`     | Capture PNG               |
| `R`     | Start / Stop recording    |
| `Space` | Randomize color theme     |

---

## How It Works

1. `getUserMedia` feeds into a hidden `<video>` element
2. Each frame, the video is drawn to an off-screen canvas with CSS contrast filter applied
3. `computeLumBuffers` reads the raw RGBA pixels and builds:
   - `lumBuf`: BT.601 luminance per pixel
   - `blurBuf`: 22×22-pixel block means for unsharp masking
4. For each pill, `getLum(cx, cy)` returns the enhanced luminance:
   `lum + (lum - blockMean) * 1.6`
5. Alpha is computed as `pow((lum - threshold) / (1-threshold), 0.75)`
6. A spring-like per-pill sine pulse modulates alpha and scale
7. Audio bass multiplies pulse amplitude; mid adds brightness
8. Visual effects (Wave, Glitch, Breathe) modify positions and phases
9. Pills are drawn with `ctx.roundRect` + text overlay

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a pull request

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

## Author

Made with care by **[victorgalvez56](https://github.com/victorgalvez56)**
