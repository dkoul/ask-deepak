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

export interface ResumeData {
  name: string;
  title: string;
  location: string;
  email: string;
  summary: string;
  links: {
    github: string;
    linkedin: string;
  };
  skills: string[];
  experience: Experience[];
  community: CommunityRole[];
  speaking: string[];
  education: string[];
}

export const resume: ResumeData = {
  name: 'Deepak Koul',
  title: 'Senior Engineering Manager',
  location: 'Pune, India',
  email: 'deepak.koul@redhat.com',
  summary:
    'Senior Engineering Manager at Red Hat with 18+ years of software product delivery experience in agile and iterative models. I lead teams building digital experiences for Red Hat\'s partner ecosystem, including AI-infused certification workflows on connect.redhat.com. Passionate about engineering excellence, quality advocacy, customer-centric delivery, and building collaborative engineering cultures.',
  links: {
    github: 'https://github.com/dkoul',
    linkedin: 'https://linkedin.com/in/dkoul',
  },
  skills: [
    'Engineering Leadership',
    'Agile & Iterative Delivery',
    'Quality Engineering',
    'AI/ML Product Workflows',
    'SaaS Architecture',
    'Partner Ecosystem Platforms',
    'Test Automation & QA Strategy',
    'Organizational Behavior',
    'Community Building',
    'Technical Speaking',
    'React & Modern Web',
    'Cloud-Native Applications',
  ],
  experience: [
    {
      company: 'Red Hat',
      title: 'Senior Manager, Software Engineering',
      period: 'Jan 2023 – Present',
      location: 'Pune, India',
      highlights: [
        'Lead engineering teams delivering digital experiences for Red Hat\'s partner ecosystem.',
        'Drive AI-infused certification workflows on connect.redhat.com.',
        'Build cultures of excellence, collaboration, and innovation across teams.',
        'Champion quality engineering and customer advocacy in product delivery.',
      ],
    },
    {
      company: 'Red Hat',
      title: 'Software Engineering Manager',
      period: 'Oct 2021 – Dec 2022',
      location: 'Pune, India',
      highlights: [
        'Managed software engineering teams focused on partner certification and ecosystem tooling.',
        'Scaled agile delivery practices and cross-functional collaboration.',
        'Improved engineering quality and release confidence for customer-facing platforms.',
      ],
    },
    {
      company: 'Red Hat',
      title: 'Engineering Manager',
      period: '2018 – 2021',
      location: 'Pune, India',
      highlights: [
        'Led engineering teams in agile product delivery for Red Hat partner platforms.',
        'Established engineering practices around quality, reliability, and customer feedback loops.',
      ],
    },
  ],
  community: [
    {
      organization: 'Pune AI Collective',
      role: 'Chapter Lead',
      description:
        'Lead a community of engineers and AI enthusiasts in Pune, sharing knowledge and fostering collaboration around AI adoption and best practices.',
    },
    {
      organization: 'Ministry of Testing – Pune',
      role: 'Chapter Lead',
      description:
        'Organize events and discussions on quality engineering, test automation, and modern testing practices.',
    },
    {
      organization: 'Culture First – Pune',
      role: 'Chapter Lead',
      description:
        'Engage with HR and people leaders on women in tech, diversity & inclusion, and community building.',
    },
  ],
  speaking: [
    '30+ international conferences on quality engineering, AI, agile delivery, and organizational behavior.',
    'Global Testing Retreat 2024 speaker on engineering leadership and quality advocacy.',
    'Regular talks at testing and agile community events across India.',
  ],
  education: [
    'Engineering background with 18+ years of hands-on software industry experience.',
  ],
};

export function buildResumeContext(): string {
  const sections = [
    `Name: ${resume.name}`,
    `Title: ${resume.title} at Red Hat`,
    `Location: ${resume.location}`,
    `Email: ${resume.email}`,
    `GitHub: ${resume.links.github}`,
    `LinkedIn: ${resume.links.linkedin}`,
    '',
    'Summary:',
    resume.summary,
    '',
    'Skills:',
    resume.skills.join(', '),
    '',
    'Experience:',
    ...resume.experience.flatMap((job) => [
      `${job.title} at ${job.company} (${job.period}, ${job.location})`,
      ...job.highlights.map((h) => `- ${h}`),
      '',
    ]),
    'Community Leadership:',
    ...resume.community.flatMap((c) => [
      `${c.role} – ${c.organization}: ${c.description}`,
    ]),
    '',
    'Speaking:',
    ...resume.speaking.map((s) => `- ${s}`),
    '',
    'Education:',
    ...resume.education.map((e) => `- ${e}`),
  ];

  return sections.join('\n');
}
