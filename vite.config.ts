import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Fix for "global is not defined" error
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis', 
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['sockjs-client'], 
  },
});
