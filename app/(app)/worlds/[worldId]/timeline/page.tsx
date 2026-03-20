"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { EventCard } from "@/components/events/EventCard";
import { TimelineView } from "@/components/events/TimelineView";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { Clock, List, GitCommitVertical } from "lucide-react";

type View = "chronicle" | "timeline";

export default function TimelinePage() {
  const params = useParams();
  const worldId = params.worldId as Id<"worlds">;
  const [view, setView] = useState<View>("chronicle");

  const events = useQuery(api.events.list, { worldId });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold tracking-tight">Timeline</h2>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          {events && events.length > 0 && (
            <div className="flex rounded-md border border-border bg-muted/30 p-0.5">
              <button
                onClick={() => setView("chronicle")}
                className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors ${
                  view === "chronicle"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                Chronicle
              </button>
              <button
                onClick={() => setView("timeline")}
                className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors ${
                  view === "timeline"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GitCommitVertical className="h-3.5 w-3.5" />
                Timeline
              </button>
            </div>
          )}
          <CreateEventDialog worldId={worldId} />
        </div>
      </div>

      {events === undefined ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="mx-auto h-10 w-10 text-muted-foreground/40 mb-5" />
          <h3 className="text-xl font-semibold">No events yet</h3>
          <p className="mt-2 text-sm text-muted-foreground mb-6 max-w-sm mx-auto font-mono">
            Create the first event in this world&apos;s timeline.
          </p>
          <CreateEventDialog worldId={worldId} />
        </div>
      ) : view === "chronicle" ? (
        <div className="divide-y divide-border/30">
          {events.map((event: any) => (
            <EventCard key={event._id} event={event} worldId={worldId} />
          ))}
        </div>
      ) : (
        <TimelineView events={events} worldId={worldId} />
      )}
    </div>
  );
}
