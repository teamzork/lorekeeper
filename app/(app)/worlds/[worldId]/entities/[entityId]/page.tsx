"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { EditEntityDialog, entityFields } from "@/components/entities/EditEntityDialog";
import { DeleteEntityDialog } from "@/components/entities/DeleteEntityDialog";
import { ArrowLeft, UserCircle, MapPin, Swords, Gem, BookOpen } from "lucide-react";
import Link from "next/link";

const entityMeta: Record<string, { label: string; pluralLabel: string; icon: React.ElementType }> = {
  character: { label: "Character", pluralLabel: "Characters", icon: UserCircle },
  place: { label: "Place", pluralLabel: "Places", icon: MapPin },
  faction: { label: "Faction", pluralLabel: "Factions", icon: Swords },
  artifact: { label: "Artifact", pluralLabel: "Artifacts", icon: Gem },
  lore: { label: "Lore", pluralLabel: "Lore", icon: BookOpen },
};

export default function EntityDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const worldId = params.worldId as string;
  const entityId = params.entityId as string;
  const entityType = searchParams.get("type") ?? "character";
  const meta = entityMeta[entityType] ?? entityMeta.character;
  const Icon = meta.icon;
  const typeFields = entityFields[entityType] ?? [];

  const entity = useQuery(api.entities.get, {
    id: entityId,
    entityType: entityType as any,
  });

  if (entity === undefined) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (entity === null) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Entity not found</h2>
        <p className="mt-2 text-muted-foreground">
          This entity doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href={`/worlds/${worldId}/entities?type=${entityType}`}>
            Back to {meta.pluralLabel.toLowerCase()}
          </Link>
        </Button>
      </div>
    );
  }

  function handleDeleted() {
    router.push(`/worlds/${worldId}/entities?type=${entityType}`);
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href={`/worlds/${worldId}/entities?type=${entityType}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {meta.pluralLabel.toLowerCase()}
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-muted-foreground shrink-0" />
          <h1 className="text-2xl font-bold tracking-tight">{entity.name}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <EditEntityDialog
            entity={entity}
            entityType={entityType}
            entityLabel={meta.label}
          />
          <DeleteEntityDialog
            entityId={entity._id}
            entityType={entityType}
            entityName={entity.name}
            onDeleted={handleDeleted}
          />
        </div>
      </div>

      <div className="space-y-6">
        {entity.description && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-1">
              Description
            </h2>
            <p className="text-sm whitespace-pre-wrap">{entity.description}</p>
          </section>
        )}

        {typeFields.map((field) => {
          const value = (entity as any)[field.name];
          if (!value) return null;
          return (
            <section key={field.name}>
              <h2 className="text-sm font-medium text-muted-foreground mb-1">
                {field.label}
              </h2>
              <p className="text-sm whitespace-pre-wrap">{value}</p>
            </section>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Created {new Date(entity.createdAt).toLocaleDateString()}
          {entity.updatedAt !== entity.createdAt && (
            <> · Updated {new Date(entity.updatedAt).toLocaleDateString()}</>
          )}
        </p>
      </div>
    </div>
  );
}
