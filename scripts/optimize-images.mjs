import { promises as fs } from 'fs'
import path from 'node:path'
import sharp from 'sharp'

const publicDir = path.resolve(process.cwd(), 'docs/public')
const concurrency = Math.max(1, Math.min(4, Number(process.env.IMG_CONCURRENCY) || 2))

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

function shouldConvert(file) {
  const ext = path.extname(file).toLowerCase()
  return ['.png', '.jpg', '.jpeg'].includes(ext)
}

async function convertOne(_unused, file) {
  const base = file.replace(/\.(png|jpg|jpeg)$/i, '')
  const img = sharp(file)
  await img.webp({ quality: 82 }).toFile(`${base}.webp`)
  await img.avif({ quality: 45 }).toFile(`${base}.avif`)
}

async function main() {
  await ensureDir(publicDir)
  const all = []
  for await (const f of walk(publicDir)) {
    if (shouldConvert(f)) all.push(f)
  }
  if (all.length === 0) return

  const batches = []
  for (let i = 0; i < all.length; i += concurrency) batches.push(all.slice(i, i + concurrency))
  for (const batch of batches) {
    await Promise.all(batch.map((f) => convertOne(null, f)))
  }
}

main().catch((err) => {
  console.error('[image-optimize] failed:', err)
  process.exit(1)
})

