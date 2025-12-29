/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
        "./types.ts"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#E7F2FA',
                    100: '#C3DEEE',
                    200: '#9CC9E2',
                    300: '#75B4D6',
                    400: '#52A0CD',
                    500: '#3D8CBB',
                    600: '#105393', // Base/Action - WeVets Blue
                    700: '#0C3F71', // Darker/Text
                    800: '#082C4F',
                    900: '#04182C',
                    DEFAULT: '#105393',
                },
                secondary: {
                    DEFAULT: '#1FB7C1', // WeVets Teal
                    50: '#E6FBFC',
                    100: '#BFF4F6',
                    200: '#95EDF1',
                    300: '#6BE6EB',
                    400: '#41DFE5',
                    500: '#1FB7C1',
                    600: '#19929A',
                    700: '#126D74',
                    800: '#0C494D',
                    900: '#062427',
                },
                // Semantic aliases for better readability in clinical context
                status: {
                    error: '#EF4444',
                    success: '#10B981',
                    warning: '#F59E0B',
                    info: '#3B82F6',
                },
            },
            fontFamily: {
                sans: ['Figtree', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
            },
            animation: {
                'in': 'fadeIn 0.2s ease-out',
                'out': 'fadeOut 0.2s ease-in',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                }
            }
        },
    },
    plugins: [],
}
