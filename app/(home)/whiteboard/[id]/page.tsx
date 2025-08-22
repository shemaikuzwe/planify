"use cache"
import ExcalidrawClient from "@/components/excalidraw/excalidraw";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getDrawingById, getUserDrawings } from "@/lib/data/drawing";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) redirect("/excalidraw");
    const drawing = await getDrawingById(id);
    if (!drawing) {
        redirect("/excalidraw")
    }
    const drawingsPromise = getUserDrawings(drawing.userId)
    return (
        <div className="h-full w-fit">
            <Suspense>
                <ExcalidrawClient drawingsPromise={drawingsPromise} drawing={drawing} />
            </Suspense>
        </div>
    );
}