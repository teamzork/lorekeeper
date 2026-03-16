"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UserCircle, MapPin, Swords, Gem, BookOpen } from "lucide-react";

const entityLabels = [
  { key: "character", label: "Characters", icon: UserCircle },
  { key: "place", label: "Places", icon: MapPin },
  { key: "faction", label: "Factions", icon: Swords },
  { key: "artifact", label: "Artifacts", icon: Gem },
  { key: "lore", label: "Lore", icon: BookOpen },
];

export default function WorldOverviewPage() {
  const params = useParams();
  const worldId = params.worldId as Id<"worlds">;
  const counts = useQuery(api.entities.count, { worldId });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">World Overview</h2>

      {counts === undefined ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : counts === null ? null : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {entityLabels.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="rounded-lg border border-border bg-card p-4 text-center"
            >
              <Icon className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{counts[key] ?? 0}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
