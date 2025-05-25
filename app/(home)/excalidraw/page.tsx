import Chat from "@/components/excalidraw/chat";
import { auth } from "@/auth";
import { GetUserDrawings } from "@/lib/data";
import { Suspense } from "react";
import { LoadingCardSkeleton } from "@/components/ui/skelton/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare } from "lucide-react";


export default async function Page() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("User not found")
  const drawings = GetUserDrawings(userId)
  return (
    <div className="min-h-screen p-4 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end items-center mb-8">
          <Button asChild>
            <Link href="/excalidraw/new">
              <MessageSquare size={16} />
              New Drawing
            </Link>
          </Button>
        </div>
        <Suspense fallback={<LoadingCardSkeleton />}>
          <Chat drawingsPromise={drawings} />
        </Suspense>
      </div>

    </div>
  );
}