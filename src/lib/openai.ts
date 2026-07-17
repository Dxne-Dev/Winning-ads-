import OpenAI from "openai";
import type { Ad, AdAnalysis, AdRemix, AdVariations, RemixRequest } from "@/types";

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

function remixContext(req: RemixRequest): string {
  return [
    `Original headline: ${req.headline ?? ""}`,
    `Original body: ${req.body ?? ""}`,
    `Original CTA: ${req.cta ?? ""}`,
    `Original advertiser: ${req.advertiser ?? ""}`,
    `Niche: ${req.niche ?? ""}`,
    `Brand name: ${req.brand ?? ""}`,
    `Product description: ${req.product ?? ""}`,
    `Tone: ${req.tone ?? "professional"}`,
    `Goal: ${req.goal ?? "conversions"}`,
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
          "You are a senior Meta Ads analyst. Analyze the ad and return strict JSON with keys: hook, marketing_angle, target_audience, psychological_triggers (array of strings), copy_structure, cta, score (number 0-100), ctr_estimate (string like 'High' / 'Medium' / 'Low'), active_days (string like '278+ days'), engagement_level (string like 'Excellent' / 'Good' / 'Average').",
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
          "You are a creative Meta Ads copywriter. Given an ad, generate an optimized original remix. Return strict JSON with keys: headlines (array of 3 strings), ad_copy (string), cta (string), image_prompts (array of 3 strings), ugc_video_script (string formatted as numbered scenes: 'Scene 1: ...\nScene 2: ...\nScene 3: ...\nScene 4: ...\nScene 5: ...').",
      },
      { role: "user", content: adContext(ad) },
    ],
  });

  return JSON.parse(completion.choices[0].message.content ?? "{}") as AdRemix;
}

export async function remixVariations(req: RemixRequest): Promise<AdVariations> {
  const count = req.variations ?? 5;
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a creative Meta Ads copywriter. Given an ad and brand info, generate ${count} distinct original variations. Return strict JSON with key "variations" which is an array of objects, each with keys: hook, headline, ad_copy, cta, image_prompt, ugc_script. Each variation must be unique in angle and approach. ugc_script must be formatted as numbered scenes.`,
      },
      { role: "user", content: remixContext(req) },
    ],
  });

  return JSON.parse(completion.choices[0].message.content ?? "{}") as AdVariations;
}
