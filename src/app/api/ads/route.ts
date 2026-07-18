import { NextResponse } from "next/server";

type SampleAd = {
  ad_archive_id: string;
  page_name: string;
  publisher_platform: string[];
  thumbnail_url: string;
  headline: string;
  body: string;
  cta: string;
  niche: string;
  country: string;
  ad_type: string;
  score: number;
  ctr_estimate: string;
  active_days: string;
};

const SAMPLE_ADS: SampleAd[] = [
  {
    ad_archive_id: "3804712299743449",
    page_name: "GlowSkin Lab",
    publisher_platform: ["FACEBOOK"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    headline: "7-Day Glow Skin Routine for Busy Women",
    body: "Try our viral skincare set with proven results in one week. Hydrate, brighten, and protect your skin with just 3 steps.",
    cta: "Shop Now",
    niche: "skincare",
    country: "US",
    ad_type: "VIDEO",
    score: 96,
    ctr_estimate: "Excellent",
    active_days: "278+ days",
  },
  {
    ad_archive_id: "3804712299743450",
    page_name: "FitFuel Co.",
    publisher_platform: ["INSTAGRAM"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1554284126-aa88f22d8f0b?auto=format&fit=crop&w=800&q=80",
    headline: "Transform Your Home Workout in 14 Days",
    body: "Our premium whey protein helps you recover faster, build more muscle, and feel stronger after every session.",
    cta: "Learn More",
    niche: "fitness",
    country: "US",
    ad_type: "CAROUSEL",
    score: 89,
    ctr_estimate: "High",
    active_days: "120+ days",
  },
  {
    ad_archive_id: "3804712299743451",
    page_name: "BrandBoost Apps",
    publisher_platform: ["FACEBOOK"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=800&q=80",
    headline: "Scale Sales with One Smart Marketing Tool",
    body: "Built for eCommerce brands who want fast growth, better ad performance, and no guesswork.",
    cta: "Start Free Trial",
    niche: "saas",
    country: "UK",
    ad_type: "IMAGE",
    score: 82,
    ctr_estimate: "Good",
    active_days: "74+ days",
  },
  {
    ad_archive_id: "3804712299743452",
    page_name: "SkinLab Paris",
    publisher_platform: ["INSTAGRAM"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=800&q=80",
    headline: "Le secret d’une peau éclatante en 3 étapes",
    body: "Découvrez notre routine visage formulée pour hydrater et lisser dès la première application.",
    cta: "Découvrir",
    niche: "beauty",
    country: "FR",
    ad_type: "VIDEO",
    score: 92,
    ctr_estimate: "Excellent",
    active_days: "180+ days",
  },
  {
    ad_archive_id: "3804712299743453",
    page_name: "MoneyFlow",
    publisher_platform: ["FACEBOOK"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1492551550699-0005e8507a2d?auto=format&fit=crop&w=800&q=80",
    headline: "Unlock smarter investing with one app",
    body: "Join thousands of investors who are already growing their portfolios with daily market insights.",
    cta: "Get Started",
    niche: "finance",
    country: "DE",
    ad_type: "IMAGE",
    score: 78,
    ctr_estimate: "Average",
    active_days: "96+ days",
  },
  {
    ad_archive_id: "3804712299743454",
    page_name: "EcoCart",
    publisher_platform: ["INSTAGRAM"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1542838687-29157f04b1e0?auto=format&fit=crop&w=800&q=80",
    headline: "Eco-friendly packaging that converts",
    body: "Make your brand stand out with sustainable packaging designed to increase trust and purchase intent.",
    cta: "View Collection",
    niche: "ecommerce",
    country: "AU",
    ad_type: "IMAGE",
    score: 84,
    ctr_estimate: "Good",
    active_days: "63+ days",
  },
];

function normalizeCountryCode(code: string | null): string {
  if (!code) return "";
  const cleaned = code.toUpperCase();
  if (cleaned === "UK") return "UK";
  return cleaned;
}

function matchesQuery(ad: SampleAd, query: string): boolean {
  if (!query) return true;
  const term = query.toLowerCase();
  return [ad.page_name, ad.headline, ad.body, ad.niche].some((value) =>
    value?.toLowerCase().includes(term),
  );
}

function matchesCountry(ad: SampleAd, country: string | null): boolean {
  if (!country || country === "ALL") return true;
  return normalizeCountryCode(ad.country) === normalizeCountryCode(country);
}

function matchesAdType(ad: SampleAd, adType: string | null): boolean {
  if (!adType || adType === "ALL") return true;
  return ad.ad_type.toUpperCase() === adType.toUpperCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const country = searchParams.get("country") ?? "";
    const adType = searchParams.get("ad_type") ?? "ALL";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 10;

    const filteredAds = SAMPLE_ADS.filter(
      (ad) =>
        matchesQuery(ad, q) &&
        matchesCountry(ad, country) &&
        matchesAdType(ad, adType),
    ).slice(0, limit);

    const mappedAds = filteredAds.map((ad) => ({
      source: "meta_archive",
      platform: ad.publisher_platform[0] || "meta",
      advertiser: ad.page_name || null,
      thumbnail_url: ad.thumbnail_url || null,
      headline: ad.headline || null,
      body: ad.body || null,
      cta: ad.cta || null,
      niche: ad.niche || null,
      country: ad.country || null,
      format: ad.ad_type || null,
      score: ad.score,
      ctr_estimate: ad.ctr_estimate,
      active_days: ad.active_days,
      meta_ad_id: ad.ad_archive_id,
    }));

    return NextResponse.json({ ads: mappedAds });
  } catch (error: any) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch ads" },
      { status: 500 },
    );
  }
}
