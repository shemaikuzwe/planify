import { DrawingCard } from "@/components/ui/drawing-card";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/store/dexie";
import EmptyDrawings from "./empty-drawings";

export default function WhiteBoards({ search }: { search: string | null }) {
  const drawings = useLiveQuery(async () => {
    return await db.drawings.toArray();
  });
  const filteredDrawings = search
    ? drawings?.filter((drawing) => drawing.name.includes(search))
    : drawings;
  if (filteredDrawings && filteredDrawings?.length === 0) {
    return <EmptyDrawings />;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
      {filteredDrawings &&
        filteredDrawings.map((drawing) => (
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
