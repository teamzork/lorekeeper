"use client";

import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  MapPin,
  Swords,
  Gem,
  BookOpen,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";

const tabs = [
  { label: "Overview", href: "", icon: LayoutDashboard },
  { label: "Characters", href: "/entities?type=character", icon: UserCircle },
  { label: "Places", href: "/entities?type=place", icon: MapPin },
  { label: "Factions", href: "/entities?type=faction", icon: Swords },
  { label: "Artifacts", href: "/entities?type=artifact", icon: Gem },
  { label: "Lore", href: "/entities?type=lore", icon: BookOpen },
  { label: "Members", href: "/members", icon: Users },
];

export function EntityNav() {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const worldId = params.worldId as string;
  const basePath = `/worlds/${worldId}`;

  function isActive(tab: (typeof tabs)[number]) {
    if (tab.href === "") {
      // Overview: active when on exact world path
      return pathname === basePath;
    }
    if (tab.href.startsWith("/entities")) {
      // Entity tabs: match path + query param
      const type = new URLSearchParams(tab.href.split("?")[1]).get("type");
      return pathname === `${basePath}/entities` && searchParams.get("type") === type;
    }
    return pathname === `${basePath}${tab.href}`;
  }

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border pb-px">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab);
        return (
          <Link
            key={tab.label}
            href={`${basePath}${tab.href}`}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-t-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
