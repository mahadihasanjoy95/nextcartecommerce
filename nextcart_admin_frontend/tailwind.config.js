/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Page shell ──────────────────────────────────────────────────
        admin: {
          bg:         '#F9FAFB',   // page background (gray-50)
          sidebar:    '#111827',   // sidebar (gray-900)
          sideHover:  '#1F2937',   // sidebar item hover (gray-800)
          sideActive: '#4F46E5',   // active nav item (indigo-600)

          // ── Cards & surfaces ──────────────────────────────────────────
          card:       '#FFFFFF',
          border:     '#E5E7EB',   // gray-200
          inputBorder:'#D1D5DB',   // gray-300

          // ── Brand colour ─────────────────────────────────────────────
          primary:    '#4F46E5',   // indigo-600
          priHover:   '#4338CA',   // indigo-700
          priLight:   '#EEF2FF',   // indigo-50

          // ── Semantic colours ─────────────────────────────────────────
          success:    '#059669',   // emerald-600
          successBg:  '#ECFDF5',   // emerald-50
          warning:    '#D97706',   // amber-600
          warningBg:  '#FFFBEB',   // amber-50
          danger:     '#DC2626',   // red-600
          dangerBg:   '#FEF2F2',   // red-50
          info:       '#0284C7',   // sky-600
          infoBg:     '#F0F9FF',   // sky-50

          // ── Typography ───────────────────────────────────────────────
          text:       '#111827',   // gray-900
          textSub:    '#6B7280',   // gray-500
          textMuted:  '#9CA3AF',   // gray-400
        },
      },

      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        panel: '0 4px 16px rgba(0,0,0,0.06)',
        modal: '0 20px 60px rgba(0,0,0,0.14)',
      },

      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
