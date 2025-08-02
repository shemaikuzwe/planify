"use client"
import React, { use } from "react"
import { DrawingCard } from "@/components/ui/drawing-card"
import { Drawing } from "@prisma/client"
import NoDrawings from "../ui/not-found-card"

export default function Chat({ drawingsPromise }: { drawingsPromise: Promise<Drawing[]> }) {
  const drawings = use(drawingsPromise)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full">
      {drawings.length > 0 ? drawings.map((drawing) => (
        <DrawingCard
          key={drawing.id}
          id={drawing.id}
          name={drawing.name}
          description={drawing.description}
          createdAt={drawing.createdAt}
        />
      )) : (
        <div className="flex items-center justify-center w-full h-full col-span-4 mt-10">
          <NoDrawings text="No drawings" link="/whiteboard/new" linkText="New Drawing" />
        </div>
      )}

    </div>
  )
}
