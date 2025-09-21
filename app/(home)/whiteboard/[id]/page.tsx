"use client"
import ExcalidrawClient from "@/components/excalidraw/excalidraw";
import { db } from "@/lib/store/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "next/navigation";

export default function Page() {
    const { id } = useParams<{ id: string }>();
    if (!id) throw new Error("No drawing id");
    const drawing = useLiveQuery(() => db.drawings.get(id))
    return (
        <div className="h-full w-fit">
            <ExcalidrawClient drawing={drawing} />
        </div>
    );
}