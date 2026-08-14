export interface Experience {
  company: string;
  title: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface CommunityRole {
  organization: string;
  role: string;
  description: string;
}

export interface Achievement {
  title: string;
  description: string;
  link?: string;
}

export interface CompetencyGroup {
  category: string;
  items: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  location: string;
  email: string;
  summary: string;
  cvUrl: string;
  profileUrl: string;
  cvLastUpdated: string;
  links: {
    github: string;
    linkedin: string;
  };
  skills: string[];
  coreCompetencies: CompetencyGroup[];
  technicalProficiency: CompetencyGroup[];
  experience: Experience[];
  achievements: Achievement[];
  community: CommunityRole[];
  speaking: string[];
  certifications: string[];
  education: string[];
}

export const resume: ResumeData = {
  name: 'Deepak Koul',
  title: 'Senior Manager, Software Engineering',
  location: 'Pune, Maharashtra, India',
  email: 'kouldeep@gmail.com',
  cvUrl: 'https://www.puneaicollective.org/people/deepak/cv.txt',
  profileUrl: 'https://www.puneaicollective.org/people/deepak',
  cvLastUpdated: '2026-07',
  summary:
    'Senior engineering leader with 19+ years of experience building and scaling technology teams in India for global enterprises. Currently leading multiple global engineering and QA teams at Red Hat. Deep expertise in engineering delivery, test automation, CI/CD, DevOps practices, and AI-powered engineering workflows. Proven track record of growing India-based teams from the ground up, establishing engineering standards, and delivering high-quality enterprise software to global stakeholders.',
  links: {
    github: 'https://github.com/dkoul',
    linkedin: 'https://linkedin.com/in/dkoul',
  },
  skills: [
    'Engineering Leadership',
    'India Technology Operations Scaling',
    'Test Automation & QA Frameworks',
    'CI/CD & DevOps',
    'AI/ML Adoption',
    'LLM Integration & RAG',
    'Agile & Scrum',
    'Selenium & Cypress',
    'Python, Java, JavaScript, Go',
    'AWS & GCP',
    'Open Source',
    'Distributed Team Leadership',
    'Hiring & Mentoring',
    'Release Management',
    'Salesforce & ServiceNow',
  ],
  coreCompetencies: [
    {
      category: 'Leadership & Strategy',
      items: [
        'India Technology Operations Scaling',
        'Distributed Team Leadership (Remote/Async)',
        'Hiring, Mentoring & Talent Development',
        'Vendor & Partner Ecosystem Management',
        'Cross-functional Stakeholder Management',
        'Strategic Delivery Planning & Execution',
      ],
    },
    {
      category: 'Engineering & Delivery',
      items: [
        'Test Automation & QA Frameworks',
        'CI/CD Pipeline Design & Governance',
        'Agile & DevOps Practices',
        'Release Management & Stability',
        'Engineering Standards & Code Review',
        'Production Quality & Defect Reduction',
      ],
    },
    {
      category: 'Technology & Platforms',
      items: [
        'AI & Machine Learning Adoption',
        'Salesforce, ServiceNow, Splunk',
        'Open Source Ecosystems',
        'Cloud Infrastructure (AWS, GCP)',
        'Selenium, Cypress, REST Assured',
        'Python, Java, JavaScript',
      ],
    },
  ],
  technicalProficiency: [
    {
      category: 'Languages',
      items: ['Python', 'Go', 'Java', 'JavaScript'],
    },
    {
      category: 'Automation',
      items: ['Selenium', 'Cypress', 'REST Assured', 'JMeter', 'Test Automation Frameworks'],
    },
    {
      category: 'AI/ML',
      items: ['LLM Integration', 'RAG Models', 'AI-Assisted Testing', 'Intelligent Automation'],
    },
    {
      category: 'DevOps & CI/CD',
      items: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'Docker', 'Kubernetes'],
    },
    {
      category: 'Methodologies',
      items: ['Agile (Scrum, Kanban)', 'DevOps', 'Continuous Delivery', 'TDD/BDD'],
    },
    {
      category: 'Platforms',
      items: ['Linux', 'Cloud (AWS, GCP)', 'Enterprise Applications', 'Open Source Ecosystems'],
    },
  ],
  experience: [
    {
      company: 'Red Hat',
      title: 'Senior Manager, Software Engineering, Global',
      period: 'Jan 2023 – Present',
      location: 'Pune, India',
      highlights: [
        'Leading multiple engineering and quality engineering teams delivering enterprise software to global partners and customers.',
        'Scaled distributed engineering teams across India with delivery frameworks meeting global quality and release velocity standards.',
        'Led AI adoption across engineering workflows: AI-assisted testing, code review automation, and intelligent defect triage.',
        'International speaker for 14+ years at Devconf Boston, Czech Republic, FOSSASIA Bangkok, SeleniumConf, ATAGTR, and more.',
        'Established engineering standards: agile methodologies, CI/CD pipelines, automated testing, and code review processes.',
        'Led hiring, onboarding, and development of high-performing technical talent aligned with Red Hat values.',
        'Managed vendor and delivery partner relationships with governance models, SLAs, and continuous improvement.',
        'Championed operational excellence through QA frameworks, reducing production defects and improving release stability.',
      ],
    },
    {
      company: 'Red Hat',
      title: 'Software Engineering Manager',
      period: 'Oct 2021 – Dec 2022',
      location: 'Pune, India',
      highlights: [
        'Managed cross-functional engineering teams supporting global stakeholders across multiple product lines.',
        'Designed testing automation strategies that improved coverage and reduced regression cycle times.',
        'Introduced DevOps best practices and CI/CD improvements, accelerating release cadence with production stability.',
        'Mentored engineers and created career growth paths from QE to software engineering roles.',
        'Collaborated with product management and architecture teams to align execution with business objectives.',
      ],
    },
    {
      company: 'Red Hat',
      title: 'Manager, Quality Engineering',
      period: 'Dec 2018 – Oct 2021',
      location: 'Pune, India',
      highlights: [
        'Built and scaled India-based QA teams from the ground up for enterprise software quality.',
        'Implemented test automation frameworks using Selenium, Cypress, and REST Assured with substantial coverage gains.',
        'Established release management processes and quality gates reducing production defects.',
        'Led agile transformation within QA teams with sprint-based delivery and continuous improvement.',
        'Managed vendor relationships for testing tools and infrastructure.',
      ],
    },
    {
      company: 'Red Hat',
      title: 'Associate Manager, Quality Engineering',
      period: 'Mar 2017 – Nov 2018',
      location: 'Pune, India',
      highlights: [
        'First management role at Red Hat, transitioning from senior IC to people leadership.',
        'Established automated testing pipelines integrated with CI/CD workflows.',
        'Hired and onboarded quality engineers, building a culture of technical excellence.',
        'Coordinated with distributed global teams in an async-first environment.',
      ],
    },
    {
      company: 'Red Hat',
      title: 'Senior Quality Engineer',
      period: 'Jul 2012 – Feb 2017',
      location: 'Pune, India',
      highlights: [
        'Architected test automation frameworks for enterprise applications, reducing manual testing effort.',
        'Led adoption of automated testing tools across multiple product teams as internal SME.',
        'Contributed to open source testing tools aligned with Red Hat\'s open source-first culture.',
        'Mentored junior engineers on automation best practices and professional development.',
      ],
    },
    {
      company: 'Parametric Technology Corporation (PTC)',
      title: 'QA Technical Lead',
      period: 'Jan 2007 – Jun 2012',
      location: 'Pune, India',
      highlights: [
        'Led QA for enterprise PLM applications serving Fortune 500 manufacturing clients.',
        'Designed automation frameworks for complex enterprise workflows across ERP-integrated systems.',
        'Managed cross-functional coordination between development, QA, and product teams globally.',
        'Built expertise in enterprise application architecture and quality assurance for business-critical systems.',
      ],
    },
  ],
  achievements: [
    {
      title: 'AI Thought Leadership',
      description:
        'Presentations at MCP Dev Summit 2026, AITESTFEST 2026, ATAGTR 2025, and FOSSASIA 2026 on integrating AI into engineering/testing workflows. Led team to become AI-native with MCP layers on all services and 90% adoption of agentic SDLC.',
    },
    {
      title: 'Published Author',
      description: 'Author of Agentic AI book on job displacement.',
      link: 'https://www.amazon.in/gp/product/B0H9D341RQ',
    },
    {
      title: 'NPM Package Creator',
      description:
        'Creator of @cognitivelint/cli and @dkoul/auto-testid-core — developer productivity tools used by engineering teams.',
      link: 'https://www.npmjs.com/package/@cognitivelint/cli',
    },
    {
      title: 'India Team Scaling',
      description:
        'Grew India-based engineering and QA teams at Red Hat over 12+ years, from senior IC to senior management serving global stakeholders.',
    },
    {
      title: 'Automation Transformation',
      description:
        'Drove test automation adoption across multiple product teams, establishing frameworks that improved quality metrics and release velocity.',
    },
    {
      title: 'Open Source Contributions',
      description:
        'Built TalkToTalentPool (RAG-based AI for resume analysis), Laburnum (synthetic monitoring), VSCode plugin for xpath2css, and utilities for Selenium, Cypress, and JMeter ecosystems.',
    },
    {
      title: 'Engineering Practice Excellence',
      description:
        'Established agile, CI/CD, and DevOps standards across India-based teams for distributed, async-first collaboration at enterprise scale.',
    },
  ],
  community: [
    {
      organization: 'Pune AI Collective',
      role: 'Founder & Chapter Lead',
      description:
        'Founded and runs a community for sharing practical AI knowledge with enthusiasts and students in Pune.',
    },
  ],
  speaking: [
    '14+ years as an international speaker: talks, tech deep dives, keynotes, and workshops.',
    'Recent events: MCP Dev Summit 2026, AITESTFEST 2026, ATAGTR 2025, FOSSASIA 2026.',
    'Past conferences: Devconf Boston, Czech Republic, FOSSASIA Bangkok, SeleniumConf, ATAGTR, and more.',
    'Invited by BrowserStack and LambdaTest to share vision on AI in test automation.',
    'Active contributor on AI, quality engineering, and automation strategy in the engineering community.',
  ],
  certifications: [
    'Human Leadership — LinkedIn Learning (2022)',
    'Strategic Partnerships: Ecosystems and Platforms — LinkedIn Learning (2022)',
    'Developing Business Acumen — LinkedIn Learning (2021)',
    'Systems Thinking — LinkedIn Learning (2021)',
    'Learning Go — LinkedIn Learning (2021)',
    'Diversity and Inclusion in a Global Enterprise — LinkedIn Learning (2021)',
    'Developing Your Emotional Intelligence — LinkedIn Learning (2020)',
    'Learning Program Management — LinkedIn Learning (2020)',
    'Product Management: Building a Product Roadmap — LinkedIn Learning (2020)',
  ],
  education: ['Masters in Computer Applications (2007)'],
};

function formatCompetencyGroups(groups: CompetencyGroup[]): string[] {
  return groups.flatMap((g) => [`${g.category}:`, ...g.items.map((i) => `- ${i}`), '']);
}

export function buildResumeContext(): string {
  const sections = [
    `Name: ${resume.name}`,
    `Title: ${resume.title} at Red Hat`,
    `Location: ${resume.location}`,
    `Email: ${resume.email}`,
    `GitHub: ${resume.links.github}`,
    `LinkedIn: ${resume.links.linkedin}`,
    `CV Source: ${resume.cvUrl} (updated ${resume.cvLastUpdated})`,
    '',
    'Executive Summary:',
    resume.summary,
    '',
    'Core Competencies:',
    ...formatCompetencyGroups(resume.coreCompetencies),
    'Technical Proficiency:',
    ...formatCompetencyGroups(resume.technicalProficiency),
    '',
    'Professional Experience:',
    ...resume.experience.flatMap((job) => [
      `${job.title} at ${job.company} (${job.period}, ${job.location})`,
      ...job.highlights.map((h) => `- ${h}`),
      '',
    ]),
    'Key Achievements:',
    ...resume.achievements.map((a) => {
      const link = a.link ? ` (${a.link})` : '';
      return `- ${a.title}: ${a.description}${link}`;
    }),
    '',
    'Community Leadership:',
    ...resume.community.map((c) => `${c.role} – ${c.organization}: ${c.description}`),
    '',
    'Speaking & Thought Leadership:',
    ...resume.speaking.map((s) => `- ${s}`),
    '',
    'Certifications:',
    ...resume.certifications.map((c) => `- ${c}`),
    '',
    'Education:',
    ...resume.education.map((e) => `- ${e}`),
  ];

  return sections.join('\n');
}
