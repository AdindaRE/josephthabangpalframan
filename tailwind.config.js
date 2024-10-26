import flowbitePlugin from 'flowbite/plugin';
import aspectRatioPlugin from '@tailwindcss/aspect-ratio';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        openSans: ['Open Sans', 'sans-serif'],
      },
      colors: {
        black: '#221E1E',
        white: '#FFFFFF',
        customBlue: '#6DDAF2',
      },
      backgroundImage: {
        'hover-blue-gradient': 'radial-gradient(circle, rgba(0, 51, 102, 0.8), rgba(0, 51, 102, 0.4))',
        'hover-pink-gradient': 'radial-gradient(circle, rgba(61, 10, 48, 0.8), rgba(61, 10, 48, 0.4))',
        'hover-turquoise-gradient': 'radial-gradient(circle, rgba(0, 77, 64, 0.8), rgba(0, 77, 64, 0.4))',
        'radial-gradient': 'radial-gradient(circle, #fff, #f9d5e5)',
      },
      keyframes: {
        pulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        bounce: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scrollDown: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Marquee animation
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        // Staggered slide-in animations
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        pulse: 'pulse 1s ease-in-out infinite',
        bounce: 'bounce 1s ease-in-out infinite',
        fadeIn: 'fadeIn 0.8s ease-out',
        slideIn: 'slideIn 0.8s ease-out',
        scrollDown: 'scrollDown 2s ease-in-out infinite',
        'slide-in-left-1': 'slide-in-left 0.6s ease-out forwards',
        'slide-in-left-2': 'slide-in-left 0.6s ease-out forwards 0.2s',
        'slide-in-left-3': 'slide-in-left 0.6s ease-out forwards 0.4s',
        marquee: 'marquee 10s linear infinite', // Add this line
      },
    },
  },
  plugins: [flowbitePlugin, aspectRatioPlugin],
};
