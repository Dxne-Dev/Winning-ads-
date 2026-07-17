"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconGrid, IconSearch, IconArrowRight, IconSparkles } from "@/components/icons";

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

export function MetaAdsSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoundAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    setImported(0);
    try {
      const res = await fetch(`/api/meta-ads?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setResults(data.ads ?? []);
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
      const res = await fetch("/api/meta-ads", {
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
      <div className="flex gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder='Search Meta Ads Library (e.g. "fitness", "beauty", "finance")'
            className="pl-10"
          />
        </div>
        <Button onClick={search} disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </Button>
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
                  className={`overflow-hidden transition-all ${
                    selected.has(i)
                      ? "border-primary ring-2 ring-primary/30"
                      : "hover:border-primary/40"
                  }`}
                >
                  <div className="flex aspect-video w-full items-center justify-center overflow-hidden bg-muted">
                    {ad.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
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
