/** Ported 1:1 from the former inline `tailwind.config` of the CDN build (Tailwind 3). */
module.exports = {
  content: ['./src/**/*.{astro,md,ts,js}'],
  theme: {
    extend: {
      colors: {
        fire: '#CD2A3E', forest: '#436F4D',
        ink: '#1A1D21', warmgray: '#6B7280',
        sand: '#F8F6F2', line: '#E5E7EB',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: { tightish: '-0.02em' },
    },
  },
};
