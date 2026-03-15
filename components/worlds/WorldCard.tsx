"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface WorldCardProps {
  worldId: string;
  name: string;
  description?: string;
  visibility: "public" | "private";
  role: string;
}

const roleBadgeStyles: Record<string, string> = {
  owner: "bg-primary/20 text-primary",
  editor: "bg-blue-500/20 text-blue-400",
  viewer: "bg-muted text-muted-foreground",
};

export function WorldCard({
  worldId,
  name,
  description,
  visibility,
  role,
}: WorldCardProps) {
  return (
    <Link href={`/app/worlds/${worldId}`}>
      <div className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
              roleBadgeStyles[role] ?? roleBadgeStyles.viewer
            )}
          >
            {role}
          </span>
        </div>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        <div className="mt-3">
          <span className="text-xs text-muted-foreground">
            {visibility === "private" ? "Private" : "Public"}
          </span>
        </div>
      </div>
    </Link>
  );
}
