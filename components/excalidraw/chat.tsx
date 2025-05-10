import { ChevronRight, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { GetUserDrawings } from "@/lib/data"
import { auth } from "@/app/auth"
import { Suspense } from "react"

export default async function Chat() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found");
  const drawings = await GetUserDrawings(userId);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button>
            <MessageSquare size={16} />
            New Drawing
          </Button>
        </div>

        <Suspense  fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drawings.map((drawing) => (
            <Link
              href={`/excalidraw/${drawing.id}`}
              key={drawing.id}
              className="rounded-lg p-5 border min-w-56 min-h-32"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full  flex items-center justify-center">
                    <MessageSquare size={16} className="text-primary" />
                  </div>
                  <h2 className="font-semibold text-lg ">{drawing.name}</h2>
                </div>
                <ChevronRight size={18} />
              </div>
              <p className="text-sm line-clamp-2 mb-4">{drawing.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span>{drawing.createdAt?.toDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
        </Suspense>
      </div>
    </div>
  )
}
