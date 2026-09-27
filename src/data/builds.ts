export type BuildKind = 'product' | 'client-site' | 'tool'

export type BuildShot = {
  /** File stem under `/builds/<slug>/`, e.g. `01` → `01-800.avif`. */
  id: string
  alt: string
  width: number
  height: number
  /** Generated widths, smallest first. The last entry equals `width`. */
  sizes: number[]
}

export type BuildLink = { label: string; href: string; kind: 'live' | 'demo' | 'source' }

export type Build = {
  slug: string
  name: string
  kind: BuildKind
  /** Business the site was built for (client sites only). */
  client?: string
  tagline: string
  summary: string
  features: string[]
  stack: string[]
  links: BuildLink[]
  shots: BuildShot[]
  /** Honest caveat shown with the build, e.g. what the screenshots can and can't show. */
  note?: string
  featured?: boolean
}

export const buildKinds: { id: BuildKind; label: string }[] = [
  { id: 'product', label: 'Products' },
  { id: 'client-site', label: 'Client sites' },
  { id: 'tool', label: 'Tools' },
]

export const kindLabel = (kind: BuildKind) =>
  ({ product: 'Product', 'client-site': 'Client site', tool: 'Tool' })[kind]

const wide = (id: string, alt: string): BuildShot => ({
  id,
  alt,
  width: 1440,
  height: 900,
  sizes: [800, 1440],
})
const square = (id: string, alt: string): BuildShot => ({
  id,
  alt,
  width: 1024,
  height: 1024,
  sizes: [800, 1024],
})

export function shotSrc(slug: string, shot: BuildShot, format: 'avif' | 'webp', width: number) {
  return `/builds/${slug}/${shot.id}-${width}.${format}`
}

export function shotSrcSet(slug: string, shot: BuildShot, format: 'avif' | 'webp') {
  return shot.sizes.map((w) => `${shotSrc(slug, shot, format, w)} ${w}w`).join(', ')
}

export const builds: Build[] = [
  {
    slug: 'magula',
    name: 'Magul Mate',
    kind: 'product',
    tagline: 'Wedding marketplace for Sri Lanka',
    summary:
      'A vendor-first wedding marketplace for Sri Lanka. Couples use it free; vendors and planners pay. Bookings, payments, planning and invitations live in one workspace.',
    features: [
      'PayHere (sandbox) deposit holds, disputes and vendor payouts',
      'Couple workspace with cultural templates (Sinhala-Buddhist, Christian, Hindu, Islamic, civil) that seed events and a checklist',
      'Invite Studio with published invitations and public RSVP pages',
      'Planner organisations that manage several client couples',
      'Seating floor plan, day-of operations and an AI planning agent that asks for confirmation at each step',
      'Access token kept in memory, httpOnly refresh cookie and TOTP MFA for admins',
    ],
    stack: [
      '.NET 8',
      'ASP.NET Core',
      'EF Core',
      'SQL Server',
      'React 19',
      'Vite',
      'Tailwind CSS',
      'Framer Motion',
    ],
    links: [
      { label: 'Live app', href: 'https://web-production-c0e665.up.railway.app', kind: 'live' },
    ],
    shots: [
      wide('01', 'Magul Mate home page for couples and wedding vendors'),
      wide(
        '02',
        'Couple workspace with wedding and homecoming events and a checklist seeded from a Sinhala-Buddhist template',
      ),
      wide(
        '03',
        'Invite Studio with invitation templates and a published invite with its share link',
      ),
      wide('04', 'Public invitation page with an RSVP form'),
    ],
    featured: true,
  },
  {
    slug: 'accruomono',
    name: 'Accountz',
    kind: 'product',
    tagline: 'Accounting for Sri Lankan export-services businesses',
    summary:
      'Single-company accounting built for Sri Lankan businesses that export services. A .NET 8 modular monolith, ported from an earlier microservices version of the same product.',
    features: [
      '14 modules including general ledger, receivables, payables, payroll and leave, tax, fixed assets, bank and treasury, project costing, contractors with WHT, and reporting',
      'Remittance-aware tax estimator and scenario simulator',
      'Deal workspace that follows a customer from quote to contract, delivery, invoice and cash',
      'Client portal with milestone tracking',
      'Statutory calendar, IRD / EPF / ETF export files, segregation-of-duties checks and an auditor pack',
      'Offline demo build that runs against an in-browser mock API',
    ],
    stack: [
      '.NET 8',
      'ASP.NET Core',
      'SQL Server',
      'React 19',
      'TypeScript',
      'Vite',
      'TanStack Query',
      'Tailwind CSS',
      'Radix UI',
      'Recharts',
    ],
    links: [],
    shots: [
      wide(
        '01',
        'Accountz dashboard with statutory due dates, treasury position, AR/AP aging and cash balances',
      ),
      wide(
        '02',
        'Deal workspace showing delivery milestones and invoices for a fixed-price contract',
      ),
      wide(
        '03',
        'General ledger chart of accounts with LKR and USD cash, export receivables and EPF / ETF payables',
      ),
      wide('04', 'Accountz sign-in screen'),
    ],
    featured: true,
  },
  {
    slug: 'cgx',
    name: 'Ceylon Gem Exchange',
    kind: 'product',
    tagline: 'B2B marketplace for certified Ceylon gems',
    summary:
      'A business-to-business gem marketplace. Sellers pass KYC and list certified stones; buyers purchase at a fixed price or at auction, with escrow and a custody trail behind every sale.',
    features: [
      'Seller KYC with NGJA licence details',
      'Certified listings: a lab and certificate number are required',
      'Fixed-price sales and auctions with a custody timeline',
      'Escrow, shipping and export documents',
      'Disputes, buyer–seller messaging and AML flags',
      'Seller workspace with listings, completed GMV and escrow figures',
    ],
    stack: [
      '.NET 8',
      'ASP.NET Core',
      'EF Core',
      'ASP.NET Identity',
      'SQL Server',
      'React 19',
      'React Router',
      'TypeScript',
      'Vite',
    ],
    links: [],
    shots: [
      wide('01', 'Ceylon Gem Exchange home page'),
      wide(
        '02',
        'Home page story chapter on Ratnapura, with a photograph of the gem country hills',
      ),
      wide('03', 'Marketplace of certified gem listings'),
      wide(
        '04',
        'Seller workspace with KYC / NGJA details and the form for listing a certified gem',
      ),
    ],
    featured: true,
  },
  {
    slug: 'nsip',
    name: 'NSIP',
    kind: 'product',
    tagline: 'Skills intelligence for Sri Lankan TVET',
    summary:
      'A national skills-intelligence platform for technical and vocational education in Sri Lanka, connecting training-provider data, graduate outcomes and regional skills gaps.',
    features: [
      'Skills-gap explorer by region',
      'Provider CSV / Excel upload, with NIC numbers hashed (SHA-256 with a pepper)',
      'Graduate tracer',
      'Analytics dashboards',
      'Mock SMS inbox and an ETL demo',
    ],
    stack: [
      'Django 4.2',
      'Django REST Framework',
      'PostgreSQL',
      'pandas',
      'spaCy',
      'Splink',
      'React',
      'Recharts',
      'Vite',
    ],
    links: [],
    shots: [wide('01', 'NSIP landing page'), wide('02', 'Training-provider data upload form')],
    note: 'The screenshots show the landing page and upload form. The data views need a PostgreSQL database that wasn’t available when they were taken.',
  },
  {
    slug: 'threadcap',
    name: 'ThreadCap',
    kind: 'product',
    tagline: 'A context OS for AI',
    summary:
      'Turns useful chat and email threads into versioned “capsules” that can be injected into any AI assistant, with purpose-driven briefs instead of pasting whole histories.',
    features: [
      'Immutable capsule versions with diff and rollback',
      'Manifest V3 browser extension for capture, with a paste fallback',
      'MCP server and Claude Code skills',
      'Purpose-driven briefs that fit a token budget',
      'pnpm / Turborepo monorepo with shared schemas',
    ],
    stack: [
      'TypeScript',
      'NestJS 11',
      'PostgreSQL (Neon)',
      'pgvector',
      'Redis (Upstash)',
      'React 19',
      'Vite',
      'Tailwind CSS v4',
    ],
    links: [{ label: 'Source', href: 'https://github.com/AkilaUD/ThreadCap', kind: 'source' }],
    shots: [
      wide('01', 'ThreadCap web app overview listing the API, web, MCP and capsule-core packages'),
    ],
    note: 'Specification-first: the web app is still an early shell.',
  },
  {
    slug: 'pocket-pos',
    name: 'Pocket POS',
    kind: 'product',
    tagline: 'A phone as the point of sale',
    summary:
      'A mobile point-of-sale app for small Sri Lankan shops that turns an ordinary phone into the till.',
    features: [
      'Billing with camera barcode and QR scanning',
      'Wi-Fi and Bluetooth thermal receipts, e-bills and labels',
      'Stock in, out and adjustments',
      'Sales history and reports',
      'Local and Google Drive backup',
      'User roles',
    ],
    stack: [
      'Expo SDK 57',
      'React Native 0.86',
      'TypeScript',
      'expo-sqlite',
      'Drizzle ORM',
      'Zustand',
      'React Native Paper',
    ],
    links: [],
    shots: [],
  },
  {
    slug: 'flutter-pos',
    name: 'Sri Lankan POS',
    kind: 'product',
    tagline: 'Desktop POS in English, Sinhala and Tamil',
    summary:
      'A trilingual desktop point-of-sale system that keeps working offline on SQLite and syncs to an ASP.NET Core API when the connection returns.',
    features: [
      'Offline-first SQLite store with an ASP.NET Core 8 sync API',
      'Barcode scanning',
      'Printed and PDF receipts',
      'Inventory with low-stock alerts',
      'Customer loyalty points',
      '10 visual themes',
    ],
    stack: [
      'Flutter',
      'Dart',
      'Riverpod',
      'Drift',
      'SQLite',
      'ASP.NET Core 8',
      'EF Core',
      'SQL Server',
      'Syncfusion',
    ],
    links: [],
    shots: [
      square('01', 'Kandy Royal theme artwork'),
      square('02', 'Tea Gardens theme artwork'),
      square('03', 'Colombo Nights theme artwork'),
      square('04', 'Dark Pro theme artwork'),
    ],
    note: 'The images are the app’s own theme artwork, not screenshots of the running app.',
  },
  {
    slug: 'little-wonder-world',
    name: 'Little Wonder World',
    kind: 'product',
    tagline: 'A 3D alphabet game for young children',
    summary:
      'A browser game set in a 3D “Sunny Garden” where children find letters and catch words, with spoken prompts guiding each round.',
    features: [
      'Find-the-letter and catch-the-words rounds',
      'Adaptive letter selection driven by a progress store',
      'Spoken prompts through the Web Speech API',
      'Mute and reduced-motion settings',
      'Unit tests with Vitest',
    ],
    stack: ['React 19', 'React Three Fiber', 'drei', 'three.js', 'Zustand', 'TypeScript', 'Vite'],
    links: [],
    shots: [
      wide('01', 'The 3D garden scene asking the player to find the letter A'),
      wide('02', 'Little Wonder World title screen'),
    ],
  },
  {
    slug: 'harman-wines',
    name: 'Harman Wines',
    kind: 'client-site',
    client: 'Harman Wines · Wattle Bank, South Gippsland',
    tagline: 'Editorial redesign for a South Gippsland winery',
    summary:
      'An editorial redesign of harmanwines.com.au: the wine collection, cellar-door bookings and functions in one site that the owners can edit through Sanity.',
    features: [
      'Wine collection and product pages with Ecwid checkout',
      'NowBookIt bookings and gift vouchers',
      'Sanity Studio content, with seed content as a fallback',
      'Journal, events and functions pages',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Lenis', 'Sanity'],
    links: [
      { label: 'Demo', href: 'https://harmanwines.vercel.app', kind: 'demo' },
      { label: 'Source', href: 'https://github.com/AkilaUD/harmanwines', kind: 'source' },
    ],
    shots: [
      wide('01', 'Harman Wines home page'),
      wide('02', 'Wine collection page'),
      wide(
        '03',
        'Rosé 2024 product page with a buy button, style and origin notes, and shipping details',
      ),
    ],
    featured: true,
  },
  {
    slug: 'mamma-luisa',
    name: 'Mamma Luisa',
    kind: 'client-site',
    client: 'Mamma Luisa · Newport, Rhode Island',
    tagline: 'From-scratch redesign for an Italian restaurant',
    summary:
      'A from-scratch redesign of mammaluisa.com, built around the restaurant’s own photography.',
    features: [
      'Full menu with categories and dietary notes',
      'Red wine list of 105 bottles',
      'Photo gallery with a lightbox',
      'Resy reservations and private-dining enquiries',
      'Square gift certificates',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    links: [
      { label: 'Demo', href: 'https://mammaluisa.vercel.app', kind: 'demo' },
      { label: 'Source', href: 'https://github.com/AkilaUD/Mamma-luisa', kind: 'source' },
    ],
    shots: [
      wide('01', 'Mamma Luisa home page'),
      wide('02', 'Menu page'),
      wide('03', 'Private dining page'),
    ],
  },
  {
    slug: 'mojo',
    name: 'MOJO',
    kind: 'client-site',
    client: 'Mojo Latin Fusion · Forest Hills and Rockville Centre, New York',
    tagline: 'Latin fusion restaurant site with a flavour dial',
    summary:
      'A site for a two-location Latin fusion restaurant. Its signature “Crave” dial lets guests pick a flavour and see the dishes that match.',
    features: [
      'Crave flavour dial: heat, citrus, smoke, sweet and fresh',
      '64-item menu with filters',
      'Toast online ordering',
      'Reservations, events, catering and locations',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Router'],
    links: [
      { label: 'Demo', href: 'https://mojolatin.vercel.app', kind: 'demo' },
      { label: 'Source', href: 'https://github.com/AkilaUD/MOjo', kind: 'source' },
    ],
    shots: [
      wide('01', 'MOJO home page'),
      wide('02', 'Menu page with category filters'),
      wide('03', 'Crave flavour dial set to citrus, with matching dishes'),
      wide('04', 'Order online page linking to the Toast ordering menu'),
    ],
    note: 'Uses stand-in photography.',
  },
  {
    slug: 'localseedr',
    name: 'LocalSeedr',
    kind: 'tool',
    tagline: 'A self-hosted Seedr.cc alternative',
    summary:
      'Downloads torrents, direct links and media URLs to your own machine, then lets you browse and play the files from the browser.',
    features: [
      'Magnet links and .torrent files through libtorrent',
      'Parallel HTTP downloads',
      'Media URLs through yt-dlp',
      'Live progress over WebSockets',
      'File browser with an in-browser player, restricted to the download folder',
      'Windows tray app and installer',
    ],
    stack: ['Python', 'FastAPI', 'Uvicorn', 'libtorrent', 'yt-dlp', 'PyInstaller', 'Inno Setup'],
    links: [],
    shots: [wide('01', 'LocalSeedr downloads screen with a field for magnet links and URLs')],
  },
  {
    slug: 'player',
    name: 'Player',
    kind: 'tool',
    tagline: 'A minimal video player on libmpv',
    summary: 'A small Windows video player: a WPF shell around libmpv.',
    features: [
      'Open a file',
      'Play, pause and stop',
      'Seek bar with elapsed time',
      'Volume control',
    ],
    stack: ['C#', '.NET 8', 'WPF', 'libmpv'],
    links: [],
    shots: [],
  },
]

export const featuredBuilds = builds.filter((b) => b.featured)
