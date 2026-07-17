import { NextResponse } from "next/server";
import { createServerClientForApp } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const adId = searchParams.get("ad_id");

  if (adId) {
    const { data } = await supabase
      .from("saved_ads")
      .select("id")
      .eq("user_id", user.id)
      .eq("ad_id", adId)
      .maybeSingle();
    return NextResponse.json({ saved: !!data });
  }

  const { data, error } = await supabase
    .from("saved_ads")
    .select("*, ads(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ saved_ads: data });
}

export async function POST(request: Request) {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ad_id, project_id, note } = await request.json();
  const { error } = await supabase
    .from("saved_ads")
    .insert({ user_id: user.id, ad_id, project_id, note });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ad_id } = await request.json();
  const { error } = await supabase
    .from("saved_ads")
    .delete()
    .eq("user_id", user.id)
    .eq("ad_id", ad_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
