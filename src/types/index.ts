export type Ad = {
  id: string;
  source?: string;
  platform: string;
  advertiser?: string;
  thumbnail_url?: string;
  video_url?: string;
  headline?: string;
  body?: string;
  cta?: string;
  niche?: string;
  country?: string;
  engagement: Record<string, unknown>;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
};

export type SavedAd = {
  id: string;
  user_id: string;
  ad_id: string;
  project_id?: string | null;
  note?: string;
  created_at: string;
};

export type AdAnalysis = {
  hook: string;
  marketing_angle: string;
  target_audience: string;
  psychological_triggers: string[];
  copy_structure: string;
  cta: string;
  score: number;
  ctr_estimate: string;
  active_days: string;
  engagement_level: string;
};

export type AdRemix = {
  headlines: string[];
  ad_copy: string;
  cta: string;
  image_prompts: string[];
  ugc_video_script: string;
};

export type AdVariations = {
  variations: {
    hook: string;
    headline: string;
    ad_copy: string;
    cta: string;
    image_prompt: string;
    ugc_script: string;
  }[];
};

export type RemixRequest = {
  id?: string;
  headline?: string;
  body?: string;
  cta?: string;
  advertiser?: string;
  niche?: string;
  brand?: string;
  product?: string;
  tone?: string;
  goal?: string;
  variations?: number;
};

export type AiGeneration = {
  id: string;
  user_id: string;
  ad_id?: string | null;
  project_id?: string | null;
  analysis?: AdAnalysis | null;
  remix?: AdRemix | null;
  created_at: string;
};

export type Profile = {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
};
