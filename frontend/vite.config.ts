import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // UI libraries
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            // Router and state management
            if (id.includes('react-router') || id.includes('@tanstack/react-query')) {
              return 'router-query';
            }
            // Charts and animations
            if (id.includes('recharts') || id.includes('framer-motion')) {
              return 'charts-animations';
            }
            // Utilities and smaller libraries
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'utilities';
            }
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Other vendor libraries
            return 'vendor';
          }
          
          // App code chunking
          if (id.includes('/pages/Dashboard.tsx')) {
            return 'dashboard';
          }
          if (id.includes('/pages/') && (id.includes('StudentDashboard') || id.includes('Booking'))) {
            return 'heavy-pages';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
