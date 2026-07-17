import Link from "next/link";
import { createServerClientForApp } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import {
  IconBookmark,
  IconFolder,
  IconSparkles,
  IconChart,
  IconArrowRight,
  IconGrid,
  IconBrain,
  IconZap,
  IconCheck,
} from "@/components/icons";

const QUICK = [
  {
    href: "/ads",
    title: "Browse ad library",
    description: "Discover high-performing Meta ads across every niche.",
    icon: IconGrid,
    color: "text-primary",
  },
  {
    href: "/ads",
    title: "Analyze an ad",
    description: "Let AI decode the hook, angle, triggers and CTA.",
    icon: IconBrain,
    color: "text-cta",
  },
  {
    href: "/projects",
    title: "Create a project",
    description: "Group winning ads and AI generations into workspaces.",
    icon: IconFolder,
    color: "text-success",
  },
];

export default async function DashboardPage() {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? "";

  const [savedCount, projectCount, genCount] = await Promise.all([
    supabase
      .from("saved_ads")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("ai_generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  const stats = [
    {
      label: "Saved ads",
      value: String(savedCount.count ?? 0),
      icon: IconBookmark,
    },
    {
      label: "Projects",
      value: String(projectCount.count ?? 0),
      icon: IconFolder,
    },
    {
      label: "AI remixes",
      value: String(genCount.count ?? 0),
      icon: IconSparkles,
    },
    {
      label: "Analyses",
      value: String(genCount.count ?? 0),
      icon: IconChart,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your Meta ads intelligence overview."
        action={
          <Link href="/ads">
            <Button size="sm">
              Explore ads
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="group p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <stat.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <IconZap className="h-5 w-5 text-cta" />
          Quick actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {QUICK.map((item) => (
            <Link key={item.title} href={item.href} className="group">
              <Card className="h-full p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-accent ${item.color} transition-all group-hover:scale-110`}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 flex items-center gap-1 font-semibold">
                  {item.title}
                  <IconArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5" />
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <IconChart className="h-4 w-4 text-primary" />
          Activity overview
        </div>
        {genCount.count && genCount.count > 0 ? (
          <div className="mt-6 flex items-end gap-2">
            {[30, 50, 35, 70, 55, 80, 65, 90, 75, 60, 85, 45].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/30 to-primary transition-all hover:from-primary/50 hover:to-primary/80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <IconCheck className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No activity yet — start by saving or analyzing an ad
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
