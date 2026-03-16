"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

interface DeleteEntityDialogProps {
  entityId: string;
  entityType: string;
  entityName: string;
  onDeleted: () => void;
}

export function DeleteEntityDialog({
  entityId,
  entityType,
  entityName,
  onDeleted,
}: DeleteEntityDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const removeEntity = useMutation(api.entities.remove);

  async function handleDelete() {
    setLoading(true);
    try {
      await removeEntity({
        id: entityId,
        entityType: entityType as any,
      });
      setOpen(false);
      onDeleted();
    } catch {
      // Error handled by Convex
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Delete {entityName}?
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Are you sure you want to delete <strong>{entityName}</strong>? This
            action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
