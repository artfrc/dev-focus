/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F0F17',
        surface: '#1A1A26',
        surface2: '#20202E',
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
        },
        accent: '#F59E0B',
        border: '#2A2A3A',
        muted: '#9CA3AF',
        ink: '#F4F4F5',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
