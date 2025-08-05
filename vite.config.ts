import path from "path";

// Avoid importing Vite or plugins during config evaluation to prevent ESM resolution issues.
// Provide a minimal config that does not depend on '@vitejs/plugin-react-swc' or other packages here.
const dc = (cfg: any) => cfg;

export default dc(({ mode }: { mode: string }) => ({
  base: mode === 'production' ? '/kaya-demo/' : '/',
  server: {
    host: true,
    port: 8080,
  },
  // Run without plugin-react-swc to avoid module resolution failures. Vite will still serve TS/JS.
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
}));
