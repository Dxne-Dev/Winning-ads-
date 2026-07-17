import type { Metadata } from "next";
import Link from "next/link";
import { createServerClientForApp } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBrain,
  IconChart,
  IconCheck,
  IconSearch,
  IconSparkles,
  IconTarget,
  IconZap,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Winning Ads AI — Meta Ads Intelligence",
  description: "AI-powered Meta Ads intelligence platform.",
};

const BRANDS = ["Meta", "Google", "Shopify", "HubSpot", "Amazon", "TikTok"];

const FEATURES = [
  {
    icon: IconSearch,
    title: "Discover winners",
    description:
      "Browse a curated library of high-performing Meta ads across every niche and format.",
  },
  {
    icon: IconBrain,
    title: "Understand the why",
    description:
      "AI breaks down the hook, angle, audience, psychological triggers, copy structure and CTA.",
  },
  {
    icon: IconSparkles,
    title: "Remix with AI",
    description:
      "Generate original copy, headlines, CTAs, image prompts and UGC video scripts in seconds.",
  },
  {
    icon: IconTarget,
    title: "Ship optimized creatives",
    description:
      "Turn insights into launch-ready variations tailored to your product and audience.",
  },
];

const ANALYSIS = [
  "Hook",
  "Marketing angle",
  "Target audience",
  "Psychological triggers",
  "Copy structure",
  "Call to action",
];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    description: "Explore the library and analyze your first ads.",
    features: ["50 ad views / mo", "5 AI analyses", "1 project"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For marketers shipping winning creatives every week.",
    features: [
      "Unlimited ad library",
      "Unlimited AI analysis",
      "AI creative remix",
      "Unlimited projects",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "/mo",
    description: "Collaborate and scale creative testing across your team.",
    features: ["Everything in Pro", "5 seats", "Shared projects", "Priority support"],
    cta: "Contact sales",
    highlight: false,
  },
];

export default async function Home() {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 shadow-sm shadow-primary/5 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <IconZap className="h-4 w-4" />
            </span>
            Winning Ads AI
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#analysis"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-accent)_0%,transparent_70%)] opacity-70"
          />
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <IconSparkles className="h-3.5 w-3.5 text-cta" />
              AI-powered Meta Ads intelligence
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Discover why winning ads{" "}
              <span className="bg-gradient-to-r from-primary to-[color:var(--color-ring)] bg-clip-text text-transparent">
                actually work
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Explore high-performing Meta ads, let AI decode the strategy behind
              them, and generate optimized original versions — copy, headlines,
              CTAs, image prompts and UGC scripts.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get started free
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/ads">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore ad library
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mx-auto mt-16 max-w-5xl animate-fade-up">
            <div className="rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/10">
              <div className="rounded-xl border border-border bg-muted/40 p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Ads analyzed", value: "12,480", trend: "+18%" },
                    { label: "Avg. hook score", value: "8.6", trend: "+0.4" },
                    { label: "Remixes generated", value: "3,204", trend: "+31%" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-border bg-card p-4 text-left"
                    >
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                      <div className="mt-2 flex items-end justify-between">
                        <p className="font-mono text-2xl font-semibold text-foreground">
                          {stat.value}
                        </p>
                        <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <IconChart className="h-4 w-4 text-primary" />
                      Performance by angle
                    </div>
                    <div className="mt-4 flex h-28 items-end gap-2">
                      {[45, 70, 55, 90, 65, 80, 50].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <IconBrain className="h-4 w-4 text-cta" />
                      Top psychological triggers
                    </div>
                    <ul className="mt-4 space-y-2.5">
                      {["Social proof", "Scarcity", "Curiosity", "Authority"].map(
                        (t, i) => (
                          <li key={t} className="flex items-center gap-3 text-sm">
                            <span className="w-24 text-muted-foreground">{t}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-cta"
                                style={{ width: `${90 - i * 15}%` }}
                              />
                            </div>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="border-y border-border/40 px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Trusted by marketers at
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {BRANDS.map((brand) => (
                <span
                  key={brand}
                  className="text-lg font-semibold tracking-tight text-foreground/40 transition-colors hover:text-foreground/70"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to win on Meta
              </h2>
              <p className="mt-4 text-muted-foreground">
                From discovery to deployment, one intelligent workflow.
              </p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="group animate-fade-up rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Analysis */}
        <section id="analysis" className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <IconBrain className="h-3.5 w-3.5" />
                AI analysis
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Decode any ad in seconds
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our AI dissects every winning ad across six dimensions so you know
                exactly what to replicate — and what to improve.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {ANALYSIS.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-success">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/signup">
                  <Button>
                    Analyze an ad
                    <IconArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <IconSparkles className="h-5 w-5 text-cta" />
                <p className="text-sm font-semibold">AI Creative Remix</p>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  { label: "Headline", value: "Stop guessing. Start scaling." },
                  {
                    label: "Primary copy",
                    value:
                      "The ad intelligence tool marketers use to reverse-engineer winners.",
                  },
                  { label: "CTA", value: "Try Winning Ads AI free" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="rounded-lg border border-border bg-muted/40 p-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {row.label}
                    </p>
                    <p className="mt-1 font-mono text-sm text-foreground">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Loved by ad buyers
              </h2>
              <p className="mt-4 text-muted-foreground">
                See how teams use Winning Ads AI to ship better creatives.
              </p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  quote:
                    "We cut our creative testing time by 60%. The AI analysis tells us exactly what to iterate on.",
                  author: "Sarah Chen",
                  role: "Performance Marketing Lead",
                  company: "GrowFast",
                },
                {
                  quote:
                    "I've reverse-engineered 200+ winning ads in my first month. This tool is a cheat code for Meta ads.",
                  author: "Marcus Johnson",
                  role: "DTC Growth Consultant",
                  company: "PeakCommerce",
                },
                {
                  quote:
                    "The remix feature alone saves us 10+ hours per week. Our CTR improved 34% in two weeks.",
                  author: "Elena Rodriguez",
                  role: "Creative Strategist",
                  company: "AdVantage",
                },
              ].map((t, i) => (
                <div
                  key={t.author}
                  className="animate-fade-up rounded-2xl border border-border bg-card p-6 shadow-sm"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex gap-1 text-cta">
                    {[...Array(5)].map((_, j) => (
                      <svg
                        key={j}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                        aria-hidden
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-sm font-semibold">{t.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-muted-foreground">
                Start free. Upgrade when you&apos;re ready to scale.
              </p>
            </div>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={
                    plan.highlight
                      ? "relative rounded-2xl border-2 border-primary bg-card p-8 shadow-xl shadow-primary/10"
                      : "rounded-2xl border border-border bg-card p-8 shadow-sm"
                  }
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cta px-3 py-1 text-xs font-semibold text-cta-foreground">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-semibold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <IconCheck className="h-4 w-4 text-success" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/signup">
                      <Button
                        variant={plan.highlight ? "primary" : "outline"}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden px-6 py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-20 bottom-1/3 h-80 w-80 rounded-full bg-cta/15 blur-3xl" />
          </div>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary/20 bg-card/90 p-12 shadow-2xl shadow-primary/15 backdrop-blur-xl sm:p-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to find your next winning ad?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join marketers using AI to reverse-engineer winners and ship
                optimized creatives faster.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/signup">
                  <Button variant="cta" size="lg">
                    Get started free
                    <IconArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/ads">
                  <Button variant="ghost" size="lg">
                    Browse ad library
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <IconZap className="h-3.5 w-3.5" />
            </span>
            Winning Ads AI
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Winning Ads AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
