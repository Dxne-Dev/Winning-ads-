interface RawAd {
  ad_archive_id?: string;
  id?: string;
  adid?: string;
  ad_id?: string;
  page_id?: string;
  page?: {
    id?: string;
    name?: string;
    page_profile_uri?: string;
    url?: string;
    link?: string;
    like_count?: number;
    fan_count?: number;
  };
  page_name?: string;
  page_profile_uri?: string;
  publisher_platform?: string[] | string;
  publisher_platforms?: string[] | string;
  placement?: {
    platforms?: string[] | string;
    publisher_platform?: string[] | string;
  };
  page_like_count?: number;
  start_date?: number | string;
  end_date?: number | string;
  ad_delivery_start_time?: string;
  ad_delivery_stop_time?: string;
  categories?: string[] | string;
  ad_reached_countries?: string[] | string;
  snapshot?: {
    body?: { text?: string; message?: string; content?: string } | string;
    cta_text?: string;
    cta?: { title?: string; text?: string } | string;
    images?: Array<{ original_image_url?: string; url?: string }>;
  };
  ad_text?: string;
  message?: string;
  creatives?: Array<{
    image_url?: string;
    thumbnail_url?: string;
    media_url?: string;
  }>;
  [key: string]: unknown;
}

interface NormalizedAd {
  ad_archive_id: string | undefined;
  page_id: string | undefined;
  page_name: string | undefined;
  page_profile_uri: string | undefined;
  publisher_platform: string[];
  snapshot: {
    body: { text: string };
    cta_text: string;
    images: Array<{ original_image_url: string }>;
  };
  page_like_count: number;
  start_date: number | string | undefined;
  end_date: number | string | undefined;
  categories: string[];
}

function extractSnapshot(raw: RawAd): NormalizedAd["snapshot"] {
  const snapshot = raw.snapshot || {};
  let bodyText: string | null = null;

  const body = snapshot.body;
  if (typeof body === "object" && body !== null) {
    bodyText = body.text || body.message || body.content || null;
  } else if (typeof body === "string") {
    bodyText = body;
  }

  if (!bodyText) {
    bodyText = raw.ad_text || raw.message || "";
  }

  let ctaText: string = snapshot.cta_text || "";
  if (!ctaText) {
    const cta = snapshot.cta || raw.cta;
    if (typeof cta === "object" && cta !== null) {
      const ctaObj = cta as Record<string, any>;
      ctaText = (ctaObj.title || ctaObj.text || "") as string;
    } else if (typeof cta === "string") {
      ctaText = cta;
    }
  }

  let images: Array<{ original_image_url: string }> = [];
  const rawImages = snapshot.images;
  if (Array.isArray(rawImages)) {
    for (const img of rawImages) {
      if (typeof img === "object" && img !== null) {
        const url = img.original_image_url || img.url;
        if (url) {
          images.push({ original_image_url: url });
        }
      }
    }
  }

  if (images.length === 0) {
    const creatives = raw.creatives;
    if (Array.isArray(creatives)) {
      for (const creative of creatives) {
        if (typeof creative === "object" && creative !== null) {
          const url = creative.image_url || creative.thumbnail_url || creative.media_url;
          if (url) {
            images.push({ original_image_url: url });
          }
        }
      }
    }
  }

  return {
    body: { text: String(bodyText) },
    cta_text: ctaText,
    images,
  };
}

function extractPublisherPlatforms(raw: RawAd): string[] {
  let platforms = raw.publisher_platform || raw.publisher_platforms;

  if (Array.isArray(platforms)) {
    return platforms.map((p) => String(p).toUpperCase());
  }
  if (typeof platforms === "string") {
    return [platforms.toUpperCase()];
  }

  const placement = raw.placement;
  if (typeof placement === "object" && placement !== null) {
    platforms = placement.platforms || placement.publisher_platform;
    if (Array.isArray(platforms)) {
      return platforms.map((p) => String(p).toUpperCase());
    }
    if (typeof platforms === "string") {
      return [platforms.toUpperCase()];
    }
  }

  return [];
}

function extractCategories(raw: RawAd): string[] {
  let categories = raw.categories || raw.ad_reached_countries || [];

  if (Array.isArray(categories)) {
    return categories.map((c) => String(c));
  }
  if (typeof categories === "string") {
    return [categories];
  }

  return [];
}

function normalizeAdRecord(raw: RawAd): NormalizedAd {
  const adArchiveId =
    raw.ad_archive_id || raw.id || raw.adid || raw.ad_id;

  const page = raw.page || {};

  const pageId = raw.page_id || (page.id as string | undefined);
  const pageName = raw.page_name || (page.name as string | undefined);
  const pageProfileUri =
    raw.page_profile_uri ||
    (page.page_profile_uri as string | undefined) ||
    (page.url as string | undefined) ||
    (page.link as string | undefined);

  const publisherPlatform = extractPublisherPlatforms(raw);

  let pageLikeCount =
    raw.page_like_count ||
    (page.like_count as number | undefined) ||
    (page.fan_count as number | undefined) ||
    0;
  if (typeof pageLikeCount !== "number") {
    pageLikeCount = Number(pageLikeCount) || 0;
  }

  const startDate = raw.start_date || raw.ad_delivery_start_time;
  const endDate = raw.end_date || raw.ad_delivery_stop_time;
  const categories = extractCategories(raw);
  const snapshot = extractSnapshot(raw);

  return {
    ad_archive_id: adArchiveId,
    page_id: pageId,
    page_name: pageName,
    page_profile_uri: pageProfileUri,
    publisher_platform: publisherPlatform,
    snapshot,
    page_like_count: pageLikeCount,
    start_date: startDate,
    end_date: endDate,
    categories,
  };
}

export function parseAds(rawData: RawAd[] | { data: RawAd[] }): NormalizedAd[] {
  let items: RawAd[];
  if (typeof rawData === "object" && rawData !== null && "data" in rawData) {
    if (!Array.isArray(rawData.data)) {
      throw new Error("Expected 'data' key with list when passing a dict to parse_ads.");
    }
    items = rawData.data;
  } else if (Array.isArray(rawData)) {
    items = rawData;
  } else {
    throw new TypeError("parse_ads expects a list of dicts or a dict with 'data'.");
  }

  const normalizedAds: NormalizedAd[] = [];
  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    if (typeof item !== "object" || item === null) {
      console.warn(`Skipping non-dict ad record at index ${idx}`);
      continue;
    }
    try {
      const normalized = normalizeAdRecord(item);
      normalizedAds.push(normalized);
    } catch (err) {
      console.error(`Failed to normalize ad at index ${idx}:`, err);
    }
  }
  return normalizedAds;
}
