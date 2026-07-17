import { createServerClientForApp } from "@/lib/supabase/server";
import { EmptyState } from "@/components/states";
import { PageHeader } from "@/components/page-header";
import { AdCard } from "@/components/ad-card";
import { IconBookmark } from "@/components/icons";

export default async function SavedAdsPage() {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: savedItems } = await supabase
    .from("saved_ads")
    .select("*, ads(*)")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const ads = savedItems?.map((s) => s.ads).filter(Boolean) ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Saved ads"
        description="Your bookmarked Meta ads."
      />
      {ads.length === 0 ? (
        <EmptyState
          icon={<IconBookmark className="h-6 w-6" />}
          title="No saved ads yet"
          description="Browse the ad library and save ads you want to analyze or remix later."
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
