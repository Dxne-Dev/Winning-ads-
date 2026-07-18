import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconGrid } from "@/components/icons";
import type { Ad } from "@/types";

export function AdCard({ ad }: { ad: Ad }) {
  return (
    <Link href={`/ad-library/${ad.id}`} className="group block">
      <Card className="overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-muted">
          {ad.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ad.thumbnail_url}
              alt={ad.headline ?? "Ad thumbnail"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <IconGrid className="h-8 w-8 text-muted-foreground/40" />
          )}
        </div>
        <div className="space-y-2 p-4">
          <p className="line-clamp-2 text-sm font-medium text-foreground">
            {ad.headline}
          </p>
          <div className="flex items-center justify-between gap-2">
            {ad.niche && <Badge variant="outline">{ad.niche}</Badge>}
            {ad.advertiser && (
              <p className="truncate text-xs text-muted-foreground">
                {ad.advertiser}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
