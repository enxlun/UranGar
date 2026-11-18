import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build:demo` бүх JS/CSS-ийг нэг HTML файлд багцалж,
// хаана ч нээж болох демо хувилбар гаргана.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'single' ? [react(), viteSingleFile()] : [react()],
  server: { host: true, port: 5173 },
}));
