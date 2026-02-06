import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium warm gold palette
        primary: {
          50: '#fefdf8',
          100: '#fcf8eb',
          200: '#f8efd1',
          300: '#f2e0a8',
          400: '#e9c96e',
          500: '#d4a027',
          600: '#c18f1f',
          700: '#a1741a',
          800: '#855d1b',
          900: '#6e4c1a',
          950: '#40290c',
        },
        // Sophisticated dark neutrals
        secondary: {
          50: '#f7f6f5',
          100: '#edebe9',
          200: '#d9d5d1',
          300: '#c0b9b2',
          400: '#a59c92',
          500: '#8e837a',
          600: '#7a706a',
          700: '#645c57',
          800: '#544e4a',
          900: '#25211e',
          950: '#15130f',
        },
        // Cream accent
        accent: {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#fcf5ea',
          300: '#f9ecd8',
          400: '#f5dfc1',
          500: '#f0cea6',
          600: '#e5b77e',
          700: '#d69a52',
          800: '#b87a37',
          900: '#976331',
          950: '#523318',
        },
        // Rich dark backgrounds
        dark: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#cccccc',
          300: '#999999',
          400: '#666666',
          500: '#444444',
          600: '#2d2d2d',
          700: '#1f1f1f',
          800: '#171717',
          900: '#0f0e0d',
          950: '#080807',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.075em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.05em',
        wider: '0.1em',
        widest: '0.15em',
        ultra: '0.25em',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
        'glow-gold': '0 0 20px rgba(212, 160, 39, 0.3), 0 0 40px rgba(212, 160, 39, 0.1)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(212, 160, 39, 0.1)',
        'inner-gold': 'inset 0 0 0 1px rgba(212, 160, 39, 0.2)',
        // Luxury Premium Shadows
        'luxury': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.2)',
        'luxury-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 25px 50px -15px rgba(0, 0, 0, 0.2), 0 50px 100px -20px rgba(0, 0, 0, 0.15)',
        'luxury-gold': '0 10px 30px -10px rgba(0, 0, 0, 0.2), 0 20px 50px -20px rgba(212, 160, 39, 0.15), 0 0 0 1px rgba(212, 160, 39, 0.1)',
        'luxury-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.25), 0 30px 60px -20px rgba(212, 160, 39, 0.2), 0 0 60px rgba(212, 160, 39, 0.1)',
        'gold-glow-intense': '0 0 30px rgba(212, 160, 39, 0.4), 0 0 60px rgba(212, 160, 39, 0.2), 0 0 90px rgba(212, 160, 39, 0.1)',
        'gold-border': '0 0 0 2px rgba(212, 160, 39, 0.3), 0 0 20px rgba(212, 160, 39, 0.15)',
        'inset-luxury': 'inset 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(212, 160, 39, 0.1)',
        'dramatic': '0 35px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'underline-expand': 'underlineExpand 0.3s ease-out forwards',
        // Luxury Premium Animations
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
        'luxury-float': 'luxuryFloat 8s ease-in-out infinite',
        'marble-shift': 'marbleShift 15s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        underlineExpand: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        // Luxury Premium Keyframes
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 160, 39, 0.2), 0 0 40px rgba(212, 160, 39, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 160, 39, 0.4), 0 0 60px rgba(212, 160, 39, 0.2)' },
        },
        goldShimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(212, 160, 39, 0.3)' },
          '50%': { borderColor: 'rgba(212, 160, 39, 0.6)' },
        },
        luxuryFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) rotate(0.5deg)' },
          '50%': { transform: 'translateY(-15px) rotate(0deg)' },
          '75%': { transform: 'translateY(-8px) rotate(-0.5deg)' },
        },
        marbleShift: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #d4a027 0%, #f2e0a8 50%, #d4a027 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0f0e0d 0%, #25211e 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0f0e0d 0%, #25211e 50%, #15130f 100%)',
        'grid-pattern': 'linear-gradient(rgba(212, 160, 39, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 160, 39, 0.03) 1px, transparent 1px)',
        // Luxury Premium Gradients
        'gradient-luxury': 'linear-gradient(135deg, #0f0e0d 0%, #1a1918 25%, #25211e 50%, #1a1918 75%, #0f0e0d 100%)',
        'gradient-luxury-gold': 'linear-gradient(135deg, rgba(212, 160, 39, 0.05) 0%, rgba(212, 160, 39, 0.15) 50%, rgba(212, 160, 39, 0.05) 100%)',
        'gradient-marble': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.08) 100%)',
        'gradient-marble-dark': 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.02) 75%, rgba(0,0,0,0.05) 100%)',
        'gradient-gold-shine': 'linear-gradient(110deg, #d4a027 0%, #f2e0a8 25%, #d4a027 50%, #c18f1f 75%, #d4a027 100%)',
        'gradient-card-luxury': 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 50%, rgba(212, 160, 39, 0.02) 100%)',
        'gradient-overlay-luxury': 'linear-gradient(180deg, rgba(15,14,13,0.95) 0%, rgba(15,14,13,0.7) 50%, rgba(15,14,13,0.95) 100%)',
        'grid-luxury': 'linear-gradient(rgba(212, 160, 39, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 160, 39, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
    },
  },
  plugins: [],
}
export default config
