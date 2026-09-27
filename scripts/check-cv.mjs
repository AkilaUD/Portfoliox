import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const cvPath = fileURLToPath(new URL('../public/cv/Akila_Udara_CV.pdf', import.meta.url))

if (existsSync(cvPath)) {
  console.log('[check-cv] CV found: public/cv/Akila_Udara_CV.pdf')
} else if (process.env.ALLOW_MISSING_CV === '1') {
  console.warn(
    '[check-cv] WARNING: public/cv/Akila_Udara_CV.pdf is missing. Continuing because ALLOW_MISSING_CV=1; the DOWNLOAD CV link will 404.',
  )
} else {
  console.error(
    '[check-cv] public/cv/Akila_Udara_CV.pdf is missing. Add the real CV PDF before building, or set ALLOW_MISSING_CV=1 for a local preview build.',
  )
  process.exit(1)
}
