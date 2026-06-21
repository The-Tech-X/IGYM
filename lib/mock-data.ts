import type { TrainerItem } from '@/components/sections/TrainersPreview';
import type { ArticleItem } from '@/components/sections/JournalPreview';
import type { TransformationItem } from '@/components/sections/TransformationsPreview';
import type { JournalCard } from '@/components/journal/JournalPageContent';

// ─── Landing page ──────────────────────────────────────────────────────────

export const MOCK_TRAINERS: TrainerItem[] = [
  {
    name: 'Arjun Mehta',
    slug: 'arjun-mehta',
    role: 'Strength & Conditioning',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Priya Nair',
    slug: 'priya-nair',
    role: 'Performance Nutrition & Yoga',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51cd?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Rahul Sinha',
    slug: 'rahul-sinha',
    role: 'Athletic Performance',
    image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&q=80&w=800',
  },
];

export const MOCK_ARTICLES: ArticleItem[] = [
  {
    title: 'The Science of Progressive Overload',
    slug: 'science-of-progressive-overload',
    category: 'Training',
    excerpt:
      'Understanding why consistent, measured increases in training stimulus are the single most reliable driver of long-term physical adaptation.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    author: 'Arjun Mehta',
    date: 'June 10, 2026',
  },
  {
    title: 'Nutrition Timing: What the Research Actually Says',
    slug: 'nutrition-timing-research',
    category: 'Nutrition',
    excerpt:
      'Separating evidence-based practice from fitness mythology — a structured look at pre, intra, and post-workout nutrition windows.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
    author: 'Priya Nair',
    date: 'May 28, 2026',
  },
  {
    title: 'Recovery Is Not Optional',
    slug: 'recovery-is-not-optional',
    category: 'Recovery',
    excerpt:
      "Elite athletes spend as much time engineering recovery as they do training. Here's what iGym's protocols look like in practice.",
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    author: 'Rahul Sinha',
    date: 'May 14, 2026',
  },
];

export const MOCK_TRANSFORMATIONS: TransformationItem[] = [
  {
    clientName: 'Vikram R.',
    duration: '16 weeks',
    goal: 'Muscle Gain',
    beforeImg:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    afterImg:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    trainer: 'Arjun Mehta',
  },
  {
    clientName: 'Sneha P.',
    duration: '12 weeks',
    goal: 'Weight Loss',
    beforeImg:
      'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&fit=crop&q=80&w=800',
    afterImg:
      'https://images.unsplash.com/photo-1567013127542-490d757e51cd?auto=format&fit=crop&q=80&w=800',
    trainer: 'Priya Nair',
  },
  {
    clientName: 'Aditya K.',
    duration: '20 weeks',
    goal: 'Athletic Performance',
    beforeImg:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    afterImg:
      'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&q=80&w=800',
    trainer: 'Rahul Sinha',
  },
];

// ─── Trainers list page (/trainers) ───────────────────────────────────────

export const MOCK_TRAINERS_LIST = [
  {
    slug: 'arjun-mehta',
    name: 'Arjun Mehta',
    role: 'Strength & Conditioning',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    specialties: ['Powerlifting', 'Hypertrophy', 'Strength Programming', 'Olympic Lifting'],
  },
  {
    slug: 'priya-nair',
    name: 'Priya Nair',
    role: 'Performance Nutrition & Yoga',
    image:
      'https://images.unsplash.com/photo-1567013127542-490d757e51cd?auto=format&fit=crop&q=80&w=800',
    specialties: ['Macro Coaching', 'Mobility', 'Yoga Therapy', 'Weight Management'],
  },
  {
    slug: 'rahul-sinha',
    name: 'Rahul Sinha',
    role: 'Athletic Performance',
    image:
      'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&q=80&w=800',
    specialties: ['Speed & Agility', 'HIIT', 'CrossFit', 'Metabolic Conditioning'],
  },
];

// ─── Trainer detail pages (/trainers/[slug]) ──────────────────────────────

export type MockTrainerDetail = {
  id: string;
  slug: string;
  name: string;
  role: string;
  image_url: string;
  specialty_eyebrow: string;
  bio: string[];
  certifications: string[];
  specialties: string[];
  availability: { day: string; hours: string }[];
  is_active: boolean;
};

export const MOCK_TRAINER_DETAILS: Record<string, MockTrainerDetail> = {
  'arjun-mehta': {
    id: 'mock-trainer-1',
    slug: 'arjun-mehta',
    name: 'Arjun Mehta',
    role: 'Strength & Conditioning',
    image_url:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1200',
    specialty_eyebrow: 'Elite Strength Coach · 9 Years Experience',
    bio: [
      "Arjun is one of India's most sought-after strength coaches, having trained national-level athletes and competitive powerlifters for nearly a decade. His programming philosophy is rooted in evidence-based sports science and an obsessive attention to movement quality.",
      'At iGym, Arjun designs individualised strength blocks that balance progressive overload with recovery intelligence — ensuring that every client reaches new performance peaks without breaking down in the process.',
    ],
    certifications: [
      'NSCA Certified Strength & Conditioning Specialist (CSCS)',
      'Precision Nutrition Level 2 Coach',
      'FMS Level 2 Practitioner',
      'Westside Barbell Conjugate Method Certified',
    ],
    specialties: ['Powerlifting', 'Hypertrophy', 'Strength Programming', 'Olympic Lifting'],
    availability: [
      { day: 'Monday', hours: '6:00 AM – 8:00 PM' },
      { day: 'Tuesday', hours: '6:00 AM – 8:00 PM' },
      { day: 'Wednesday', hours: '6:00 AM – 6:00 PM' },
      { day: 'Thursday', hours: '6:00 AM – 8:00 PM' },
      { day: 'Friday', hours: '6:00 AM – 8:00 PM' },
      { day: 'Saturday', hours: '8:00 AM – 2:00 PM' },
    ],
    is_active: true,
  },
  'priya-nair': {
    id: 'mock-trainer-2',
    slug: 'priya-nair',
    name: 'Priya Nair',
    role: 'Performance Nutrition & Yoga',
    image_url:
      'https://images.unsplash.com/photo-1567013127542-490d757e51cd?auto=format&fit=crop&q=80&w=1200',
    specialty_eyebrow: 'Nutrition Coach & Yoga Therapist · 7 Years Experience',
    bio: [
      'Priya brings a rare dual expertise to iGym — combining clinical nutrition science with advanced yoga therapy to create a holistic performance model that most coaches overlook. Her clients achieve sustainable results because she addresses both the metabolic and the neurological pillars of physical change.',
      'Having worked with professional athletes, new mothers returning to fitness, and high-stress executives, Priya understands that no two bodies are alike. Every plan she designs is built from a thorough biomechanical and lifestyle assessment.',
    ],
    certifications: [
      'Registered Dietitian (RD)',
      'Precision Nutrition Level 2 Coach',
      'Yoga Alliance RYT-500 Certified',
      'Sports Nutrition Specialist – ISSA',
    ],
    specialties: ['Macro Coaching', 'Mobility', 'Yoga Therapy', 'Weight Management'],
    availability: [
      { day: 'Monday', hours: '7:00 AM – 7:00 PM' },
      { day: 'Wednesday', hours: '7:00 AM – 7:00 PM' },
      { day: 'Thursday', hours: '7:00 AM – 7:00 PM' },
      { day: 'Friday', hours: '7:00 AM – 5:00 PM' },
      { day: 'Saturday', hours: '8:00 AM – 1:00 PM' },
    ],
    is_active: true,
  },
  'rahul-sinha': {
    id: 'mock-trainer-3',
    slug: 'rahul-sinha',
    name: 'Rahul Sinha',
    role: 'Athletic Performance',
    image_url:
      'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&q=80&w=1200',
    specialty_eyebrow: 'Speed, Power & Metabolic Conditioning · 8 Years Experience',
    bio: [
      "Rahul is iGym's specialist in athletic output — the kind of coach who doesn't just build bigger bodies, but faster, more explosive, more resilient ones. His background in sprint coaching and CrossFit methodology gives him a toolkit that very few trainers in Hyderabad can match.",
      "His sessions are intense, structured, and tracked to the millisecond. Whether you're a competitive athlete looking to shave seconds off your time or a professional chasing elite-level conditioning, Rahul's system will challenge and transform you.",
    ],
    certifications: [
      'CrossFit Level 3 Coach (CF-L3)',
      'NSCA Certified Personal Trainer (NSCA-CPT)',
      'EXOS Performance Specialist',
      'USA Track & Field Level 2 Certified',
    ],
    specialties: ['Speed & Agility', 'HIIT', 'CrossFit', 'Metabolic Conditioning'],
    availability: [
      { day: 'Monday', hours: '5:30 AM – 7:00 PM' },
      { day: 'Tuesday', hours: '5:30 AM – 7:00 PM' },
      { day: 'Wednesday', hours: '5:30 AM – 7:00 PM' },
      { day: 'Thursday', hours: '5:30 AM – 7:00 PM' },
      { day: 'Friday', hours: '5:30 AM – 5:00 PM' },
      { day: 'Sunday', hours: '7:00 AM – 12:00 PM' },
    ],
    is_active: true,
  },
};

// ─── Journal list page (/journal) ─────────────────────────────────────────

export const MOCK_JOURNAL_CARDS: JournalCard[] = [
  {
    slug: 'science-of-progressive-overload',
    title: 'The Science of Progressive Overload',
    category: 'Training',
    excerpt:
      'Understanding why consistent, measured increases in training stimulus are the single most reliable driver of long-term physical adaptation.',
    image:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    authorName: 'Arjun Mehta',
    authorAvatar:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=200',
    date: 'June 10, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'nutrition-timing-research',
    title: 'Nutrition Timing: What the Research Actually Says',
    category: 'Nutrition',
    excerpt:
      'Separating evidence-based practice from fitness mythology — a structured look at pre, intra, and post-workout nutrition windows.',
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
    authorName: 'Priya Nair',
    authorAvatar:
      'https://images.unsplash.com/photo-1567013127542-490d757e51cd?auto=format&fit=crop&q=80&w=200',
    date: 'May 28, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'recovery-is-not-optional',
    title: 'Recovery Is Not Optional',
    category: 'Recovery',
    excerpt:
      "Elite athletes spend as much time engineering recovery as they do training. Here's what iGym's protocols look like in practice.",
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    authorName: 'Rahul Sinha',
    authorAvatar:
      'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&q=80&w=200',
    date: 'May 14, 2026',
    readTime: '4 min read',
  },
];

// ─── Journal detail pages (/journal/[slug]) ────────────────────────────────

type TipTapNode = Record<string, unknown>;

function p(text: string): TipTapNode {
  return { type: 'paragraph', content: [{ type: 'text', text }] };
}
function h2(text: string): TipTapNode {
  return { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text }] };
}
function bq(text: string): TipTapNode {
  return { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] };
}
function doc(...nodes: TipTapNode[]): TipTapNode {
  return { type: 'doc', content: nodes };
}

export type MockArticleDetail = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  cover_image_url: string;
  author_name: string;
  author_avatar_url: string;
  published_at: string;
  updated_at: string;
  read_time_minutes: number;
  body: TipTapNode;
  og_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
};

export const MOCK_ARTICLE_DETAILS: Record<string, MockArticleDetail> = {
  'science-of-progressive-overload': {
    slug: 'science-of-progressive-overload',
    title: 'The Science of Progressive Overload',
    category: 'Training',
    excerpt:
      'Understanding why consistent, measured increases in training stimulus are the single most reliable driver of long-term physical adaptation.',
    cover_image_url:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1400',
    author_name: 'Arjun Mehta',
    author_avatar_url:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=200',
    published_at: '2026-06-10T00:00:00Z',
    updated_at: '2026-06-10T00:00:00Z',
    read_time_minutes: 6,
    og_image_url: null,
    meta_title: null,
    meta_description: null,
    canonical_url: null,
    body: doc(
      p('Progressive overload is the foundational principle of resistance training. Without it, the body has no reason to adapt, grow stronger, or change composition. Yet it is one of the most misunderstood and misapplied concepts in modern fitness.'),
      h2('What Progressive Overload Actually Means'),
      p('At its core, progressive overload means exposing your body to a slightly greater training stimulus than it experienced previously. This can be achieved through adding weight, increasing volume, reducing rest periods, improving technique, or improving range of motion — the mechanism matters less than the consistency of the application.'),
      p('Most people understand the "add weight" version, but this is only one lever. A client who goes from 5 reps to 7 reps at the same weight has successfully applied progressive overload. A client who performs the same movement with a 15% better range of motion has done the same.'),
      bq('"Adaptation is the body\'s survival response to stress. Your job as an athlete is to apply that stress in the right dose, at the right time, with the right recovery."'),
      h2('The iGym Approach'),
      p('At iGym, every client programme is built on a periodised progressive overload model. We track load, volume, and movement quality across every session so we can make data-informed adjustments week over week. This removes the guesswork that causes most self-programmed athletes to plateau.'),
      p('The most common error we see in new clients is adding load too quickly, too soon — before the movement pattern has been internalised. This is how injuries happen. Our approach is to earn the right to add load by demonstrating technical mastery first.'),
    ),
  },
  'nutrition-timing-research': {
    slug: 'nutrition-timing-research',
    title: 'Nutrition Timing: What the Research Actually Says',
    category: 'Nutrition',
    excerpt:
      'Separating evidence-based practice from fitness mythology — a structured look at pre, intra, and post-workout nutrition windows.',
    cover_image_url:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1400',
    author_name: 'Priya Nair',
    author_avatar_url:
      'https://images.unsplash.com/photo-1567013127542-490d757e51cd?auto=format&fit=crop&q=80&w=200',
    published_at: '2026-05-28T00:00:00Z',
    updated_at: '2026-05-28T00:00:00Z',
    read_time_minutes: 5,
    og_image_url: null,
    meta_title: null,
    meta_description: null,
    canonical_url: null,
    body: doc(
      p('The fitness industry has spent decades debating whether you should eat before or after training, how large your anabolic window is, and whether carbohydrates are your friend or your enemy. The research, when read carefully, tells a more nuanced story.'),
      h2('The Anabolic Window: Fact vs Fiction'),
      p('For years, the "anabolic window" — the idea that you must consume protein within 30 minutes of training or your workout was wasted — dominated gym culture. More recent meta-analyses show the window is considerably longer, likely 2–4 hours on either side of training.'),
      p('What matters more than precise timing is total daily protein intake. If you hit your target (typically 1.6–2.2g per kilogram of bodyweight), the exact timing of individual meals has a relatively minor effect on hypertrophy outcomes.'),
      bq('"Consistency in daily intake matters infinitely more than optimising an anabolic window that research suggests is far wider than we once believed."'),
      h2('Pre-Workout Nutrition That Actually Works'),
      p('The goal of pre-workout nutrition is simple: ensure you have enough available fuel to train at the intensity your programme demands. For most people, a balanced meal 2–3 hours before training — containing protein, complex carbohydrates, and a small amount of fat — is sufficient.'),
      p('If training early morning, a smaller carbohydrate-based snack 30–45 minutes prior can help sustain output without GI discomfort. The specifics depend on individual tolerance and the training modality.'),
    ),
  },
  'recovery-is-not-optional': {
    slug: 'recovery-is-not-optional',
    title: 'Recovery Is Not Optional',
    category: 'Recovery',
    excerpt:
      "Elite athletes spend as much time engineering recovery as they do training. Here's what iGym's protocols look like in practice.",
    cover_image_url:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1400',
    author_name: 'Rahul Sinha',
    author_avatar_url:
      'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&q=80&w=200',
    published_at: '2026-05-14T00:00:00Z',
    updated_at: '2026-05-14T00:00:00Z',
    read_time_minutes: 4,
    og_image_url: null,
    meta_title: null,
    meta_description: null,
    canonical_url: null,
    body: doc(
      p('The most disciplined athletes in the world share one habit that is rarely photographed or posted about: they prioritise recovery with the same rigour as their training. Not as an afterthought. As a protocol.'),
      h2('Why Most Athletes Under-Recover'),
      p('The cultural narrative around fitness tends to celebrate suffering — more reps, more sessions, more sacrifice. This narrative is not only incomplete, it is physiologically counterproductive. Adaptation occurs during recovery, not during training. Training is the stimulus; recovery is the response.'),
      p('Without adequate recovery, cortisol remains elevated, protein synthesis is suppressed, and the central nervous system remains in a state of chronic fatigue. The result is stagnation at best, injury and burnout at worst.'),
      bq('"You don\'t grow in the gym. You break down in the gym. You grow when you sleep, eat, and deliberately rest."'),
      h2('The iGym Recovery Protocol'),
      p('Every iGym programme includes dedicated deload weeks, structured sleep hygiene coaching, and targeted mobility work. We also use heart rate variability (HRV) tracking with select clients to monitor CNS readiness and adjust training load accordingly.'),
      p('Recovery is not rest for the sake of rest. It is an active, engineered process — as calculated as any strength block or conditioning cycle we design.'),
    ),
  },
};
