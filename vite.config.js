import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';


export default defineConfig({
  plugins: [react()],
  cacheDir: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <--- make sure this exists
    },
  }

});
