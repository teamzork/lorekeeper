"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WorldCard } from "@/components/worlds/WorldCard";
import { CreateWorldDialog } from "@/components/worlds/CreateWorldDialog";

export default function DashboardPage() {
  const worlds = useQuery(api.worlds.list);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Your Worlds</h2>
        <CreateWorldDialog />
      </div>

      {worlds === undefined ? (
        <p className="mt-8 text-muted-foreground">Loading...</p>
      ) : worlds.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            No worlds yet. Create your first world to start building.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {worlds.map((world) => (
            <WorldCard
              key={world._id}
              worldId={world._id}
              name={world.name}
              description={world.description}
              visibility={world.visibility}
              role={world.role}
            />
          ))}
        </div>
      )}
    </div>
  );
}
