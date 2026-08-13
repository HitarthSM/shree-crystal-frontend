/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Heritage Saffron palette
        'deep-saffron': '#6B2D00',
        'deep-saffron-hover': '#5A2600',
        'deep-saffron-light': '#8B3D00',
        ivory: '#FAF5E8',
        'ivory-dark': '#F0E9D8',
        'ivory-darker': '#E6DBCA',
        'warm-gold': '#C8862C',
        'warm-gold-hover': '#B07524',
        'warm-gold-light': '#D9973D',
        'verdant-green': '#2A5C3F',
        'verdant-green-light': '#3A7A55',
        'deep-crimson': '#8B1A1A',
        'deep-crimson-light': '#A32020',
        'dark-mahogany': '#2C1A0E',
        'mahogany-muted': '#6B4E3D',
        // Neutral
        'warm-white': '#FFFFFF',
        'ledger-rule': 'rgba(44,26,14,0.12)', // thin 1px rule color
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        data: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['2rem', { lineHeight: '1.15', fontWeight: '600' }],
        'display-sm': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'data-lg': ['1.25rem', { lineHeight: '1.3' }],
        'data': ['0.9375rem', { lineHeight: '1.4' }],
        'data-sm': ['0.8125rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        DEFAULT: '6px',
        btn: '4px',
        badge: '4px',
        card: '6px',
      },
      boxShadow: {
        'paper': '0 1px 0 rgba(44,26,14,0.08)',
        'paper-md': '0 2px 4px rgba(44,26,14,0.08), 0 1px 0 rgba(44,26,14,0.06)',
        'card': '0 1px 2px rgba(44,26,14,0.06), 0 1px 0 rgba(44,26,14,0.04)',
      },
      keyframes: {
        // Brass stamp drop-and-settle — the SINGLE orchestrated animation
        stampDrop: {
          '0%': { transform: 'scale(1.15) rotate(3deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        // Skeleton shimmer
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Fade + slide up (hero entrance)
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Slide in from right (login form)
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        // Toast slide in
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'stamp-drop': 'stampDrop 150ms ease-out forwards',
        'shimmer': 'shimmer 1.6s linear infinite',
        'fade-slide-up': 'fadeSlideUp 400ms ease-out forwards',
        'slide-in-right': 'slideInRight 350ms ease-out forwards',
        'toast-in': 'toastIn 200ms ease-out forwards',
      },
      transitionDuration: {
        '120': '120ms',
        '150': '150ms',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        'reading': '720px',
        'content': '1200px',
      },
    },
  },
  plugins: [],
}
