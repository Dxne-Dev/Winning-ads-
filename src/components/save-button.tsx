"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconBookmark } from "@/components/icons";

export function SaveButton({ adId }: { adId: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/saved-ads?ad_id=${adId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.saved !== undefined) setSaved(d.saved);
      })
      .catch(() => {});
  }, [adId]);

  async function toggle() {
    setLoading(true);
    try {
      if (saved) {
        await fetch("/api/saved-ads", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ad_id: adId }),
        });
        setSaved(false);
      } else {
        await fetch("/api/saved-ads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ad_id: adId }),
        });
        setSaved(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant={saved ? "primary" : "outline"}
      onClick={toggle}
      disabled={loading}
    >
      <IconBookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
