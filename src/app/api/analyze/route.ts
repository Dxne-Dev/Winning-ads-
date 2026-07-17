import { NextResponse } from "next/server";
import { analyzeAd } from "@/lib/openai";
import { createServerClientForApp } from "@/lib/supabase/server";
import type { Ad } from "@/types";

export async function POST(request: Request) {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<Ad>;
  const analysis = await analyzeAd(body);

  await supabase
    .from("ai_generations")
    .insert({ user_id: user.id, ad_id: body.id ?? null, analysis });

  return NextResponse.json({ analysis });
}
