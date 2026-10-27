import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Expose ONLY these two public values, never the entire environment.
  return {
    base: './',
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || ''),
      'import.meta.env.SUPABASE_PUBLISHABLE_KEY': JSON.stringify(env.SUPABASE_PUBLISHABLE_KEY || ''),
    },
    server: { port: 5173, strictPort: true, open: '/login.html' },
    build: { rollupOptions: { input: {
      index: fileURLToPath(new URL('./index.html', import.meta.url)),
      login: fileURLToPath(new URL('./login.html', import.meta.url)),
      profile: fileURLToPath(new URL('./profile.html', import.meta.url)),
    } } },
  };
});
