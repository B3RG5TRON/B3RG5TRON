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
    en: 'I build web and mobile apps with .NET, React and Node.js and integrate systems.',
    pt: 'Desenvolvo aplicações web e mobile com .NET, React e Node.js e integro sistemas.',
  } as L,
  /** The JSON shown in the hero panel: an API response describing the developer. */
  api: {
    path: '/eduardo',
    fields: {
      en: [
        ['role', '"Full Stack Developer"'],
        ['stack', '[".NET", "React", "Node.js"]'],
        ['apps', '["web", "android", "ios"]'],
        ['focus', '"REST APIs, integrations"'],
        ['since', '2023'],
      ],
      pt: [
        ['role', '"Desenvolvedor Full Stack"'],
        ['stack', '[".NET", "React", "Node.js"]'],
        ['apps', '["web", "android", "ios"]'],
        ['focus', '"APIs REST, integrações"'],
        ['since', '2023'],
      ],
    } as Record<Lang, [string, string][]>,
  },
};

export const about = {
  num: '01',
  title: { en: 'About me', pt: 'Sobre mim' } as L,
  text: {
    en: 'Full stack developer since 2023, working day to day with .NET, React and Node.js on end-to-end web and mobile (Android and iOS) applications. I build REST APIs, integrate systems and work with data in relational databases. I ship with tests and code review, with performance, security and maintainability in mind.',
    pt: 'Desenvolvedor full stack desde 2023, trabalho no dia a dia com .NET, React e Node.js em aplicações web e mobile (Android e iOS) de ponta a ponta. Construo APIs REST, integro sistemas e trabalho com dados em bancos relacionais. Entrego com testes e code review, cuidando de desempenho, segurança e manutenção.',
  } as L,
  /** Short label and value lines under the paragraph, drawn with an arrow like the reference profile. */
  facts: [
    { label: { en: 'studying', pt: 'estudando' }, value: { en: 'Swift, Rust, blockchain and Open Finance', pt: 'Swift, Rust, blockchain e Open Finance' } },
    { label: { en: 'focus', pt: 'foco' }, value: { en: 'REST APIs, system integration and databases', pt: 'APIs REST, integração de sistemas e bancos de dados' } },
    { label: { en: 'practices', pt: 'práticas' }, value: { en: 'Integration tests, code review, Git, GitHub and Azure DevOps', pt: 'Testes de integração, code review, Git, GitHub e Azure DevOps' } },
    {
      label: { en: 'beyond code', pt: 'além do código' },
      value: {
        en: 'Documentation and requirements specification, clear communication with technical and business teams, creativity, problem solving and ownership from idea to production',
        pt: 'Documentação e especificação de requisitos, comunicação clara com áreas técnicas e de negócio, criatividade, resolução de problemas e autonomia da ideia à produção',
      },
    },
  ] as { label: L; value: L }[],
};

/** The tools I use, grouped like the reference profile. `main` ones are drawn in the accent colour. */
export const stack = {
  num: '03',
  title: { en: 'Stack', pt: 'Stack' } as L,
  groups: [
    { label: { en: 'Backend', pt: 'Backend' }, items: ['.NET', 'C#', 'VB.NET', 'Node.js', 'NestJS', 'Express', 'Fastify', 'Prisma'], main: ['.NET', 'Node.js'] },
    { label: { en: 'Frontend', pt: 'Frontend' }, items: ['React', 'Next.js', 'Vue.js', 'TypeScript', 'JavaScript', 'Tailwind', 'Vite', 'HTML', 'CSS'], main: ['React'] },
    { label: { en: 'Mobile', pt: 'Mobile' }, items: ['React Native', 'Expo', 'Swift', 'Rust', 'Android', 'iOS'] },
    { label: { en: 'Data', pt: 'Dados' }, items: ['SQL Server', 'PostgreSQL', 'SQLite'] },
    { label: { en: 'DevOps', pt: 'DevOps' }, items: ['Docker', 'Azure', 'Railway', 'GitHub Actions', 'Git', 'GitHub', 'Azure DevOps'] },
    { label: { en: 'AI', pt: 'IA' }, items: ['Claude Code', 'Spec-Driven Development', 'OpenRouter', 'Ollama', { en: 'Automations', pt: 'Automações' }, 'Bots'] },
    { label: { en: 'Design · Tools', pt: 'Design · Ferramentas' }, items: ['Figma', 'Visual Studio', 'VS Code'] },
  ] as { label: L; items: (string | L)[]; main?: string[] }[],
};

export const experience = {
  num: '02',
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

/** "What I'm building": work in progress, written by hand because it may live in private repositories. */
export const building = {
  num: '04',
  title: { en: "What I'm building", pt: 'O que estou criando' } as L,
  items: [
    {
      id: 'streamsync',
      name: 'StreamSync',
      year: '2026',
      status: { en: 'launching soon', pt: 'lançamento em breve' } as L,
      image: { dark: 'assets/projects/streamsync-dark.webp', light: 'assets/projects/streamsync-light.webp' },
      text: {
        en: 'Adds up Twitch, Kick and YouTube viewers in one configurable widget for OBS. Connected accounts, a widget editor with live preview, and plans paid with Pix or card.',
        pt: 'Soma os espectadores de Twitch, Kick e YouTube em um só widget configurável para o OBS. Contas conectadas, editor de widgets com prévia ao vivo e planos pagos com Pix ou cartão.',
      } as L,
      stack: ['React', 'NestJS', 'Fastify', 'PostgreSQL', 'Prisma', 'Railway'],
    },
  ],
};

/**
 * "What I've built": the pinned public repositories, read from GitHub every day.
 * The entries below only add what GitHub does not have: a picture, a short text in both languages and the stack.
 * A pinned repository without an entry still shows up, with its GitHub description and a drawn cover.
 */
export const projects = {
  num: '05',
  title: { en: "What I've built", pt: 'O que já fiz' } as L,
  note: { en: 'pinned on GitHub', pt: 'fixados no GitHub' } as L,
  details: {
    Food_Explorer_ReactJS: {
      title: 'Food Explorer',
      image: 'assets/projects/food-explorer.webp',
      text: { en: 'Restaurant menu with cart, favourites, checkout and order tracking.', pt: 'Cardápio de restaurante com carrinho, favoritos, checkout e pedidos.' },
      stack: ['React', 'Vite', 'Styled Components'],
    },
    Food_Explorer_NodeJS_API: {
      title: 'Food Explorer API',
      logo: 'assets/projects/food-explorer-logo.svg',
      endpoints: ['POST /sessions', 'GET /dish/:id', 'POST /favorite/:dish_id', 'POST /search_cep', 'POST /checkout', 'PATCH /checkout'],
      text: { en: 'API for dishes, orders, favourites and postcode lookup, with JWT sessions.', pt: 'API de pratos, pedidos, favoritos e consulta de CEP, com sessões JWT.' },
      stack: ['Node.js', 'Express', 'Knex', 'SQLite'],
    },
    Explorer_Stage_09_ReactJS_RocketNotes: {
      title: 'RocketNotes',
      image: 'assets/projects/rocketnotes.webp',
      text: { en: 'Notes app with tags, links and a profile page, on top of the RocketNotes API.', pt: 'App de notas com tags, links e perfil, sobre a API do RocketNotes.' },
      stack: ['React', 'Vite', 'Styled Components'],
    },
    Explorer_Stage_08_NodeJS_RocketNotes_API: {
      title: 'RocketNotes API',
      logo: 'assets/projects/rocketnotes-logo.svg',
      endpoints: ['POST /users', 'POST /sessions', 'PATCH /users/avatar', 'GET /notes', 'DELETE /notes/:id', 'GET /tags'],
      text: { en: 'Users, JWT sessions, notes, tags and avatar upload.', pt: 'Usuários, sessões JWT, notas, tags e upload de avatar.' },
      stack: ['Node.js', 'Express', 'Knex', 'SQLite'],
    },
    ShortsSumary: {
      title: 'Shorts Summary',
      image: 'assets/projects/shorts-summary.webp',
      text: { en: 'Summarises YouTube Shorts by transcribing the audio with AI.', pt: 'Resume Shorts do YouTube transcrevendo o áudio com IA.' },
      stack: ['Node.js', 'Transformers.js', 'FFmpeg'],
    },
    Habit: {
      title: 'Habits',
      image: 'assets/projects/habit.webp',
      text: { en: 'Habit tracker for web and mobile, built at NLW Setup.', pt: 'Controle de hábitos na web e no celular, feito na NLW Setup.' },
      stack: ['React', 'React Native', 'Fastify'],
    },
  } as Record<string, { title: string; image?: string; logo?: string; endpoints?: string[]; text: L; stack: string[] }>,
};

export const posts = {
  num: '06',
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
  languagesNoteAll: { en: 'by code in public and private repositories', pt: 'por código nos repositórios públicos e privados' } as L,
  months: {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  } as Record<Lang, string[]>,
};

export const contact = {
  title: { en: "Let's talk", pt: 'Vamos conversar' } as L,
  text: {
    en: 'Have an integration or a web or mobile app to build? Write to me.',
    pt: 'Tem uma integração ou um app web ou mobile para construir? Me escreva.',
  } as L,
  links: [
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
  languagesAll: { en: 'Languages used in public and private repositories', pt: 'Linguagens usadas nos repositórios públicos e privados' } as L,
};

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const month = activity.months[lang][d.getUTCMonth()];
  return lang === 'en' ? `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}` : `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}`;
}
