export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ink: '#0C1220',
                surface: '#141C2F',
                'surface-raised': '#1B2540',
                gold: '#D4A94A',
                emerald: '#34D399',
                rose: '#F87171',
                'ink-text': '#EDEFF3',
                muted: '#8A93A6',
            },
            fontFamily: {
                display: ['Fraunces', 'serif'],
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}