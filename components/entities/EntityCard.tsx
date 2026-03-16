"use client";

import Link from "next/link";
import { UserCircle, MapPin, Swords, Gem, BookOpen } from "lucide-react";

const entityIcons: Record<string, React.ElementType> = {
  character: UserCircle,
  place: MapPin,
  faction: Swords,
  artifact: Gem,
  lore: BookOpen,
};

interface EntityCardProps {
  entity: {
    _id: string;
    name: string;
    description?: string;
  };
  entityType: string;
  worldId: string;
}

export function EntityCard({ entity, entityType, worldId }: EntityCardProps) {
  const Icon = entityIcons[entityType] ?? UserCircle;

  return (
    <Link href={`/worlds/${worldId}/entities/${entity._id}?type=${entityType}`}>
      <div className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {entity.name}
          </h3>
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
        {entity.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {entity.description}
          </p>
        )}
      </div>
    </Link>
  );
}
