import { createServerClientForApp } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/ads", "/saved", "/projects"];

export async function proxy(request: NextRequest) {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if ((path === "/login" || path === "/signup") && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
