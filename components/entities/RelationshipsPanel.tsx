"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, ArrowRight, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const PRESET_LABELS = [
  "lives in",
  "belongs to",
  "allied with",
  "enemy of",
  "created by",
  "owns",
  "located in",
  "founded by",
  "member of",
  "rules",
];

const ENTITY_TYPE_OPTIONS = [
  { value: "character", label: "Character" },
  { value: "place", label: "Place" },
  { value: "faction", label: "Faction" },
  { value: "artifact", label: "Artifact" },
  { value: "lore", label: "Lore" },
];

function AddRelationshipDialog({
  entityId,
  entityType,
  worldId,
}: {
  entityId: string;
  entityType: string;
  worldId: Id<"worlds">;
}) {
  const [open, setOpen] = useState(false);
  const [targetType, setTargetType] = useState("character");
  const [label, setLabel] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [targetId, setTargetId] = useState("");
  const [loading, setLoading] = useState(false);

  const createRelationship = useMutation(api.relationships.create);
  const targetEntities = useQuery(api.entities.list, {
    worldId,
    entityType: targetType as any,
  });

  const filteredEntities = (targetEntities ?? []).filter(
    (e: any) => e._id !== entityId
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalLabel = label === "__custom__" ? customLabel.trim() : label;
    if (!finalLabel || !targetId) return;
    setLoading(true);
    try {
      await createRelationship({
        worldId,
        fromId: entityId,
        fromType: entityType as any,
        toId: targetId,
        toType: targetType as any,
        label: finalLabel,
      });
      setOpen(false);
      setLabel("");
      setCustomLabel("");
      setTargetId("");
    } catch {
      // error handled by Convex
    } finally {
      setLoading(false);
    }
  }

  const isValid =
    !!targetId &&
    !!label &&
    (label !== "__custom__" || !!customLabel.trim());

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add relationship
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Add relationship
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Relationship</Label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="">Select...</option>
                {PRESET_LABELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
                <option value="__custom__">Custom...</option>
              </select>
              {label === "__custom__" && (
                <Input
                  placeholder="Describe the relationship"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  required
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Target type</Label>
              <select
                value={targetType}
                onChange={(e) => {
                  setTargetType(e.target.value);
                  setTargetId("");
                }}
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {ENTITY_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Target entity</Label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                required
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="">
                  {targetEntities === undefined
                    ? "Loading..."
                    : filteredEntities.length === 0
                      ? "No entities found"
                      : "Select entity..."}
                </option>
                {filteredEntities.map((e: any) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={loading || !isValid}>
                {loading ? "Adding..." : "Add relationship"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function RelationshipsPanel({
  entityId,
  entityType,
  worldId,
}: {
  entityId: string;
  entityType: string;
  worldId: Id<"worlds">;
}) {
  const relationships = useQuery(api.relationships.listForEntity, {
    entityId,
    worldId,
  });
  const removeRelationship = useMutation(api.relationships.remove);

  async function handleRemove(id: Id<"relationships">) {
    await removeRelationship({ id, worldId });
  }

  return (
    <section className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Relationships</h2>
        <AddRelationshipDialog
          entityId={entityId}
          entityType={entityType}
          worldId={worldId}
        />
      </div>

      {relationships === undefined ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : relationships.length === 0 ? (
        <p className="text-sm text-muted-foreground">No relationships yet.</p>
      ) : (
        <ul className="space-y-2">
          {relationships.map((rel) => (
            <li
              key={rel._id}
              className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                {rel.direction === "outgoing" ? (
                  <>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground shrink-0">
                      {rel.label}
                    </span>
                    <Link
                      href={`/worlds/${worldId}/entities/${rel.otherId}?type=${rel.otherType}`}
                      className="font-medium hover:underline truncate"
                    >
                      {rel.otherName}
                    </Link>
                    <span className="text-xs text-muted-foreground shrink-0 capitalize">
                      ({rel.otherType})
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <Link
                      href={`/worlds/${worldId}/entities/${rel.otherId}?type=${rel.otherType}`}
                      className="font-medium hover:underline truncate"
                    >
                      {rel.otherName}
                    </Link>
                    <span className="text-muted-foreground shrink-0">
                      {rel.label} this
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0 capitalize">
                      ({rel.otherType})
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => handleRemove(rel._id as Id<"relationships">)}
                className="text-muted-foreground hover:text-destructive shrink-0"
                aria-label="Remove relationship"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
