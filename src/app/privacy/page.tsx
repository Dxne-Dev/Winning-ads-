import type { Metadata } from "next";
import Link from "next/link";
import { IconZap } from "@/components/icons";

export const metadata: Metadata = {
  title: "Privacy Policy — Winning Ads AI",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2 font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <IconZap className="h-4 w-4" />
        </span>
        Winning Ads AI
      </Link>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 17, 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p className="mt-2">
            We collect information you provide when creating an account (name, email address)
            and data related to your use of the platform (saved ads, projects, AI analyses).
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <p className="mt-2">
            Your information is used to provide and improve the service, process AI analyses,
            and communicate with you about your account.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Data Sharing</h2>
          <p className="mt-2">
            We do not sell your personal data. We may share anonymized data with third-party
            AI providers (Groq) solely for processing your analysis requests.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Data Retention</h2>
          <p className="mt-2">
            We retain your account data until you delete your account. AI analysis results
            are stored for the duration of your account.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Your Rights</h2>
          <p className="mt-2">
            You can access, modify, or delete your personal data at any time through your
            account settings or by contacting us.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Contact</h2>
          <p className="mt-2">
            For privacy-related inquiries, contact us at privacy@winningads.app.
          </p>
        </section>
      </div>
    </main>
  );
}
