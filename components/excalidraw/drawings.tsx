import { DrawingCard } from "@/components/ui/drawing-card";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/store/dexie";
import EmptyDrawings from "./empty-drawings";

export default function WhiteBoards({ search }: { search: string | null }) {
  const drawings = useLiveQuery(
    async () => await db.drawings.orderBy("updatedAt").toArray(),
  );
  const filteredDrawings = search
    ? drawings
        ?.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .filter((drawing) => drawing.name.includes(search))
    : drawings?.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
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
