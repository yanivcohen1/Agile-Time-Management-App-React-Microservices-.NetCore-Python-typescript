import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['tests/**'],
    pool: 'threads',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [
        'src/main.tsx',
        'src/setupTests.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.d.ts',
        '**/*.css',
        '**/*.svg',
      ],
    },
  },
})