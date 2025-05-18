"use client"
import React from "react"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { DrawingCard } from "@/components/ui/drawing-card"
import { Drawing } from "@/lib/drizzle";
import { LoadingCardSkeleton } from "../skelton/card"

export default function Chat({ drawings }: { drawings: Drawing[] }) {


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
                onDelete={(id) => {
                  // This would typically call a server action to delete the drawing
                  console.log(`Delete drawing ${id}`)
                }}
              />
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  )
}
