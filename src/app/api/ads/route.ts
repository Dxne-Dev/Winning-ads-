import { NextResponse } from "next/server";
import { parseAds } from "@/lib/facebook-ads-scraper";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const country = searchParams.get("country");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;

    // TODO: Replace this with actual scraping logic!
    // For now, use sample data to demonstrate the API works
    const sampleRawData = [
      {
        ad_archive_id: "3804712299743449",
        page_id: "571062419989773",
        page_name: "Debonair Men's Salon",
        publisher_platform: ["FACEBOOK", "INSTAGRAM"],
        snapshot: {
          body: {
            text: "Time is money, and we’re saving you both! Seize the day with a grand discount on all services..."
          },
          cta_text: "Send WhatsApp message",
          images: [
            {
              original_image_url: "https://scontent-ams4-1.xx.fbcdn.net/v/t39.35426-6/464806700_514824171533348.jpg"
            }
          ]
        },
        page_profile_uri: "https://www.facebook.com/debonairmensalon/",
        page_like_count: 87467,
        start_date: 1730271600,
        end_date: 1730271600,
        categories: ["UNKNOWN"]
      }
    ];

    const normalizedAds = parseAds(sampleRawData);
    
    const mappedAds = normalizedAds.map((ad) => ({
      source: "meta_archive",
      platform: ad.publisher_platform?.[0] || "meta",
      advertiser: ad.page_name || null,
      thumbnail_url: ad.snapshot?.images?.[0]?.original_image_url || null,
      headline: ad.snapshot?.cta_text || null,
      body: ad.snapshot?.body?.text || null,
      cta: ad.snapshot?.cta_text || null,
      niche: null,
      meta_ad_id: ad.ad_archive_id,
    }));

    return NextResponse.json({ ads: mappedAds });
  } catch (error: any) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch ads" },
      { status: 500 }
    );
  }
}
