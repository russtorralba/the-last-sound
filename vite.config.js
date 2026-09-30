import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'The Last Sound',
        short_name: 'Last Sound',
        description: 'A listening puzzle game where you restore lost melodies one sound at a time.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#293657',
        background_color: '#f9f0dc',
        icons: [
          { src: '/the-last-sound-icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/the-last-sound-icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/the-last-sound-icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
})
