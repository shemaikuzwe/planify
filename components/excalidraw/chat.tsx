"use client";
import { DrawingCard } from "@/components/ui/drawing-card";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/store/dexie";
import EmptyDrawings from "./empty-drawings";

export default function WhiteBoards() {
  const drawings = useLiveQuery(async () => await db.drawings.toArray());
  if (drawings && drawings?.length === 0) {
    return <EmptyDrawings />;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
      {drawings &&
        drawings.map((drawing) => (
          <DrawingCard
            key={drawing.id}
            id={drawing.id}
            name={drawing.name}
            updatedAt={drawing.updatedAt}
          />
        ))}
    </div>
  );
}
