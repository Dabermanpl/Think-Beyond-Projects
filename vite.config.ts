import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import locatorBabelJsx from '@locator/babel-jsx'

export default defineConfig(({ mode }) => ({
    base: '/Think-Beyond-Projects/',
    plugins: [
        react({
            babel: {
                plugins: mode === 'development'
                    ? [locatorBabelJsx]
                    : [],
            },
        }),
    ],
    server: {
        port: 5173,
    },
}))
