"use client";

import { useEffect, useState } from "react";

export function CurrentYear() {
  const [year, setYear] = useState<string | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);
  return <span>{year}</span>;
}
