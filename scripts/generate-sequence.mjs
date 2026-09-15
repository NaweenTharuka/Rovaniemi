/**
 * Generates a PLACEHOLDER scroll sequence from a single still (slow push-in while
 * the sky brightens). Replace with frames exported from real drone/timelapse
 * footage: `ffmpeg -i clip.mp4 -vf "fps=24,scale=1600:-1" -c:v libwebp -q:v 60 frame-%03d.webp`
 *
 * Usage: node scripts/generate-sequence.mjs <source-image> <output-dir>
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const [source = 'src/payload/seed/assets/photos/aurora-tall-pines.jpg', outDir = 'public/sequences/north'] = process.argv.slice(2)

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

async function render({ name, count, width, height, quality }) {
  const dir = path.join(outDir, name)
  fs.mkdirSync(dir, { recursive: true })
  const meta = await sharp(source).metadata()
  const targetRatio = width / height

  for (let i = 0; i < count; i++) {
    const t = ease(i / (count - 1))
    const zoom = 1 + t * 0.32
    // Base crop matching the output aspect ratio.
    let baseW = meta.width
    let baseH = Math.round(baseW / targetRatio)
    if (baseH > meta.height) {
      baseH = meta.height
      baseW = Math.round(baseH * targetRatio)
    }
    const cropW = Math.round(baseW / zoom)
    const cropH = Math.round(baseH / zoom)
    // Drift upward toward the aurora as the camera pushes in.
    const cx = meta.width / 2
    const cy = meta.height * (0.5 - t * 0.12)
    const left = Math.max(0, Math.min(meta.width - cropW, Math.round(cx - cropW / 2)))
    const top = Math.max(0, Math.min(meta.height - cropH, Math.round(cy - cropH / 2)))

    await sharp(source)
      .extract({ left, top, width: cropW, height: cropH })
      .resize(width, height, { kernel: 'lanczos3' })
      .modulate({ brightness: 0.62 + t * 0.45, saturation: 0.7 + t * 0.55 })
      .webp({ quality, effort: 5 })
      .toFile(path.join(dir, `frame-${String(i + 1).padStart(3, '0')}.webp`))
  }
  const bytes = fs.readdirSync(dir).reduce((sum, f) => sum + fs.statSync(path.join(dir, f)).size, 0)
  console.log(`${name}: ${count} frames, ${(bytes / 1024 / 1024).toFixed(2)} MB`)
}

await render({ name: 'desktop', count: 36, width: 1440, height: 810, quality: 42 })
await render({ name: 'mobile', count: 24, width: 640, height: 1138, quality: 40 })
