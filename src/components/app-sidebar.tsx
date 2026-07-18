"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconLayout,
  IconGrid,
  IconBookmark,
  IconFolder,
  IconZap,
} from "@/components/icons";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: IconLayout },
  { href: "/ad-library", label: "Ad Library", icon: IconGrid },
  { href: "/saved", label: "Saved", icon: IconBookmark },
  { href: "/projects", label: "Projects", icon: IconFolder },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/50 backdrop-blur-sm md:flex">
      <div className="border-b border-border px-5 py-5">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <IconZap className="h-4 w-4" />
          </span>
          Winning Ads AI
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                  active && "text-primary",
                )}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border px-5 py-4">
        <p className="text-xs text-muted-foreground">
          Winning Ads AI v0.1
        </p>
      </div>
    </aside>
  );
}
