/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    blue: '#3B82F6',
                    dark: '#1E40AF',
                },
                secondary: {
                    green: '#10B981',
                    yellow: '#F59E0B',
                    red: '#EF4444',
                },
                accent: {
                    red: '#DC2626',
                    orange: '#F97316',
                },
                bg: {
                    dark: '#0F172A',
                    card: '#1E293B',
                },
                text: {
                    primary: '#F1F5F9',
                    secondary: '#94A3B8',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
