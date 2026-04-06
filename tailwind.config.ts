import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#060606',
        accent: '#FF3366',
      },
      fontFamily: {
        sans: ['var(--font-noto-kr)', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
