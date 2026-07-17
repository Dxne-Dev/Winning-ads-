"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IconGrid, IconSearch, IconArrowRight, IconSparkles, IconTarget } from "@/components/icons";
import { parseAds } from "@/lib/facebook-ads-scraper";

type FoundAd = {
  source: string;
  platform: string;
  advertiser: string | null;
  thumbnail_url: string | null;
  headline: string | null;
  body: string | null;
  cta: string | null;
  niche: string | null;
};

const NICHE_PRESETS = [
  "fitness",
  "beauty",
  "skincare",
  "finance",
  "saas",
  "ecommerce",
  "fashion",
  "health",
  "real estate",
  "education",
];

const FORMATS = [
  { value: "ALL", label: "All formats" },
  { value: "VIDEO", label: "Video" },
  { value: "IMAGE", label: "Image" },
  { value: "CAROUSEL", label: "Carousel" },
];

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
];

export function MetaAdsSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [adType, setAdType] = useState("ALL");
  const [country, setCountry] = useState("US");
  const [results, setResults] = useState<FoundAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  async function search(niche?: string) {
    const term = niche ?? query.trim();
    if (!term) return;
    if (niche) setQuery(niche);
    setLoading(true);
    setError("");
    setResults([]);
    try {
      // TODO: Replace this with actual API call to fetch ads!
      // For now, use sample data to test the parser!
      const sampleRawData = [
        {
          ad_archive_id: "3804712299743449",
          page_id: "571062419989773",
          page_name: "Debonair Men's Salon",
          publisher_platform: ["FACEBOOK", "INSTAGRAM"],
          snapshot: {
            body: {
              text: "Time is money, and we’re saving you both! Seize the day with a grand discount on all services..."
            },
            cta_text: "Send WhatsApp message",
            images: [
              {
                original_image_url: "https://scontent-ams4-1.xx.fbcdn.net/v/t39.35426-6/464806700_514824171533348.jpg"
              }
            ]
          },
          page_profile_uri: "https://www.facebook.com/debonairmensalon/",
          page_like_count: 87467,
          start_date: 1730271600,
          end_date: 1730271600,
          categories: ["UNKNOWN"]
        }
      ];
      const normalizedAds = parseAds(sampleRawData);
      const mappedAds = normalizedAds.map((ad) => ({
        source: "meta_archive",
        platform: ad.publisher_platform?.[0] || "meta",
        advertiser: ad.page_name || null,
        thumbnail_url: ad.snapshot?.images?.[0]?.original_image_url || null,
        headline: ad.snapshot?.cta_text || null,
        body: ad.snapshot?.body?.text || null,
        cta: ad.snapshot?.cta_text || null,
        niche: null,
        meta_ad_id: ad.ad_archive_id,
      }));
      setResults(mappedAds);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  async function importSelected() {
    const toImport = Array.from(selected).map((i) => results[i]);
    if (!toImport.length) return;
    setImporting(true);
    try {
      const res = await fetch("/api/saved-ads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ads: toImport }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      setImported(data.imported ?? 0);
      setSelected(new Set());
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  const showResults = results.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder='Search Meta Ads Library (e.g., "fitness", "beauty", "finance")'
              className="pl-10"
            />
          </div>
          <Button onClick={() => search()} disabled={loading || !query.trim()}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <IconTarget className="h-4 w-4 text-muted-foreground" />
          {NICHE_PRESETS.map((n) => (
            <button
              key={n}
              onClick={() => search(n)}
              className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:text-foreground"
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Format</label>
            <select
              value={adType}
              onChange={(e) => setAdType(e.target.value)}
              className="rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-foreground"
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-foreground"
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {showResults && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {results.length} ads found
            </p>
            {selected.size > 0 && (
              <Button
                size="sm"
                variant="cta"
                onClick={importSelected}
                disabled={importing}
              >
                {importing
                  ? "Importing..."
                  : `Import ${selected.size} ad${selected.size > 1 ? "s" : ""}`}
              </Button>
            )}
          </div>
          {imported > 0 && (
            <div className="rounded-xl border border-success/30 bg-success/10 p-3 text-sm text-success">
              {imported} ad{imported > 1 ? "s" : ""} imported!
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((ad, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className="group block w-full text-left"
              >
                <Card
                  className={cn(
                    "overflow-hidden transition-all",
                    selected.has(i)
                      ? "border-primary ring-2 ring-primary/30"
                      : "hover:border-primary/40"
                  )}
                >
                  <div className="flex aspect-video w-full items-center justify-center overflow-hidden bg-muted">
                    {ad.thumbnail_url ? (
                      <img
                        src={ad.thumbnail_url}
                        alt={ad.headline ?? "Ad"}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <IconGrid className="h-8 w-8 text-muted-foreground/40" />
                    )}
                  </div>
                  <CardContent className="space-y-2 p-4">
                    <p className="line-clamp-2 text-sm font-medium">
                      {ad.headline ?? "Untitled"}
                    </p>
                    {ad.body && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {ad.body}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      {ad.advertiser && (
                        <Badge variant="outline">{ad.advertiser}</Badge>
                      )}
                      {ad.cta && (
                        <span className="text-xs text-muted-foreground">
                          {ad.cta}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
