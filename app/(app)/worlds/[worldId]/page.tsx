"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { InviteDialog } from "@/components/worlds/InviteDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const roleBadgeStyles: Record<string, string> = {
  owner: "bg-primary/20 text-primary",
  editor: "bg-blue-500/20 text-blue-400",
  viewer: "bg-muted text-muted-foreground",
};

export default function WorldDetailPage() {
  const params = useParams();
  const worldId = params.worldId as Id<"worlds">;

  const world = useQuery(api.worlds.get, { worldId });
  const members = useQuery(api.memberships.listByWorld, { worldId });
  const currentUser = useQuery(api.users.current);

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

  const isOwner = currentUser?._id === world.ownerId;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{world.name}</h1>
          {world.description && (
            <p className="mt-2 text-muted-foreground">{world.description}</p>
          )}
          <span className="mt-2 inline-block text-xs text-muted-foreground">
            {world.visibility === "private" ? "Private world" : "Public world"}
          </span>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Members</h2>
          {isOwner && <InviteDialog worldId={worldId} />}
        </div>

        {members === undefined ? (
          <p className="text-muted-foreground">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-muted-foreground">No members yet.</p>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
              >
                <div>
                  <p className="font-medium text-sm">{member.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.userEmail}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!member.joinedAt && (
                    <span className="text-xs text-muted-foreground">
                      pending
                    </span>
                  )}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      roleBadgeStyles[member.role] ?? roleBadgeStyles.viewer
                    )}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
