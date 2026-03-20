"use client";

import Link from "next/link";

interface TimelineEvent {
  _id: string;
  name: string;
  date: string;
  era?: string;
  description?: string;
  entityLinks?: Array<{ entityId: string; entityType: string; entityName: string }>;
}

interface TimelineViewProps {
  events: TimelineEvent[];
  worldId: string;
}

export function TimelineView({ events, worldId }: TimelineViewProps) {
  // Group events by era (undefined era → "Unchronicled")
  const eraGroups: Array<{ era: string | null; events: TimelineEvent[] }> = [];
  let currentEra: string | null | undefined = undefined; // sentinel

  for (const event of events) {
    const era = event.era ?? null;
    if (era !== currentEra) {
      eraGroups.push({ era, events: [event] });
      currentEra = era;
    } else {
      eraGroups[eraGroups.length - 1].events.push(event);
    }
  }

  return (
    <div className="relative">
      {/* The chronicle line */}
      <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />

      <div className="space-y-0">
        {eraGroups.map((group, gi) => (
          <div key={gi}>
            {/* Era divider */}
            {group.era && (
              <div className="relative flex items-center gap-4 pt-8 pb-4 first:pt-0">
                {/* Era marker on the line */}
                <div className="relative z-10 h-4 w-4 rounded-full border-2 border-primary/40 bg-background flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/60">
                  {group.era}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            {/* Events in this era */}
            {group.events.map((event) => (
              <Link
                key={event._id}
                href={`/worlds/${worldId}/timeline/${event._id}`}
                className="group relative flex items-start gap-4 py-3 transition-colors"
              >
                {/* Dot on the line */}
                <div className="relative z-10 mt-1.5 h-[15px] w-[15px] flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full border border-accent/40 bg-background transition-colors group-hover:border-accent group-hover:bg-accent/20" />
                </div>

                {/* Event content */}
                <div className="flex-1 min-w-0 pb-3 border-b border-border/40 group-last:border-b-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-accent shrink-0">
                      {event.date}
                    </span>
                    <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {event.name}
                    </h3>
                  </div>
                  {event.description && (
                    <p className="mt-1.5 text-sm text-muted-foreground font-mono leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  {event.entityLinks && event.entityLinks.length > 0 && (
                    <p className="mt-1.5 text-xs text-muted-foreground/50">
                      {event.entityLinks.map((l) => l.entityName).join(" · ")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
