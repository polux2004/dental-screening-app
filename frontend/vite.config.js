import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const localApi = 'http://localhost:8000 http://127.0.0.1:8000'
const sharedPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
]

const securityHeaders = (development) => ({
  'Content-Security-Policy': [
    ...sharedPolicy,
    development ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'",
    development
      ? "script-src 'self' 'unsafe-inline'"
      : "script-src 'self'",
    development
      ? `connect-src 'self' ${localApi} ws://localhost:* ws://127.0.0.1:*`
      : `connect-src 'self' ${localApi}`,
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
})

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    headers: securityHeaders(true),
    proxy: {
      '/detect': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    },
  },
  preview: {
    headers: securityHeaders(false),
  },
})
