import { mkdir, rm } from 'node:fs/promises'
import sharp from 'sharp'

const SOURCE = 'assets-src/portrait.png'
const OUT = 'public/images'

await mkdir(OUT, { recursive: true })

// The source is a transparent cutout. Trim to the figure and keep the alpha so it can stand in front
// of the name; the photo itself is never recoloured, filtered or flattened.
const { data, info } = await sharp(SOURCE)
  .trim({ threshold: 10 })
  .png()
  .toBuffer({ resolveWithObject: true })
const figure = () => sharp(data)

const widths = [700, 1000, info.width]
const jobs = []
for (const w of widths) {
  const base = figure().resize({ width: w })
  jobs.push(base.clone().avif({ quality: 72, effort: 6 }).toFile(`${OUT}/portrait-cut-${w}.avif`))
  jobs.push(
    base
      .clone()
      .webp({ quality: 90, alphaQuality: 100, smartSubsample: true })
      .toFile(`${OUT}/portrait-cut-${w}.webp`),
  )
}

const results = await Promise.all(jobs)
for (const stale of ['portrait-560', 'portrait-820'])
  for (const ext of ['avif', 'webp']) await rm(`${OUT}/${stale}.${ext}`, { force: true })
await rm(`${OUT}/portrait-tex.webp`, { force: true })

console.log(
  `[images] figure ${info.width}×${info.height}:`,
  results.map((r) => `${r.width}×${r.height} ${Math.round(r.size / 1024)}KB`).join(', '),
)
