// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.woff2') || assetInfo.name.endsWith('.woff') || assetInfo.name.endsWith('.ttf')) {
            return 'assets/fonts/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  }
});
