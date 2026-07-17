import Link from "next/link";
import { createServerClientForApp } from "@/lib/supabase/server";
import { AdAnalyzer } from "@/components/ad-analyzer";
import { SaveButton } from "@/components/save-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/states";
import { IconArrowRight, IconGrid } from "@/components/icons";
import type { Ad } from "@/types";

export default async function AdDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerClientForApp();
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return <ErrorState title="Ad not found" description={error?.message} />;
  }

  const ad = data as Ad;

  return (
    <div className="space-y-8">
      <Link
        href="/ads"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <IconArrowRight className="h-4 w-4 rotate-180" />
        Back to library
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{ad.headline}</h1>
          <div className="mt-2 flex items-center gap-2">
            {ad.niche && <Badge>{ad.niche}</Badge>}
            {ad.advertiser && (
              <p className="text-sm text-muted-foreground">{ad.advertiser}</p>
            )}
          </div>
        </div>
        <SaveButton adId={ad.id} />
      </header>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ad preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
                {ad.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ad.thumbnail_url}
                    alt={ad.headline ?? "Ad"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <IconGrid className="h-8 w-8 text-muted-foreground/40" />
                )}
              </div>
              {ad.body && (
                <p className="text-sm text-muted-foreground">{ad.body}</p>
              )}
              {ad.cta && (
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Call to action
                  </p>
                  <p className="mt-1 text-sm font-medium">{ad.cta}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <AdAnalyzer adId={ad.id} ad={ad} />
        </div>
      </div>
    </div>
  );
}
