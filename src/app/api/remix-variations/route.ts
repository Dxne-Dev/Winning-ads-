import { NextResponse } from "next/server";
import { remixVariations } from "@/lib/openai";
import { createServerClientForApp } from "@/lib/supabase/server";
import type { RemixRequest } from "@/types";

export async function POST(request: Request) {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as RemixRequest;
  const result = await remixVariations(body);

  await supabase
    .from("ai_generations")
    .insert({ user_id: user.id, ad_id: body.id ?? null, remix: result });

  return NextResponse.json(result);
}
