import { createServerClientForApp } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = await createServerClientForApp();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const fullName = String(formData.get("full_name") ?? "");
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const supabase = await createServerClientForApp();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      data: { full_name: fullName },
      emailRedirectTo: `${appUrl}/auth/callback`
    },
  });
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  redirect("/signup/confirmation");
}

export async function signOutAction() {
  "use server";
  const supabase = await createServerClientForApp();
  await supabase.auth.signOut();
  redirect("/login");
}
