import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary))',
        secondary: 'rgb(var(--color-secondary))',
        accent: 'rgb(var(--color-accent))',
        'accent-hover': 'rgb(var(--color-accent-hover))',
        'background-primary': 'rgb(var(--color-background-primary))',
        'background-secondary': 'rgb(var(--color-background-secondary))',
        'background-tertiary': 'rgb(var(--color-background-tertiary))',
        'text-primary': 'rgb(var(--color-text-primary))',
        'text-secondary': 'rgb(var(--color-text-secondary))',
        'text-tertiary': 'rgb(var(--color-text-tertiary))',
        'text-on-dark-primary': 'rgb(var(--color-text-on-dark-primary))',
        'text-on-dark-secondary': 'rgb(var(--color-text-on-dark-secondary))',
        'text-light': 'rgb(var(--color-text-light))',
        'border-light': 'rgb(var(--color-border-light))',
        'border-dark': 'rgb(var(--color-border-dark) / var(--color-border-dark-opacity))',
        'shadow': 'rgb(var(--color-shadow) / var(--color-shadow-opacity))',
        'hamburger-lines': 'rgb(var(--color-hamburger-lines))',
        'hamburger-background': 'rgb(var(--color-hamburger-background))',
        'hamburger-text': 'rgb(var(--color-hamburger-text))',
        'modal-overlay': 'rgb(var(--color-modal-overlay))',
        'modal-text': 'rgb(var(--color-modal-text))',
        'modal-text-muted': 'rgb(var(--color-modal-text-muted) / var(--color-modal-text-muted-opacity))',
        'modal-background': 'rgb(var(--color-modal-background) / var(--color-modal-background-opacity))',
        'modal-border': 'rgb(var(--color-modal-border) / var(--color-modal-border-opacity))',
        'progress-background': 'rgb(var(--color-progress-background) / var(--color-progress-background-opacity))',
        'footer-text': 'rgb(var(--color-footer-text))',
        'footer-text-muted': 'rgb(var(--color-footer-text-muted) / var(--color-footer-text-muted-opacity))',
        'footer-border': 'rgb(var(--color-footer-border) / var(--color-footer-border-opacity))',
        'footer-underline': 'rgb(var(--color-footer-underline))',
        'footer-background': 'rgb(var(--color-footer-background))',
      },
      fontFamily: {
        satoshi: ['var(--font-satoshi)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      maxWidth: {
        '7xl': '80rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
} satisfies Config