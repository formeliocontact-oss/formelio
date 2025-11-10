import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      /* Typography - Professional Legal Platform */
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Enhanced scale for legal documents
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],
        'base': ['1rem', { lineHeight: '1.625', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.625', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.375', letterSpacing: '-0.015em' }],
        '3xl': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
      },

      /* Spacing - Semantic tokens for layouts */
      spacing: {
        // Component spacing
        'component-xs': '0.5rem',   // 8px - tight spacing
        'component-sm': '0.75rem',  // 12px - compact components
        'component': '1rem',        // 16px - default component spacing
        'component-lg': '1.5rem',   // 24px - comfortable spacing
        'component-xl': '2rem',     // 32px - generous spacing

        // Section spacing
        'section-xs': '2rem',       // 32px - minimal section
        'section-sm': '3rem',       // 48px - compact section
        'section': '4rem',          // 64px - default section
        'section-lg': '6rem',       // 96px - large section
        'section-xl': '8rem',       // 128px - hero sections

        // Content spacing
        'content-xs': '1rem',       // 16px - tight content
        'content-sm': '1.5rem',     // 24px - compact content
        'content': '2rem',          // 32px - default content
        'content-lg': '3rem',       // 48px - generous content
      },

      /* Max widths - Reading comfort for legal documents */
      maxWidth: {
        'prose-legal': '75ch',      // Optimal for legal text
        'prose-narrow': '65ch',     // Narrow reading column
        'form': '32rem',            // 512px - forms
        'card': '28rem',            // 448px - cards
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1536px',
      },
    },
  },
  plugins: [],
};
export default config;
