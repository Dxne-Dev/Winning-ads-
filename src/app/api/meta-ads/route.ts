import { NextResponse } from "next/server";
import { createServerClientForApp } from "@/lib/supabase/server";
import { searchMetaAds, mapMetaAd } from "@/lib/meta-ads";

export async function GET(request: Request) {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query?.trim()) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { error: "Meta Ads API not configured. Add META_ADS_ACCESS_TOKEN to .env.local" },
      { status: 400 },
    );
  }

  const result = await searchMetaAds(
    {
      search_terms: query.trim(),
      limit: 25,
      ad_active_status: "ALL",
    },
    accessToken,
  );

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ads: result.data.map(mapMetaAd) });
}

export async function POST(request: Request) {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ads } = await request.json();
  if (!Array.isArray(ads) || ads.length === 0) {
    return NextResponse.json({ error: "No ads to import" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("ads")
    .insert(ads.map((a: Record<string, unknown>) => ({
      ...a,
      source: "meta_archive",
      platform: "meta",
    })))
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ imported: data?.length ?? 0 });
}
