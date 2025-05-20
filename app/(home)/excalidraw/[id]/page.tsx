import ExcalidrawClient from "@/components/excalidraw/excalidraw";
import { GetDrawingById } from "@/lib/data";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) redirect("/excalidraw");
    const drawing = await GetDrawingById(id);
    if(!drawing){
        redirect("/excalidraw")
    }
    return (
        <div className="h-full w-fit">
            <Suspense fallback={<div>Loading...</div>}>
                <ExcalidrawClient drawing={drawing} />
            </Suspense>
        </div>
    );
}