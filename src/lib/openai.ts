import OpenAI from "openai";
import type { AdAnalysis, AdRemix, Ad } from "@/types";

let groq: OpenAI | null = null;

function getClient(): OpenAI {
  if (!groq) {
    groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return groq;
}

function adContext(ad: Partial<Ad>): string {
  return [
    `Headline: ${ad.headline ?? ""}`,
    `Body: ${ad.body ?? ""}`,
    `CTA: ${ad.cta ?? ""}`,
    `Advertiser: ${ad.advertiser ?? ""}`,
    `Niche: ${ad.niche ?? ""}`,
  ].join("\n");
}

const MODEL = "llama-3.3-70b-versatile";

export async function analyzeAd(ad: Partial<Ad>): Promise<AdAnalysis> {
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a senior Meta Ads analyst. Analyze the ad and return strict JSON with keys: hook, marketing_angle, target_audience, psychological_triggers (array of strings), copy_structure, cta, score (number 0-100).",
      },
      { role: "user", content: adContext(ad) },
    ],
  });

  return JSON.parse(completion.choices[0].message.content ?? "{}") as AdAnalysis;
}

export async function remixAd(ad: Partial<Ad>): Promise<AdRemix> {
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a creative Meta Ads copywriter. Given an ad, generate an optimized original remix. Return strict JSON with keys: headlines (array of 3 strings), ad_copy (string), cta (string), image_prompts (array of 3 strings), ugc_video_script (string).",
      },
      { role: "user", content: adContext(ad) },
    ],
  });

  return JSON.parse(completion.choices[0].message.content ?? "{}") as AdRemix;
}
