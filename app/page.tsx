import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Lorekeeper
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Collaborative worldbuilding for fiction writers.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Build a shared universe bible — with AI catching contradictions before
          they become canon.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/sign-up">Get started</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    </main>
  );
}
