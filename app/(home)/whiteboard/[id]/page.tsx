"use cache"
import ExcalidrawClient from "@/components/excalidraw/excalidraw";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getDrawingById } from "@/lib/data/drawing";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) redirect("/excalidraw");
    const drawing = await getDrawingById(id);
    if (!drawing) {
        redirect("/excalidraw")
    }
    return (
        <div className="h-full w-fit">
            <Suspense>
                <ExcalidrawClient drawing={drawing} />
            </Suspense>
        </div>
    );
}