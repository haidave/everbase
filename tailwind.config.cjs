/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        logo: 'var(--font-logo)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        '2xs': '0.6875rem', // 11px
      },
      textColor: {
        primary: 'hsl(var(--text-primary) / <alpha-value>)',
        'primary-reverse': 'hsl(var(--text-primary-reverse) / <alpha-value>)',
        secondary: 'hsl(var(--text-secondary) / <alpha-value>)',
        tertiary: 'hsl(var(--text-tertiary) / <alpha-value>)',
        label: 'hsl(var(--text-label) / <alpha-value>)',
      },
      backgroundColor: {
        app: 'hsl(var(--bg-app) / <alpha-value>)',
        base: 'hsl(var(--bg-base) / <alpha-value>)',
        subtle: 'hsl(var(--bg-subtle) / <alpha-value>)',
        primary: 'hsl(var(--bg-primary) / <alpha-value>)',
        'primary-hover': 'hsl(var(--bg-primary-hover) / <alpha-value>)',
        'primary-active': 'hsl(var(--bg-primary-active) / <alpha-value>)',
        'primary-reverse': 'hsl(var(--bg-primary-reverse) / <alpha-value>)',
        'primary-reverse-hover': 'hsl(var(--bg-primary-reverse-hover) / <alpha-value>)',
        'primary-reverse-active': 'hsl(var(--bg-primary-reverse-active) / <alpha-value>)',
        line: 'hsl(var(--border-line) / <alpha-value>)',
        border: 'hsl(var(--border-primary) / <alpha-value>)',
        'border-hover': 'hsl(var(--bg-border-hover) / <alpha-value>)',
        solid: 'hsl(var(--bg-solid) / <alpha-value>)',
        'solid-hover': 'hsl(var(--bg-solid-hover) / <alpha-value>)',
        'text-primary': 'hsl(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'hsl(var(--text-secondary) / <alpha-value>)',
      },
      borderColor: {
        line: 'hsl(var(--border-line) / <alpha-value>)',
        primary: 'hsl(var(--border-primary) / <alpha-value>)',
        'primary-hover': 'hsl(var(--border-primary-hover) / <alpha-value>)',
        'text-primary': 'hsl(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'hsl(var(--text-secondary) / <alpha-value>)',
        subtle: 'hsl(var(--bg-primary-hover) / <alpha-value>)',
      },
      boxShadow: {
        focus: 'var(--shadow-focus)',
      },
      spacing: {
        header: 'var(--space-header)',
      },
      keyframes: {
        shine: {
          '0%': {
            backgroundPosition: '0 0',
            opacity: '0',
          },
          '1%': {
            backgroundPosition: '0 0',
            opacity: '1',
          },
          '80%': {
            backgroundPosition: '180% 0',
            opacity: '1',
          },
          '85%': {
            opacity: '0',
          },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'button-shine': 'shine .6s linear forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
