import { resume } from '../data/resume';

/** Questions must relate to Deepak's professional profile */
const ON_TOPIC_SIGNALS = [
  'deepak',
  'koul',
  'dkoul',
  'red hat',
  'redhat',
  'resume',
  'cv',
  'skill',
  'experience',
  'career',
  'job',
  'work',
  'role',
  'position',
  'contact',
  'email',
  'linkedin',
  'github',
  'hire',
  'hiring',
  'recruit',
  'speak',
  'conference',
  'talk',
  'presentation',
  'community',
  'chapter',
  'achievement',
  'accomplish',
  'engineer',
  'manager',
  'leadership',
  'quality',
  'testing',
  'agile',
  'pune',
  'background',
  'profile',
  'interview',
  'certification',
  'connect.redhat',
  'partner ecosystem',
  'pune ai',
  'ai collective',
  'book',
  'author',
  'amazon',
  'npm',
  'cognitivelint',
  'testid',
  'mcp',
  'agentic',
  'fossasia',
  'devconf',
  'selenium',
  'cypress',
  'ptc',
  'parametric',
  'open source',
  'talktotalentpool',
  'laburnum',
  'who are you',
  'who is',
  'about him',
  'about deepak',
  'tell me about',
  'introduce',
  'his ',
  ' he ',
  ' him',
  'your background',
  'your experience',
  'your skills',
  'where does',
  'where is',
  'how can i reach',
  'how to contact',
  'what does he',
  'what did he',
  'what has he',
  'years of experience',
  'mentor',
  'mentorship',
  'meetup',
  'jd',
  'job description',
  'job desc',
  'invite',
  'keynote',
  'workshop',
  'redhat',
];

const OFF_TOPIC_PATTERNS = [
  /\b(write|tell me a|give me a|compose)\s+(a\s+)?(joke|poem|story|song|essay|code snippet)/i,
  /\b(weather|forecast|temperature)\b/i,
  /\b(stock|crypto|bitcoin|ethereum)\b/i,
  /\b(solve|calculate|what is)\s+\d/i,
  /\b(homework|assignment)\b/i,
  /\b(who is (the )?president|capital of|population of)\b/i,
  /\b(ignore (previous|above|all)|pretend you are|act as|you are now)\b/i,
  /\b(dan|gpt|chatgpt|openai|deepseek)\b/i,
  /\b(recipe|cook|recipe for)\b/i,
  /\b(movie|film|sport|football|cricket score)\b/i,
  /\b(translate .+ to)\b/i,
  /\b(generate (an? )?image|draw a)\b/i,
];

const GREETING_PATTERN = /^(hi|hello|hey|good (morning|afternoon|evening))[!?.\s]*$/i;

export const OFF_TOPIC_REFUSAL =
  "Whoa, that's outside my bubble 🫧 — I only chat about Deepak Koul's career, skills, experience, achievements, community work, speaking, and how to reach him. Ask me something about him!";

export const GREETING_RESPONSE = `Hey! I'm Bubbly 🫧 — your guide to ${resume.name}, ${resume.title} at Red Hat. Ask about his experience, skills, wins, community work, or how to get in touch.`;

export function isOnTopicQuestion(question: string): boolean {
  const q = question.toLowerCase().trim();

  if (GREETING_PATTERN.test(q)) {
    return true;
  }

  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(q)) {
      return false;
    }
  }

  for (const signal of ON_TOPIC_SIGNALS) {
    if (q.includes(signal)) {
      return true;
    }
  }

  return false;
}

export function getTopicRefusalOrGreeting(question: string): string | null {
  const q = question.trim();
  if (GREETING_PATTERN.test(q)) {
    return GREETING_RESPONSE;
  }
  if (!isOnTopicQuestion(q)) {
    return OFF_TOPIC_REFUSAL;
  }
  return null;
}

export function truncateAnswer(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return trimmed.slice(0, maxLength - 1).trimEnd() + '…';
}
