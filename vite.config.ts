import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { SITE_URL } from './site.config.ts'
import { experience } from './src/data/experience.ts'
import { profile } from './src/data/profile.ts'
import { skillBranches } from './src/data/skills.ts'

/** Public paths of the built pages, one per HTML entry. */
const PAGES = ['/', '/projects/'] as const

/** Person JSON-LD, canonical metadata, robots.txt and sitemap.xml, all derived from the typed content. */
function seo(): Plugin {
  const current = experience.find((e) => e.end === null)
  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: 'Full Stack .NET Software Engineer',
    description: `${profile.intro} ${profile.linkedinHeadline}.`,
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Kaduwela', addressCountry: 'LK' },
    sameAs: [profile.linkedin],
    alumniOf: { '@type': 'CollegeOrUniversity', name: profile.education.institution },
    ...(current ? { worksFor: { '@type': 'Organization', name: current.company } } : {}),
    knowsAbout: [
      ...new Set(['C#', 'ASP.NET Core', 'Angular', 'Azure', 'SQL Server', 'FinTech', 'ERP', ...skillBranches.flatMap((b) => b.skills.map((s) => s.name))]),
    ].slice(0, 24),
    knowsLanguage: profile.languages.map((l) => l.name),
    ...(SITE_URL ? { url: `${SITE_URL}/` } : {}),
  }

  return {
    name: 'portfolio-seo',
    transformIndexHtml(_html, ctx) {
      const pagePath = ctx.path.replace(/index\.html$/, '')
      const tags: { tag: string; attrs?: Record<string, string>; children?: string; injectTo: 'head' }[] = [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(personLd),
          injectTo: 'head',
        },
      ]
      if (SITE_URL) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: `${SITE_URL}${pagePath}` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${SITE_URL}${pagePath}` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: `${SITE_URL}/og.png` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' },
          {
            tag: 'meta',
            attrs: { property: 'og:image:alt', content: `${profile.name} — ${profile.headline}` },
            injectTo: 'head',
          },
          { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE_URL}/og.png` }, injectTo: 'head' },
        )
      }
      return tags
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', ...(SITE_URL ? ['', `Sitemap: ${SITE_URL}/sitemap.xml`] : [])]
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` })
      if (SITE_URL) {
        const today = new Date().toISOString().slice(0, 10)
        const urls = PAGES.map((p) => `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
        })
      } else {
        this.warn('SITE_URL is empty: skipping canonical, og:url and sitemap.xml. Set it in site.config.ts.')
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger'],
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        projects: fileURLToPath(new URL('./projects/index.html', import.meta.url)),
      },
    },
  },
})
