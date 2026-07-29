import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const serverDir = resolve(root, 'dist/server')
mkdirSync(serverDir, { recursive: true })
writeFileSync(resolve(serverDir, 'index.js'), `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (request.method === 'GET' && response.status === 404) {
      const fallback = new URL('/index.html', request.url)
      return env.ASSETS.fetch(new Request(fallback, request))
    }
    return response
  },
}\n`, 'utf8')
console.log('Cloudflare Worker 入口已產生')
