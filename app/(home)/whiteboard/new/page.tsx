import ExcalidrawClient from "@/components/excalidraw/excalidraw";
import { getUserDrawings } from "@/lib/data/drawing";

export default function Page() {
    const drawingsPromise = getUserDrawings()
    return (
        <ExcalidrawClient drawingsPromise={drawingsPromise}/>
    )
}