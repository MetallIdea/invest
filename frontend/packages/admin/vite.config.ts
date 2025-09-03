import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default (configEnv: ConfigEnv) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(configEnv.mode, process.cwd(), '') }

  // https://vite.dev/config/
  return defineConfig({
    base: process.env.VITE_APP_BASE_URL,
    plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:4001',
      },
    }
  })
}