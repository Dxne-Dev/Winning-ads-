import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconZap } from "@/components/icons";

export const metadata: Metadata = {
  title: "Check your email — Winning Ads AI",
};

export default function ConfirmationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md text-center">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-semibold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconZap className="h-4 w-4" />
          </span>
          Winning Ads AI
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-primary/5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-primary"
              aria-hidden="true"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We&apos;ve sent a confirmation link to your inbox. Click it to
            activate your account and get started.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button>Go to sign in</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to home</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
