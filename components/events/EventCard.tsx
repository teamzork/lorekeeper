"use client";

import Link from "next/link";

interface EventCardProps {
  event: {
    _id: string;
    name: string;
    date: string;
    era?: string;
    description?: string;
    entityLinks?: Array<{ entityId: string; entityType: string; entityName: string }>;
  };
  worldId: string;
}

export function EventCard({ event, worldId }: EventCardProps) {
  return (
    <Link href={`/worlds/${worldId}/timeline/${event._id}`}>
      <article className="group flex gap-5 border-l-2 border-border pl-5 py-4 transition-colors hover:border-accent/60">
        {/* Date gutter */}
        <div className="w-44 shrink-0">
          <p className="text-sm font-semibold text-accent leading-tight">
            {event.date}
          </p>
          {event.era && (
            <p className="mt-1 text-[11px] uppercase tracking-widest text-primary/50">
              {event.era}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors leading-tight">
            {event.name}
          </h3>
          {event.description && (
            <p className="mt-1.5 text-sm text-muted-foreground font-mono leading-relaxed line-clamp-2">
              {event.description}
            </p>
          )}
          {event.entityLinks && event.entityLinks.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground/60">
              {event.entityLinks.map((l) => l.entityName).join(" · ")}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
