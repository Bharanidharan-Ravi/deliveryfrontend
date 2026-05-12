// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: 'class', // 🚀 Tells Tailwind to look for the "dark" class on the HTML tag
//   content: [
//     './index.html',
//     './src/**/*.{js,jsx}',
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//       },
//       // 🚀 Changed from Hex to CSS Variables
//       colors: {
//         background: 'rgb(var(--background))',
//         foreground: 'rgb(var(--foreground))',
//         card: 'rgb(var(--card))',
//         muted: 'rgb(var(--muted))',
//         border: 'rgb(var(--border))',
//         primary: 'rgb(var(--primary))',
//       },
//       animation: {
//         'scan-line': 'scan-line 2.5s ease-in-out infinite',
//         'bounce-in': 'bounce-in 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both',
//         'fade-in': 'fade-in 0.25s ease both',
//         'slide-up': 'slide-up 0.35s ease both',
//       },
//       keyframes: {
//         'scan-line': {
//           '0%': { top: '0', opacity: '1' },
//           '50%': { top: '100%', opacity: '0.6' },
//           '100%': { top: '0', opacity: '1' },
//         },
//         'bounce-in': {
//           '0%': { transform: 'scale(0.5)', opacity: '0' },
//           '60%': { transform: 'scale(1.15)', opacity: '1' },
//           '100%': { transform: 'scale(1)' },
//         },
//         'fade-in': {
//           from: { opacity: '0', transform: 'translateY(4px)' },
//           to: { opacity: '1', transform: 'translateY(0)' },
//         },
//         'slide-up': {
//           from: { opacity: '0', transform: 'translateY(24px)' },
//           to: { opacity: '1', transform: 'translateY(0)' },
//         },
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        surface: '#111827',
        'surface-light': '#1f2937',
        muted: '#6b7280',
        bg: '#0a0f1e',
      },
      animation: {
        'scan-line': 'scan-line 2.5s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both',
        'fade-in': 'fade-in 0.25s ease both',
        'slide-up': 'slide-up 0.35s ease both',
      },
      keyframes: {
        'scan-line': {
          '0%': { top: '0', opacity: '1' },
          '50%': { top: '100%', opacity: '0.6' },
          '100%': { top: '0', opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
