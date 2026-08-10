import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('tesseract') || 
              id.includes('html2canvas') || 
              id.includes('zxing-wasm') || 
              id.includes('receipt-printer-encoder')
            ) {
              return 'vendor-heavy';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
