import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssTarget: 'safari16',
    // Inline anything under 4kb (the favicon, the grain filter) so the
    // page needs as few round trips as possible.
    assetsInlineLimit: 4096,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // Motion is by far the heaviest dependency. Giving it its own
        // chunk lets the browser fetch it in parallel with the app code
        // instead of serialising behind one large bundle.
        codeSplitting: {
          groups: [
            { name: 'motion', test: /node_modules[\\/](motion|motion-dom|motion-utils)[\\/]/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
})
