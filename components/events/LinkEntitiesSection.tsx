"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserCircle, MapPin, Swords, Gem, BookOpen, X, Plus } from "lucide-react";

interface EntityLink {
  entityId: string;
  entityType: string;
  entityName: string;
}

interface LinkEntitiesSectionProps {
  worldId: Id<"worlds">;
  value: EntityLink[];
  onChange: (links: EntityLink[]) => void;
}

const entityTypeConfig: Record<string, { label: string; pluralLabel: string; icon: React.ElementType }> = {
  character: { label: "Character", pluralLabel: "Characters", icon: UserCircle },
  place: { label: "Place", pluralLabel: "Places", icon: MapPin },
  faction: { label: "Faction", pluralLabel: "Factions", icon: Swords },
  artifact: { label: "Artifact", pluralLabel: "Artifacts", icon: Gem },
  lore: { label: "Lore", pluralLabel: "Lore", icon: BookOpen },
};

const entityTypes = ["character", "place", "faction", "artifact", "lore"] as const;

export function LinkEntitiesSection({ worldId, value, onChange }: LinkEntitiesSectionProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("character");

  const entities = useQuery(api.entities.list, {
    worldId,
    entityType: selectedType as any,
  });

  const linkedIds = new Set(value.map((l) => l.entityId));

  function addLink(entity: { _id: string; name: string }) {
    if (linkedIds.has(entity._id)) return;
    onChange([
      ...value,
      { entityId: entity._id, entityType: selectedType, entityName: entity.name },
    ]);
  }

  function removeLink(entityId: string) {
    onChange(value.filter((l) => l.entityId !== entityId));
  }

  // Group current links by type for display
  const groupedLinks: Record<string, EntityLink[]> = {};
  for (const link of value) {
    if (!groupedLinks[link.entityType]) {
      groupedLinks[link.entityType] = [];
    }
    groupedLinks[link.entityType].push(link);
  }

  return (
    <div className="space-y-3">
      <Label>Linked Entities</Label>

      {/* Current links as chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((link) => {
            const config = entityTypeConfig[link.entityType];
            const Icon = config?.icon ?? UserCircle;
            return (
              <span
                key={link.entityId}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs"
              >
                <Icon className="h-3 w-3 text-muted-foreground" />
                {link.entityName}
                <button
                  type="button"
                  onClick={() => removeLink(link.entityId)}
                  className="ml-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Add entity picker */}
      {!pickerOpen ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPickerOpen(true)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Link entity
        </Button>
      ) : (
        <div className="rounded-md border border-border bg-background p-3 space-y-3">
          {/* Type selector tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {entityTypes.map((type) => {
              const config = entityTypeConfig[type];
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    selectedType === type
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {config.pluralLabel}
                </button>
              );
            })}
          </div>

          {/* Entity list */}
          <div className="max-h-40 overflow-y-auto space-y-1">
            {entities === undefined ? (
              <p className="text-xs text-muted-foreground py-2">Loading...</p>
            ) : entities.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No {entityTypeConfig[selectedType].pluralLabel.toLowerCase()} in this world.
              </p>
            ) : (
              entities.map((entity: any) => {
                const alreadyLinked = linkedIds.has(entity._id);
                return (
                  <button
                    key={entity._id}
                    type="button"
                    disabled={alreadyLinked}
                    onClick={() => addLink(entity)}
                    className={`w-full text-left rounded px-2.5 py-1.5 text-xs transition-colors ${
                      alreadyLinked
                        ? "text-muted-foreground/50 cursor-not-allowed"
                        : "text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {entity.name}
                    {alreadyLinked && " (linked)"}
                  </button>
                );
              })
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPickerOpen(false)}
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
}

export type { EntityLink };
