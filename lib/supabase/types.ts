export type Role = 'admin' | 'editor'

export interface AdminUser {
  id: string
  role: Role
  display_name: string
  created_at: string
}

export interface Trainer {
  id: string
  name: string
  slug: string
  role: string
  specialty_eyebrow: string
  image_url: string | null
  specialties: string[]
  certifications: string[]
  bio: string[]
  availability: Array<{ day: string; hours: string }>
  instagram: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transformation {
  id: string
  trainer_id: string
  client_name: string
  duration: string
  goal: string
  goal_type: 'weight_loss' | 'muscle_gain' | 'athletic_performance' | 'post_rehab'
  before_image_url: string | null
  after_image_url: string | null
  testimonial: string | null
  display_order: number
  created_at: string
}

export interface JournalPost {
  id: string
  title: string
  slug: string
  category: 'Training' | 'Nutrition' | 'Mindset' | 'Recovery'
  excerpt: string | null
  cover_image_url: string | null
  author_name: string
  author_avatar_url: string | null
  body: Record<string, unknown>
  read_time_minutes: number
  is_published: boolean
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  og_image_url: string | null
  canonical_url: string | null
  created_at: string
  updated_at: string
}

export interface CafeMenuItem {
  id: string
  name: string
  category: 'Pre-Workout' | 'Post-Workout' | 'Meals' | 'Juices' | 'Shakes'
  description: string | null
  price: number
  image_url: string | null
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
  calories: number | null
  is_available: boolean
  display_order: number
  created_at: string
  updated_at: string
}
