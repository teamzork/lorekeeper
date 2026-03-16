"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EntityNav } from "@/components/worlds/EntityNav";

export default function WorldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const worldId = params.worldId as Id<"worlds">;
  const world = useQuery(api.worlds.get, { worldId });

  if (world === undefined) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (world === null) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">World not found</h2>
        <p className="mt-2 text-muted-foreground">
          This world doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{world.name}</h1>
        {world.description && (
          <p className="mt-2 text-muted-foreground">{world.description}</p>
        )}
        <span className="mt-1 inline-block text-xs text-muted-foreground">
          {world.visibility === "private" ? "Private world" : "Public world"}
        </span>
      </div>

      <EntityNav />

      <div className="mt-6">{children}</div>
    </div>
  );
}
