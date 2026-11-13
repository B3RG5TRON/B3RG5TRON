/**
 * Everything the cards say that does not come from the GitHub API.
 * Edit the text here, never in the README or in the generated SVG files.
 */
export type Lang = 'en' | 'pt';
export const LANGS: Lang[] = ['en', 'pt'];

type L = Record<Lang, string>;

export const profile = {
  login: 'B3RG5TRON',
  name: ['Eduardo', 'Bergstron'],
  location: 'Porto Alegre, BR · UTC-3',
  email: 'bergstron.dev@icloud.com',
  linkedin: 'https://www.linkedin.com/in/eduardo-bergstron-986108143/',
  linkedinHandle: 'in/eduardo-bergstron',
  github: 'https://github.com/B3RG5TRON',
  company: 'Klassmatt',
  role: { en: 'Full Stack Developer', pt: 'Desenvolvedor Full Stack' } as L,
  tagline: {
    en: 'I build web applications in .NET and React and integrate ERP systems.',
    pt: 'Desenvolvo aplicações web em .NET e React e integro sistemas ERP.',
  } as L,
  /** The JSON shown in the hero panel: an API response describing the developer. */
  api: {
    path: '/eduardo',
    fields: {
      en: [
        ['role', '"Full Stack Developer"'],
        ['stack', '[".NET", "React", "Node.js"]'],
        ['focus', '"REST APIs, integrations"'],
        ['since', '2023'],
      ],
      pt: [
        ['role', '"Desenvolvedor Full Stack"'],
        ['stack', '[".NET", "React", "Node.js"]'],
        ['focus', '"APIs REST, integrações"'],
        ['since', '2023'],
      ],
    } as Record<Lang, [string, string][]>,
  },
};

export const about = {
  title: { en: 'About me', pt: 'Sobre mim' } as L,
  text: {
    en: 'Full stack developer since 2023, working day to day with .NET, React and Node.js on end-to-end web applications. I build REST APIs, integrate systems and work with data in relational databases. I ship with tests and code review, with performance, security and maintainability in mind.',
    pt: 'Desenvolvedor full stack desde 2023, trabalho no dia a dia com .NET, React e Node.js em aplicações web de ponta a ponta. Construo APIs REST, integro sistemas e trabalho com dados em bancos relacionais. Entrego com testes e code review, cuidando de desempenho, segurança e manutenção.',
  } as L,
  facts: [
    { label: { en: 'stack', pt: 'stack' }, value: { en: 'C#, VB.NET, JavaScript, TypeScript, SQL', pt: 'C#, VB.NET, JavaScript, TypeScript, SQL' } },
    { label: { en: 'focus', pt: 'foco' }, value: { en: 'REST APIs, ERP integration (SAP) and SQL Server', pt: 'APIs REST, integração de ERP (SAP) e SQL Server' } },
    { label: { en: 'practices', pt: 'práticas' }, value: { en: 'Integration testing, code review, Git and Azure DevOps', pt: 'Testes de integração, code review, Git e Azure DevOps' } },
    { label: { en: 'based in', pt: 'base' }, value: { en: 'Porto Alegre, BR · UTC-3', pt: 'Porto Alegre, BR · UTC-3' } },
  ] as { label: L; value: L }[],
};

export const experience = {
  title: { en: 'Experience', pt: 'Experiência' } as L,
  roles: [
    {
      current: true,
      period: { en: 'Jan 2026 – now', pt: 'jan 2026 – hoje' },
      role: { en: 'Junior Full Stack Developer', pt: 'Desenvolvedor Full Stack Júnior' },
      company: 'Klassmatt',
      detail: {
        en: '.NET with C# and VB.NET, Vue.js and React, REST API integration, SQL Server and ERP implementation, including SAP.',
        pt: '.NET com C# e VB.NET, Vue.js e React, integração de APIs REST, SQL Server e implementação de ERP, incluindo SAP.',
      },
    },
    {
      period: { en: 'May – Dec 2025', pt: 'mai – dez 2025' },
      role: { en: 'Trainee Full Stack Developer', pt: 'Desenvolvedor Full Stack Trainee' },
      company: 'Klassmatt',
    },
    {
      period: { en: 'Jul 2024 – May 2025', pt: 'jul 2024 – mai 2025' },
      role: { en: 'Support and Development (internship)', pt: 'Suporte e Desenvolvimento (estágio)' },
      company: 'Klassmatt',
    },
    {
      period: { en: 'Dec 2023 – Jul 2024', pt: 'dez 2023 – jul 2024' },
      role: { en: 'IT Technician (internship)', pt: 'Técnico de TI (estágio)' },
      company: 'Secretaria de Planejamento, Governança e Gestão do RS',
    },
  ] as { current?: boolean; period: L; role: L; company: string; detail?: L }[],
};

export const tiles = [
  {
    id: 'work',
    href: profile.linkedin,
    label: { en: 'work', pt: 'trabalho' },
    title: { en: 'Klassmatt', pt: 'Klassmatt' },
    sub: { en: 'Junior Full Stack Developer', pt: 'Desenvolvedor Full Stack Júnior' },
  },
  {
    id: 'shipped',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7526636901034987520/',
    label: { en: 'shipped', pt: 'entrega' },
    title: { en: 'Whistleblowing channel', pt: 'Canal de Denúncias' },
    sub: { en: 'LGPD · Azure · 2026', pt: 'LGPD · Azure · 2026' },
  },
  {
    id: 'certified',
    href: 'https://app.rocketseat.com.br/certificates/09da2ade-3667-41f8-933d-16cd36c43016',
    label: { en: 'certified', pt: 'certificação' },
    title: { en: 'C# specialization', pt: 'Especialização em C#' },
    sub: { en: 'Rocketseat · 100 h · 2026', pt: 'Rocketseat · 100 h · 2026' },
  },
] as { id: string; href: string; label: L; title: L; sub: L }[];

export const projects = {
  title: { en: 'Projects', pt: 'Projetos' } as L,
  note: { en: 'pinned on GitHub, refreshed daily', pt: 'fixados no GitHub, atualizados todo dia' } as L,
};

export const posts = {
  title: { en: 'Featured posts', pt: 'Publicações em destaque' } as L,
  note: { en: 'from LinkedIn', pt: 'do LinkedIn' } as L,
  kinds: {
    project: { en: 'project', pt: 'projeto' },
    certificate: { en: 'certificate', pt: 'certificação' },
  } as Record<string, L>,
  items: [
    {
      id: 'canal-denuncias',
      kind: 'project',
      href: 'https://www.linkedin.com/feed/update/urn:li:activity:7526636901034987520/',
      date: { en: '12 Nov 2026', pt: '12 nov 2026' },
      title: { en: 'Klassmatt whistleblowing channel goes live', pt: 'Lançamento do Canal de Denúncias da Klassmatt' },
      text: {
        en: 'Built end to end: UX, business rules, security, architecture, tests and Azure deploy, with LGPD and anonymity at the core.',
        pt: 'Feito de ponta a ponta: UX, regras, segurança, arquitetura, testes e deploy no Azure, com LGPD e anonimato no centro.',
      },
    },
    {
      id: 'csharp',
      kind: 'certificate',
      href: 'https://www.linkedin.com/feed/update/urn:li:activity:7442300005383716864/',
      date: { en: '24 Mar 2026', pt: '24 mar 2026' },
      title: { en: 'C# specialization at Rocketseat, 100 hours', pt: 'Especialização em C# pela Rocketseat, 100 horas' },
      text: {
        en: '.NET APIs, Domain-Driven Design, Entity Framework, JWT, SOLID, unit and integration tests, and Azure deploy.',
        pt: 'APIs em .NET, Domain-Driven Design, Entity Framework, JWT, SOLID, testes de unidade e integração e deploy no Azure.',
      },
    },
    {
      id: 'deploy',
      kind: 'certificate',
      href: 'https://www.linkedin.com/feed/update/urn:li:activity:7300640469066117120/',
      date: { en: '26 Feb 2025', pt: '26 fev 2025' },
      title: { en: 'Deploy certification at Rocketseat', pt: 'Certificação em Deploy pela Rocketseat' },
      text: {
        en: 'PM2, Render, Netlify, environment variables and automated tests with Jest.',
        pt: 'PM2, Render, Netlify, variáveis de ambiente e testes automatizados com Jest.',
      },
    },
    {
      id: 'integration',
      kind: 'certificate',
      href: 'https://www.linkedin.com/feed/update/urn:li:activity:7270368952705327104/',
      date: { en: '5 Dec 2024', pt: '5 dez 2024' },
      title: { en: 'Back-end and front-end integration at Rocketseat', pt: 'Integração de back-end com front-end pela Rocketseat' },
      text: {
        en: 'Back-end authentication, image upload and a Node.js API consumed by a React front end.',
        pt: 'Autenticação no back-end, upload de imagens e API em Node.js consumida por um front-end em React.',
      },
    },
  ] as { id: string; kind: string; href: string; date: L; title: L; text: L }[],
};

/** Screens of the whistleblowing channel, shown with the company's permission. */
export const screens = {
  href: 'https://www.linkedin.com/feed/update/urn:li:activity:7526636901034987520/',
  items: [
    { id: 'start', file: 'assets/canal-denuncias/03-nova-denuncia-ou-acompanhar.webp', caption: { en: 'Report or follow a case', pt: 'Denunciar ou acompanhar' } },
    { id: 'anonymous', file: 'assets/canal-denuncias/05-identificado-ou-anonimo.webp', caption: { en: 'Identified or anonymous', pt: 'Identificado ou anônimo' } },
    { id: 'privacy', file: 'assets/canal-denuncias/01-termos-de-privacidade.webp', caption: { en: 'Privacy terms under LGPD', pt: 'Termos de privacidade, LGPD' } },
  ] as { id: string; file: string; caption: L }[],
};

/**
 * Which GitHub data cards the README shows. The numbers count public activity only,
 * so a card that undersells the work can be switched off here without touching the layout.
 */
export const show = { heatmap: true, activity: false, languages: true };

export const activity = {
  heatmapTitle: { en: 'Contributions', pt: 'Contribuições' } as L,
  heatmapNote: { en: 'in the last 12 months', pt: 'nos últimos 12 meses' } as L,
  less: { en: 'less', pt: 'menos' } as L,
  more: { en: 'more', pt: 'mais' } as L,
  streak: { en: 'current streak', pt: 'sequência atual' } as L,
  days: { en: 'days', pt: 'dias' } as L,
  day: { en: 'day', pt: 'dia' } as L,
  activeDays: { en: 'active days', pt: 'dias ativos' } as L,
  busiest: { en: 'busiest day', pt: 'dia mais ativo' } as L,
  contributions: { en: 'contributions', pt: 'contribuições' } as L,
  perMonth: { en: 'contributions per month', pt: 'contribuições por mês' } as L,
  languagesTitle: { en: 'Languages', pt: 'Linguagens' } as L,
  languagesNote: { en: 'by code in public repositories', pt: 'por código nos repositórios públicos' } as L,
  months: {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  } as Record<Lang, string[]>,
};

export const contact = {
  title: { en: "Let's talk", pt: 'Vamos conversar' } as L,
  text: {
    en: 'Have an integration or a web application to build? Write to me.',
    pt: 'Tem uma integração ou uma aplicação web para construir? Me escreva.',
  } as L,
  links: [
    { id: 'email', href: `mailto:${profile.email}`, title: { en: 'Email', pt: 'E-mail' }, sub: profile.email },
    { id: 'linkedin', href: profile.linkedin, title: { en: 'LinkedIn', pt: 'LinkedIn' }, sub: profile.linkedinHandle },
    { id: 'github', href: profile.github, title: { en: 'GitHub', pt: 'GitHub' }, sub: 'github.com/B3RG5TRON' },
  ] as { id: string; href: string; title: L; sub: string }[],
};

export const footer = {
  left: { en: '© {year} Eduardo Bergstron · Porto Alegre, BR', pt: '© {year} Eduardo Bergstron · Porto Alegre, BR' } as L,
  right: { en: 'cards generated from this repository · updated {date}', pt: 'cartões gerados neste repositório · atualizado em {date}' } as L,
};

export const switcher = { en: 'English', pt: 'Português' } as L;

export const alt = {
  hero: { en: 'Eduardo Bergstron, Full Stack Developer at Klassmatt', pt: 'Eduardo Bergstron, Desenvolvedor Full Stack na Klassmatt' } as L,
  heatmap: { en: 'GitHub contributions in the last 12 months', pt: 'Contribuições no GitHub nos últimos 12 meses' } as L,
  activity: { en: 'Current streak, active days and contributions per month', pt: 'Sequência atual, dias ativos e contribuições por mês' } as L,
  languages: { en: 'Languages used in public repositories', pt: 'Linguagens usadas nos repositórios públicos' } as L,
};

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const month = activity.months[lang][d.getUTCMonth()];
  return lang === 'en' ? `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}` : `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}`;
}
