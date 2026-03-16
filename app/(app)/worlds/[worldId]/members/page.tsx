"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { InviteDialog } from "@/components/worlds/InviteDialog";
import { cn } from "@/lib/utils";

const roleBadgeStyles: Record<string, string> = {
  owner: "bg-primary/20 text-primary",
  editor: "bg-blue-500/20 text-blue-400",
  viewer: "bg-muted text-muted-foreground",
};

export default function MembersPage() {
  const params = useParams();
  const worldId = params.worldId as Id<"worlds">;

  const world = useQuery(api.worlds.get, { worldId });
  const members = useQuery(api.memberships.listByWorld, { worldId });
  const currentUser = useQuery(api.users.current);

  const isOwner = currentUser?._id === world?.ownerId;

  return (
    <div>
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
  );
}
