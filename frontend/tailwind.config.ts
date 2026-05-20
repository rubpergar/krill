import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a0a0f',
          card: '#14141f',
          elevated: '#1c1c2e',
          hover: '#262640',
        },
        primary: {
          DEFAULT: '#22d3ee',
          hover: '#06b6d4',
          muted: '#155e75',
        },
        muted: {
          DEFAULT: '#73738c',
          foreground: '#a1a1b5',
        },
        border: {
          DEFAULT: '#2a2a3e',
          light: '#3a3a4e',
        },
      },
      borderRadius: {
        bento: '1rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
