"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, X } from "lucide-react";

interface FieldConfig {
  name: string;
  label: string;
  type: "input" | "textarea";
}

const entityFields: Record<string, FieldConfig[]> = {
  character: [
    { name: "title", label: "Title / Role", type: "input" },
    { name: "appearance", label: "Appearance", type: "textarea" },
    { name: "personality", label: "Personality", type: "textarea" },
    { name: "background", label: "Background", type: "textarea" },
  ],
  place: [
    { name: "geography", label: "Geography", type: "textarea" },
    { name: "climate", label: "Climate", type: "input" },
    { name: "significance", label: "Significance", type: "textarea" },
  ],
  faction: [
    { name: "goals", label: "Goals", type: "textarea" },
    { name: "beliefs", label: "Beliefs", type: "textarea" },
    { name: "headquarters", label: "Headquarters", type: "input" },
  ],
  artifact: [
    { name: "origin", label: "Origin", type: "textarea" },
    { name: "powers", label: "Powers", type: "textarea" },
    { name: "currentLocation", label: "Current Location", type: "input" },
  ],
  lore: [
    { name: "category", label: "Category", type: "input" },
    { name: "source", label: "Source", type: "input" },
  ],
};

interface EditEntityDialogProps {
  entity: Record<string, any>;
  entityType: string;
  entityLabel: string;
}

export function EditEntityDialog({
  entity,
  entityType,
  entityLabel,
}: EditEntityDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const updateEntity = useMutation(api.entities.update);

  const typeFields = entityFields[entityType] ?? [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates: Record<string, string | undefined> = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
    };

    for (const field of typeFields) {
      const value = formData.get(field.name) as string;
      updates[field.name] = value || undefined;
    }

    try {
      await updateEntity({
        id: entity._id,
        entityType: entityType as any,
        ...updates,
      } as any);
      setOpen(false);
    } catch {
      // Error handled by Convex
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
              Edit {entityLabel.toLowerCase()}
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
                defaultValue={entity.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <textarea
                id="edit-description"
                name="description"
                defaultValue={entity.description ?? ""}
                rows={4}
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {typeFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`edit-${field.name}`}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <textarea
                    id={`edit-${field.name}`}
                    name={field.name}
                    defaultValue={entity[field.name] ?? ""}
                    rows={3}
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                ) : (
                  <Input
                    id={`edit-${field.name}`}
                    name={field.name}
                    defaultValue={entity[field.name] ?? ""}
                  />
                )}
              </div>
            ))}

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

export { entityFields };
