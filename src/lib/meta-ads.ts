export type MetaAdArchiveItem = {
  id: string;
  ad_creative_bodies?: string[];
  ad_creative_link_captions?: string[];
  ad_creative_link_descriptions?: string[];
  ad_creative_link_titles?: string[];
  ad_delivery_start_time?: string;
  ad_delivery_stop_time?: string;
  ad_snapshot_url?: string;
  page_name?: string;
  funding_entity?: string;
  ad_creation_time?: string;
};

export type MetaSearchParams = {
  search_terms: string;
  ad_type?: string;
  ad_active_status?: string;
  ad_delivery_date_min?: string;
  ad_delivery_date_max?: string;
  ad_reached_countries?: string[];
  limit?: number;
  page_id?: string;
  search_type?: string;
};

const BASE = "https://graph.facebook.com/v21.0/ads_archive";

export async function searchMetaAds(
  params: MetaSearchParams,
  accessToken: string,
): Promise<{ data: MetaAdArchiveItem[]; error?: string }> {
  const searchParams = new URLSearchParams({
    access_token: accessToken,
    search_terms: params.search_terms,
    ad_type: params.ad_type ?? "ALL",
    ad_active_status: params.ad_active_status ?? "ALL",
    limit: String(params.limit ?? 25),
    fields: [
      "id",
      "ad_creative_bodies",
      "ad_creative_link_captions",
      "ad_creative_link_descriptions",
      "ad_creative_link_titles",
      "ad_snapshot_url",
      "page_name",
      "funding_entity",
      "ad_delivery_start_time",
      "ad_delivery_stop_time",
      "ad_creation_time",
    ].join(","),
    search_type: params.search_type ?? "KEYWORD_UNORDERED",
  });

  if (params.ad_delivery_date_min) {
    searchParams.set("ad_delivery_date_min", params.ad_delivery_date_min);
  }
  if (params.ad_delivery_date_max) {
    searchParams.set("ad_delivery_date_max", params.ad_delivery_date_max);
  }
  if (params.ad_reached_countries?.length) {
    searchParams.set("ad_reached_countries", JSON.stringify(params.ad_reached_countries));
  } else {
    searchParams.set("ad_reached_countries", '["US"]');
  }
  if (params.page_id) {
    searchParams.set("page_id", params.page_id);
  }

  try {
    const res = await fetch(`${BASE}?${searchParams}`);
    const json = await res.json();
    if (json.error) {
      return { data: [], error: json.error.message };
    }
    return { data: json.data ?? [] };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : "Request failed" };
  }
}

export function mapMetaAd(ad: MetaAdArchiveItem) {
  return {
    source: "meta_archive",
    platform: "meta",
    advertiser: ad.page_name ?? ad.funding_entity ?? null,
    thumbnail_url: ad.ad_snapshot_url ?? null,
    headline: ad.ad_creative_link_titles?.[0] ?? null,
    body: ad.ad_creative_bodies?.[0] ?? ad.ad_creative_link_descriptions?.[0] ?? null,
    cta: ad.ad_creative_link_captions?.[0] ?? null,
    niche: null,
    country: null,
    engagement: {},
    meta_ad_id: ad.id,
  };
}
