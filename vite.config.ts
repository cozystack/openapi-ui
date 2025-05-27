import path from 'path'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const { VITE_BASEPREFIX } = process.env
const { parsed: options } = await dotenv.config({ path: './.env.options' })

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: VITE_BASEPREFIX || '/openapi-ui',
  build: {
    outDir: 'build',
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  publicDir: 'public',
  plugins: [
    react(),
    federation({
      name: 'openapi-ui',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/federation.tsx',
      },
      shared: ['react', 'react-dom', 'react-redux', 'react-router-dom', 'antd', '@tanstack/react-query'],
    }),
    nodePolyfills({
      include: ['buffer', 'process', 'path'],
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      api: path.resolve(__dirname, './src/api'),
      components: path.resolve(__dirname, './src/components'),
      constants: path.resolve(__dirname, './src/constants'),
      localTypes: path.resolve(__dirname, './src/localTypes'),
      mocks: path.resolve(__dirname, './src/mocks'),
      pages: path.resolve(__dirname, './src/pages'),
      store: path.resolve(__dirname, './src/store'),
      templates: path.resolve(__dirname, './src/templates'),
      utils: path.resolve(__dirname, './src/utils'),
      hooks: path.resolve(__dirname, './src/hooks'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
    proxy: {
      '^/api/clusters/.*/k8s/': {
        target: `${options?.KUBE_API_URL}/api/clusters`,
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: path => path.replace(/^\/api\/clusters\//, '/'),
      },
      '/clusterlist': {
        target: `${options?.KUBE_API_URL}/clusterlist`,
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/clusterlist/, ''),
      },
    },
  },
})
