import { resolve } from 'path'
import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ tsconfigPath: './tsconfig.app.json' })
  ],
  resolve: {
    alias: {
      vue: fileURLToPath(new URL("./node_modules/vue/dist/vue.esm-bundler.js", import.meta.url))
    }
  },
  build: {
    lib: {
      entry: {
        'admin-layout': resolve(__dirname, 'src/admin-layout/index.ts'),
        'primitive': resolve(__dirname, 'src/primitive/index.ts'),
        'utils': resolve(__dirname, 'src/utils/index.ts')
      },
      name: 'vue-materials',
      formats: ['es', 'cjs'],
      fileName: (format, name) => {
        if (format === 'cjs') return `${name}.cjs`
        if (format === 'es') return `${name}.mjs`
        return `${name}.${format}.js`
      }
    },
    rollupOptions: {
      external: ['vue', 'fsevents'],
      output: {
        globals: {
          'vue': 'Vue'
        }
      }
    }
  },
})
