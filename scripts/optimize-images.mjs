import { promises as fs } from 'fs'
import path from 'node:path'
import sharp from 'sharp'

const publicDir = path.resolve(process.cwd(), 'docs/public')
const manifestPath = path.resolve(process.cwd(), 'docs/.vitepress/image-manifest.json')
const targetWidths = [480, 768, 1024, 1440, 1920]
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
  const meta = await img.metadata()
  const origWidth = meta.width || 0
  const origHeight = meta.height || 0

  // base modern formats (original size)
  await img.webp({ quality: 82 }).toFile(`${base}.webp`)
  await img.avif({ quality: 45 }).toFile(`${base}.avif`)

  // multi-size variants up to original width
  const usable = targetWidths.filter((w) => w < origWidth)
  for (const w of usable) {
    const resized = sharp(file).resize({ width: w, withoutEnlargement: true })
    await resized.webp({ quality: 80 }).toFile(`${base}.w${w}.webp`)
    await resized.avif({ quality: 45 }).toFile(`${base}.w${w}.avif`)
  }
  return { base, origWidth, origHeight, sizes: [origWidth, ...usable].sort((a,b)=>a-b) }
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
  const results = []
  for (const batch of batches) {
    const r = await Promise.all(batch.map((f) => convertOne(null, f)))
    results.push(...r)
  }

  // build manifest
  const manifest = {}
  for (const r of results) {
    if (!r) continue
    const relBase = '/' + path.relative(publicDir, r.base).split(path.sep).join('/')
    const entry = { width: r.origWidth, height: r.origHeight, variants: { avif: [], webp: [] } }
    const widths = Array.from(new Set(r.sizes)).filter(Boolean).sort((a,b)=>a-b)
    for (const w of widths) {
      const suffix = w === r.origWidth ? '' : `.w${w}`
      entry.variants.avif.push({ w, src: `${relBase}${suffix}.avif` })
      entry.variants.webp.push({ w, src: `${relBase}${suffix}.webp` })
    }
    // key 应该是原始带扩展名的路径，如 /index.png
    const originalExt = path.extname(r.base)
    manifest[relBase + originalExt] = entry
  }
  await ensureDir(path.dirname(manifestPath))
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
}

main().catch((err) => {
  console.error('[image-optimize] failed:', err)
  process.exit(1)
})

