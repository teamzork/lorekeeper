"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { EntityCard } from "@/components/entities/EntityCard";
import { CreateEntityDialog } from "@/components/entities/CreateEntityDialog";
import { UserCircle, MapPin, Swords, Gem, BookOpen } from "lucide-react";

const entityMeta: Record<string, { label: string; icon: React.ElementType }> = {
  character: { label: "Characters", icon: UserCircle },
  place: { label: "Places", icon: MapPin },
  faction: { label: "Factions", icon: Swords },
  artifact: { label: "Artifacts", icon: Gem },
  lore: { label: "Lore", icon: BookOpen },
};

export default function EntitiesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const worldId = params.worldId as Id<"worlds">;
  const type = searchParams.get("type") ?? "character";
  const meta = entityMeta[type] ?? entityMeta.character;
  const Icon = meta.icon;

  const entities = useQuery(api.entities.list, {
    worldId,
    entityType: type as any,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">{meta.label}</h2>
        <CreateEntityDialog
          worldId={worldId}
          entityType={type}
          entityLabel={meta.label.replace(/s$/, "")}
        />
      </div>

      {entities === undefined ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : entities.length === 0 ? (
        <div className="text-center py-12">
          <Icon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No {meta.label.toLowerCase()} yet</h3>
          <p className="mt-2 text-muted-foreground mb-6">
            Create your first one to get started.
          </p>
          <CreateEntityDialog
            worldId={worldId}
            entityType={type}
            entityLabel={meta.label.replace(/s$/, "")}
          />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {entities.map((entity: any) => (
            <EntityCard
              key={entity._id}
              entity={entity}
              entityType={type}
              worldId={worldId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
