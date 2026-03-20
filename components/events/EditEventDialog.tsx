"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, X } from "lucide-react";
import { LinkEntitiesSection, type EntityLink } from "@/components/events/LinkEntitiesSection";

interface EditEventDialogProps {
  event: Record<string, any>;
  worldId: Id<"worlds">;
}

export function EditEventDialog({ event, worldId }: EditEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entityLinks, setEntityLinks] = useState<EntityLink[]>(
    event.entityLinks ?? []
  );
  const updateEvent = useMutation(api.events.update);

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      setEntityLinks(event.entityLinks ?? []);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await updateEvent({
        id: event._id,
        name: formData.get("name") as string,
        date: formData.get("date") as string,
        description: (formData.get("description") as string) || undefined,
        era: (formData.get("era") as string) || undefined,
        significance: (formData.get("significance") as string) || undefined,
        entityLinks: entityLinks,
      });
      setOpen(false);
    } catch {
      // Error handled by Convex
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-lg max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Edit event
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={event.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                name="date"
                defaultValue={event.date}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-era">Era (optional)</Label>
              <Input
                id="edit-era"
                name="era"
                defaultValue={event.era ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <textarea
                id="edit-description"
                name="description"
                defaultValue={event.description ?? ""}
                rows={4}
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-significance">Significance (optional)</Label>
              <textarea
                id="edit-significance"
                name="significance"
                defaultValue={event.significance ?? ""}
                rows={3}
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <LinkEntitiesSection
              worldId={worldId}
              value={entityLinks}
              onChange={setEntityLinks}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
