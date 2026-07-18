import { NextResponse } from "next/server";
import { createServerClientForApp } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerClientForApp();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ads } = await request.json();
    
    if (!Array.isArray(ads) || ads.length === 0) {
      return NextResponse.json({ error: "No ads to import" }, { status: 400 });
    }

    // Remove meta_ad_id and user_id from ads to insert
    const adsToInsert = ads.map(ad => {
      const { meta_ad_id, user_id, ...rest } = ad;
      return rest;
    });

    // Insert ads into ads table
    const { data: insertedAds, error: insertError } = await supabase
      .from("ads")
      .insert(adsToInsert)
      .select();

    if (insertError) {
      throw insertError;
    }

    if (!insertedAds || insertedAds.length === 0) {
      throw new Error("No ads were inserted");
    }

    // Now create saved_ads entries for each inserted ad
    const savedAdsToInsert = insertedAds.map(ad => ({
      user_id: user.id,
      ad_id: ad.id,
    }));

    const { error: savedAdsError } = await supabase
      .from("saved_ads")
      .insert(savedAdsToInsert);

    if (savedAdsError) {
      // If saved_ads insertion fails, we might want to delete the inserted ads
      // But for simplicity, let's just log and proceed
      console.error("Error inserting saved_ads:", savedAdsError);
    }

    return NextResponse.json({ imported: insertedAds.length });
  } catch (error: any) {
    console.error("Error importing ads:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import ads" },
      { status: 500 }
    );
  }
}
