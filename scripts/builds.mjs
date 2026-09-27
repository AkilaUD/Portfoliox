import { mkdir, rm } from 'node:fs/promises'
import sharp from 'sharp'

// Screenshots captured from local runs of each project live in assets-src/builds/<slug>/.
// Only the files listed here are published, in this order. Pixels are resized, never retouched.
const SELECTION = {
  accruomono: ['02-dashboard', '07-deals', '03-gl', '01-login'],
  magula: ['01-home', '07c-workspace-template-scroll', '08b-invites', '11-invite-public'],
  cgx: ['01-home', '02-home-scroll', '03-marketplace', '06-seller'],
  'flutter-pos': ['01-kandy-royal', '02-tea-gardens', '03-colombo-nights', '04-dark-pro-mode'],
  threadcap: ['02-web'],
  nsip: ['01-home', '05-upload'],
  'little-wonder-world': ['02-garden', '01-home'],
  'harman-wines': ['01-home', '02-wine', '06-wine-detail'],
  'mamma-luisa': ['01-home', '02-menu', '03-private-dining'],
  mojo: ['01-home', '02-menu', '06-home-scroll', '03-order'],
  localseedr: ['01-home'],
}

const SRC = 'assets-src/builds'
const OUT = 'public/builds'
const WIDTHS = [800, 1440]

await rm(OUT, { recursive: true, force: true })

const manifest = {}
for (const [slug, names] of Object.entries(SELECTION)) {
  await mkdir(`${OUT}/${slug}`, { recursive: true })
  manifest[slug] = []
  for (const [i, name] of names.entries()) {
    const input = sharp(`${SRC}/${slug}/${name}.png`)
    const { width, height } = await input.metadata()
    const id = String(i + 1).padStart(2, '0')
    const sizes = [...new Set(WIDTHS.map((w) => Math.min(w, width)))]
    await Promise.all(
      sizes.flatMap((w) => {
        const base = input.clone().resize({ width: w })
        return [
          base.clone().avif({ quality: 64, effort: 6 }).toFile(`${OUT}/${slug}/${id}-${w}.avif`),
          base.clone().webp({ quality: 84 }).toFile(`${OUT}/${slug}/${id}-${w}.webp`),
        ]
      }),
    )
    manifest[slug].push({ id, source: name, width, height, sizes })
  }
}

console.log(JSON.stringify(manifest, null, 1))
