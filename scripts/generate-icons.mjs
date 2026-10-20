// Gera os ícones PNG do PWA (incluindo o do iPhone) a partir de public/icon.svg
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public')
const svg = await readFile(path.join(publicDir, 'icon.svg'))

const targets = [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['maskable-512x512.png', 512],
  ['apple-touch-icon.png', 180],
]

for (const [name, size] of targets) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(path.join(publicDir, name))
  console.log('gerado', name)
}
