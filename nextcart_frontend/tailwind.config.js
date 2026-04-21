/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // ─── Brand colour palette ───────────────────────────────────────────
      colors: {
        brand: {
          // Rose-pink scale  (primary actions, badges, accents)
          pink: {
            50:  '#FFF0F3',
            100: '#FFE2EA',
            200: '#FFBECE',
            300: '#FF8FAD',
            400: '#FF5C88',
            500: '#F43F6E',   // ← main CTA colour
            600: '#D92255',
            700: '#B4103F',
          },
          // Amber-yellow scale (accent badges, highlights, stars)
          yellow: {
            50:  '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',   // ← main accent colour
            500: '#F59E0B',
          },
        },
        // Warm off-white used as page background
        surface: '#FFFBF8',
      },

      // ─── Typography ─────────────────────────────────────────────────────
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },

      // ─── Shadows ────────────────────────────────────────────────────────
      boxShadow: {
        nav:        '0 2px 20px rgba(0, 0, 0, 0.06)',
        card:       '0 4px 24px rgba(244, 63, 110, 0.07)',
        'card-hover': '0 16px 48px rgba(244, 63, 110, 0.18)',
        glow:       '0 0 30px rgba(244, 63, 110, 0.25)',
      },

      // ─── Custom animations ───────────────────────────────────────────────
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.45s ease-out',
        'skeleton':   'skeleton 1.6s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },

      // ─── Aspect ratios ────────────────────────────────────────────────
      aspectRatio: {
        'product': '3 / 4',
      },
    },
  },
  plugins: [],
}
