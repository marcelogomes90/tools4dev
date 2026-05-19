import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
                mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular'],
            },
            colors: {
                surface: {
                    DEFAULT: 'hsl(var(--surface))',
                    foreground: 'hsl(var(--surface-foreground))',
                    muted: 'hsl(var(--surface-muted))',
                    border: 'hsl(var(--surface-border))',
                    accent: 'hsl(var(--surface-accent))',
                    'accent-hover': 'hsl(var(--surface-accent-hover))',
                    input: 'hsl(var(--surface-input))',
                    card: 'hsl(var(--surface-card))',
                },
            },
            boxShadow: {
                card: '0 18px 50px hsl(var(--surface-shadow) / 0.10), 0 1px 0 hsl(var(--surface-border) / 0.42)',
                lift: '0 24px 70px hsl(var(--surface-shadow) / 0.14), 0 8px 20px hsl(var(--surface-shadow) / 0.08)',
                inset: 'inset 0 1px 0 hsl(0 0% 100% / 0.55)',
            },
        },
    },
    plugins: [],
};

export default config;
