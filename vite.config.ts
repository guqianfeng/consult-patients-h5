import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 80,
    host: true,
    open: true
  },
  plugins: [
    viteMockServe({
      mockPath: './src/mock',
      localEnabled: true
    }),
    vue({
      reactivityTransform: true
    }),
    Components({
      dts: false,
      // 原因：Toast Confirm 这类组件的样式还是需要单独引入，样式全局引入了，关闭自动引入
      resolvers: [VantResolver({ importStyle: false })]
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
    }),
    createHtmlPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
