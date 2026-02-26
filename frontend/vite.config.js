import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  // GitHub Pages serves project under /<repo-name>/, so set base for production build.
  base: mode === 'production' ? process.env.VITE_BASE_PATH || '/qwiz/' : '/'
}))
