export const profile = {
  name: 'Akila Udara',
  title: 'Software Engineer — .NET & ASP.NET Core Full-Stack | FinTech & Enterprise Systems',
  label: 'Full Stack .NET Engineer / FinTech & ERP',
  /** Public LinkedIn headline, verbatim. */
  linkedinHeadline:
    'Full Stack .NET Software Engineer | C# | ASP.NET Core | Angular | Azure | SQL Server | FinTech & ERP Solutions',
  location: 'Kaduwela, Sri Lanka',
  country: 'Sri Lanka',
  email: 'dgakila000@gmail.com',
  phone: { display: '0772 677 972', tel: '+94772677972' },
  showPhone: false,
  linkedin: 'https://www.linkedin.com/in/akilaudara96',
  linkedinHandle: 'akilaudara96',
  cv: { href: '/cv/Akila_Udara_CV.pdf', fileName: 'Akila_Udara_CV.pdf' },

  /** Owner-controlled. Keep neutral unless the owner explicitly states availability for work. */
  availability:
    'Open to conversations about software engineering, .NET, enterprise systems and FinTech platforms.',

  headline: 'Building software for systems that have to work.',
  intro:
    'Software Engineer focused on .NET, ASP.NET Core, SQL Server, Oracle and full-stack financial systems.',
  signature:
    'I build and maintain financial software across APIs, application logic, databases, UAT and production releases.',

  /** CV professional summary, without the duration label (durations are computed from dates). */
  summary:
    'Versatile Software Engineer delivering full-cycle solutions in FinTech and enterprise domains. Specialized in C#/.NET, ASP.NET Core, SQL Server, Oracle DB, Angular, Azure DevOps, Jenkins, and microservices architecture. Experienced in diagnosing complex system defects, shipping reliable releases across UAT and production, and collaborating in cross-functional Agile teams.',
  currentWork:
    'Currently contributing to FirstMicro, a cloud-based microfinance SaaS product, on a modern .NET 8 and Angular 17+ stack at FINAP.',

  education: {
    degree: 'BSc (Honours) in Information Technology',
    institution: 'Sri Lanka Institute of Information Technology (SLIIT)',
    institutionShort: 'SLIIT',
    start: 2018,
    end: 2022,
  },

  languages: [
    { name: 'Sinhala', level: 'Native' },
    { name: 'English', level: 'Professional Working Proficiency' },
  ],
} as const
