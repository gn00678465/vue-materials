import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ tsconfigPath: './tsconfig.app.json' })
  ],
  build: {
    lib: {
      entry: {
        'admin-layout': resolve(__dirname, 'src/admin-layout/index.ts')
      },
      name: 'vue-materials',
      formats: ['es', 'cjs'],
      fileName: (format, name) => {
        if (format === 'cjs') return `${name}.cjs`
        if (format === 'es') return `${name}.mjs`
        return `${name}.${format}.js`
      }
    }
  },
})
