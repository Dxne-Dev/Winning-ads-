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

    const adsToInsert = ads.map(ad => ({
      user_id: user.id,
      ...ad,
    }));

    const { data, error } = await supabase
      .from("ads")
      .insert(adsToInsert)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ imported: data?.length || 0 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to import ads" },
      { status: 500 }
    );
  }
}
