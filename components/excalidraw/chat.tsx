"use client"
import { DrawingCard } from "@/components/ui/drawing-card"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/store/dexie"

export default function Chat() {
  const drawings = useLiveQuery(async () => await db.drawings.toArray())

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full">
      {drawings && drawings.length > 0 ? drawings.map((drawing) => (
        <DrawingCard
          key={drawing.id}
          id={drawing.id}
          name={drawing.name}
          updatedAt={drawing.updatedAt}
        />
      )) : null}

    </div>
  )
}
