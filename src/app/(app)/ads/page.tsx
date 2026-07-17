import { createServerClientForApp } from "@/lib/supabase/server";
import { AdCard } from "@/components/ad-card";
import { EmptyState } from "@/components/states";
import { PageHeader } from "@/components/page-header";
// import { MetaAdsSearch } from "@/components/meta-ads-search";
import { IconGrid } from "@/components/icons";
import type { Ad } from "@/types";

export default async function AdsPage() {
  const supabase = await createServerClientForApp();
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const ads = ((error ? [] : data) ?? []) as Ad[];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Ad Library"
        description="Discover high-performing Meta ads."
      />

      {/* <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium">
          <IconSparkles className="h-4 w-4 text-cta" />
          Import from Meta Ads Library
        </div>
        <MetaAdsSearch />
      </div> */}

      {ads.length === 0 ? (
        <EmptyState
          icon={<IconGrid className="h-6 w-6" />}
          title="No ads yet"
          description="Search and import ads from the Meta Ads Library above."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
