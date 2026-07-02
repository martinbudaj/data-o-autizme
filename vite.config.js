import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo under /data-o-autizme/, and the dashboard
// is embedded into a foreign page via a fixed asset path, so both the
// base path and the output file names must stay stable across builds.
export default defineConfig({
  plugins: [react()],
  base: '/data-o-autizme/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/app.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/app.css'
          }
          return 'assets/[name][extname]'
        },
      },
    },
  },
})
