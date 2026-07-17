"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IconBrain, IconSparkles, IconZap, IconCopy } from "@/components/icons";
import type { AdAnalysis, AdRemix, AdVariations } from "@/types";

export function AdAnalyzer({ adId, ad }: { adId: string; ad: unknown }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AdAnalysis | null>(null);
  const [remix, setRemix] = useState<AdRemix | null>(null);
  const [variations, setVariations] = useState<AdVariations | null>(null);
  const [tab, setTab] = useState<"analysis" | "remix" | "variations">("analysis");

  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [tone, setTone] = useState("professional");
  const [goal, setGoal] = useState("conversions");

  async function run(kind: "analysis" | "remix") {
    setTab(kind);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adId, ...(ad as object) }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      if (kind === "analysis") setAnalysis(data.analysis);
      else setRemix(data.remix);
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function generateVariations() {
    setTab("variations");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/remix-variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: adId,
          ...(ad as object),
          brand,
          product,
          tone,
          goal,
          variations: 5,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setVariations(data);
    } catch {
      setError("Failed to generate variations. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const hasOutput = analysis || remix || variations;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => run("analysis")} disabled={loading}>
          <IconBrain className="h-4 w-4" />
          Analyze
        </Button>
        <Button variant="cta" onClick={() => run("remix")} disabled={loading}>
          <IconSparkles className="h-4 w-4" />
          Remix
        </Button>
      </div>

      {hasOutput && !loading && (
        <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1">
          <TabButton
            active={tab === "analysis"}
            disabled={!analysis}
            onClick={() => setTab("analysis")}
          >
            Analysis
          </TabButton>
          <TabButton
            active={tab === "remix"}
            disabled={!remix}
            onClick={() => setTab("remix")}
          >
            Remix
          </TabButton>
          <TabButton
            active={tab === "variations"}
            disabled={!variations}
            onClick={() => setTab("variations")}
          >
            Variations
          </TabButton>
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {error && !loading && (
        <ErrorState description={error} onRetry={() => (tab === "variations" ? generateVariations() : run(tab))} />
      )}

      {!hasOutput && !loading && !error && (
        <EmptyState
          icon={<IconBrain className="h-6 w-6" />}
          title="No AI output yet"
          description="Run an analysis or remix to see AI-generated insights for this ad."
        />
      )}

      {analysis && tab === "analysis" && !loading && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <IconBrain className="h-5 w-5 text-primary" />
              AI Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              {analysis.ctr_estimate && (
                <Badge
                  variant={
                    analysis.ctr_estimate.toLowerCase().includes("high")
                      ? "default"
                      : analysis.ctr_estimate.toLowerCase().includes("medium")
                        ? "default"
                        : "outline"
                  }
                >
                  CTR: {analysis.ctr_estimate}
                </Badge>
              )}
              <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-sm font-semibold text-primary">
                {analysis.score}/100
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {analysis.active_days && (
                <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                  <span className="text-xs text-muted-foreground">Active</span>
                  <p className="font-medium">{analysis.active_days}</p>
                </div>
              )}
              {analysis.engagement_level && (
                <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                  <span className="text-xs text-muted-foreground">Engagement</span>
                  <p className="font-medium">{analysis.engagement_level}</p>
                </div>
              )}
            </div>
            <Section label="Hook" value={analysis.hook} />
            <Section label="Marketing angle" value={analysis.marketing_angle} />
            <Section label="Target audience" value={analysis.target_audience} />
            <Section label="Psychological triggers" value={analysis.psychological_triggers.join(", ")} />
            <Section label="Copy structure" value={analysis.copy_structure} />
            <Section label="Call to action" value={analysis.cta} />
          </CardContent>
        </Card>
      )}

      {remix && tab === "remix" && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSparkles className="h-5 w-5 text-cta" />
              AI Creative Remix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Headlines
              </p>
              <ul className="mt-2 space-y-2">
                {remix.headlines.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between rounded-lg border border-border bg-muted/40 p-3 text-sm"
                  >
                    <span>{h}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(h)}
                      className="ml-2 shrink-0 text-muted-foreground hover:text-foreground"
                      title="Copy"
                    >
                      <IconCopy className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <Section label="Ad copy" value={remix.ad_copy} />
            <Section label="Call to action" value={remix.cta} />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Image prompts
              </p>
              <ul className="mt-2 space-y-2">
                {remix.image_prompts.map((p, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                UGC video script
              </p>
              <div className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
                {remix.ugc_video_script}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {variations && tab === "variations" && !loading && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconZap className="h-5 w-5 text-cta" />
                Generate Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Brand name"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
                <Input
                  placeholder="Product"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
                <Input
                  placeholder="Tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                />
                <Input
                  placeholder="Goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <Button
                className="mt-4"
                onClick={generateVariations}
                disabled={loading}
              >
                <IconSparkles className="h-4 w-4" />
                Generate 5 variants
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {variations.variations.map((v, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cta/10 text-xs font-bold text-cta">
                      {i + 1}
                    </span>
                    {v.headline}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Section label="Hook" value={v.hook} />
                  <Section label="Ad copy" value={v.ad_copy} />
                  <Section label="CTA" value={v.cta} />
                  <Section label="Image prompt" value={v.image_prompt} />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      UGC script
                    </p>
                    <div className="mt-1 whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
                      {v.ugc_script}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Section({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}
