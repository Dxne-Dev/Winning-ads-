import type { Metadata } from "next";
import Link from "next/link";
import { PremiumAuth } from "@/components/premium-auth";
import { IconZap } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sign in — Winning Ads AI",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cta/10 blur-3xl" />
      </div>
      <div className="flex flex-col items-center">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 font-semibold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconZap className="h-4 w-4" />
          </span>
          Winning Ads AI
        </Link>
        <PremiumAuth />
      </div>
    </main>
  );
}
