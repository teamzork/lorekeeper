"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { EditEventDialog } from "@/components/events/EditEventDialog";
import { DeleteEventDialog } from "@/components/events/DeleteEventDialog";
import {
  ArrowLeft,
  Clock,
  UserCircle,
  MapPin,
  Swords,
  Gem,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

const entityTypeConfig: Record<string, { label: string; pluralLabel: string; icon: React.ElementType }> = {
  character: { label: "Character", pluralLabel: "Characters", icon: UserCircle },
  place: { label: "Place", pluralLabel: "Places", icon: MapPin },
  faction: { label: "Faction", pluralLabel: "Factions", icon: Swords },
  artifact: { label: "Artifact", pluralLabel: "Artifacts", icon: Gem },
  lore: { label: "Lore", pluralLabel: "Lore", icon: BookOpen },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const worldId = params.worldId as string;
  const eventId = params.eventId as Id<"events">;

  const event = useQuery(api.events.get, { id: eventId });

  if (event === undefined) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (event === null) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Event not found</h2>
        <p className="mt-2 text-muted-foreground">
          This event doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href={`/worlds/${worldId}/timeline`}>Back to timeline</Link>
        </Button>
      </div>
    );
  }

  function handleDeleted() {
    router.push(`/worlds/${worldId}/timeline`);
  }

  // Group linked entities by type
  const groupedLinks: Record<string, Array<{ entityId: string; entityType: string; entityName: string }>> = {};
  if (event.entityLinks) {
    for (const link of event.entityLinks) {
      if (!groupedLinks[link.entityType]) {
        groupedLinks[link.entityType] = [];
      }
      groupedLinks[link.entityType].push(link);
    }
  }

  const hasLinks = event.entityLinks && event.entityLinks.length > 0;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href={`/worlds/${worldId}/timeline`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to timeline
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-muted-foreground shrink-0" />
          <h1 className="text-2xl font-bold tracking-tight">{event.name}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <EditEventDialog event={event} worldId={worldId as Id<"worlds">} />
          <DeleteEventDialog
            eventId={event._id}
            eventName={event.name}
            onDeleted={handleDeleted}
          />
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-1">
            Date
          </h2>
          <p className="text-sm font-semibold text-accent">{event.date}</p>
        </section>

        {event.era && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-1">
              Era
            </h2>
            <p className="text-xs uppercase tracking-[0.15em] text-primary/60">{event.era}</p>
          </section>
        )}

        {event.description && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-1">
              Description
            </h2>
            <p className="text-sm font-mono whitespace-pre-wrap leading-relaxed">{event.description}</p>
          </section>
        )}

        {event.significance && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-1">
              Significance
            </h2>
            <p className="text-sm font-mono whitespace-pre-wrap leading-relaxed">{event.significance}</p>
          </section>
        )}

        {/* Linked Entities */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Linked Entities
          </h2>
          {!hasLinks ? (
            <p className="text-sm text-muted-foreground/60">No linked entities</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedLinks).map(([type, links]) => {
                const config = entityTypeConfig[type];
                if (!config) return null;
                const Icon = config.icon;
                return (
                  <div key={type}>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                      {config.pluralLabel}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {links.map((link) => (
                        <Link
                          key={link.entityId}
                          href={`/worlds/${worldId}/entities/${link.entityId}?type=${link.entityType}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs transition-colors hover:border-primary/50 hover:text-primary"
                        >
                          <Icon className="h-3 w-3" />
                          {link.entityName}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Created {new Date(event.createdAt).toLocaleDateString()}
          {event.updatedAt !== event.createdAt && (
            <> · Updated {new Date(event.updatedAt).toLocaleDateString()}</>
          )}
        </p>
      </div>
    </div>
  );
}
