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
      },
      textColor: {
        primary: 'var(--text-primary)',
        'primary-reverse': 'var(--text-primary-reverse)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
      },
      backgroundColor: {
        base: 'var(--bg-base)',
        subtle: 'var(--bg-subtle)',
        primary: 'var(--bg-primary)',
        'primary-hover': 'var(--bg-primary-hover)',
        'primary-active': 'var(--bg-primary-active)',
        'primary-reverse': 'var(--bg-primary-reverse)',
        'primary-reverse-hover': 'var(--bg-primary-reverse-hover)',
        'primary-reverse-active': 'var(--bg-primary-reverse-active)',
        line: 'var(--border-line)',
        border: 'var(--border-primary)',
        'border-hover': 'var(--bg-border-hover)',
        solid: 'var(--bg-solid)',
        'solid-hover': 'var(--bg-solid-hover)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      borderColor: {
        line: 'var(--border-line)',
        primary: 'var(--border-primary)',
        'primary-hover': 'var(--border-primary-hover)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        subtle: 'var(--bg-primary-hover)',
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
