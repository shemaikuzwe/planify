"use client"
import React, { use } from "react"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DrawingCard } from "@/components/ui/drawing-card"
import { Drawing } from "@/lib/drizzle";

export default function Chat({ drawingsPromise }: { drawingsPromise: Promise<Drawing[]> }) {
  const drawings = use(drawingsPromise)

  return (
   
      

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drawings.map((drawing) => (
            <DrawingCard
              key={drawing.id}
              id={drawing.id}
              name={drawing.name}
              description={drawing.description}
              createdAt={drawing.createdAt}
              onEdit={(id) => {
                // This would typically navigate to an edit page or open a modal
                console.log(`Edit drawing ${id}`)
              }}

            />
          ))}

        </div>

   
  )
}
