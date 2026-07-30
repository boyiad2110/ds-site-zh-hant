import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { sourcemap: true },
  // shared/canon-format.mjs 在 repo 根目錄，與驗收頁腳本共用；dev server 預設只允許
  // 讀取 web/ 以內，故放行上一層。正式建置由 Rollup 解析，不受此設定影響。
  server: { fs: { allow: ['..'] } },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
