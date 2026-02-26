/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#f0f4ff',
                    100: '#e0e9ff',
                    200: '#c1d4ff',
                    300: '#92b3ff',
                    400: '#5c87ff',
                    500: '#335eff',
                    600: '#1e3eff',
                    700: '#142ccf',
                    800: '#1326a7',
                    900: '#162883',
                    950: '#11184f',
                },
            },
            animation: {
                'gradient-x': 'gradient-x 15s ease infinite',
                'gradient-y': 'gradient-y 15s ease infinite',
                'gradient-xy': 'gradient-xy 15s ease infinite',
            },
            keyframes: {
                'gradient-y': {
                    '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'center top' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'center bottom' },
                },
                'gradient-x': {
                    '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
                'gradient-xy': {
                    '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                }
            }
        },
    },
    plugins: [],
}
