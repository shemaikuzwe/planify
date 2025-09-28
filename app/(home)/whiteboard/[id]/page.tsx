"use client"
import ExcalidrawClient from "@/components/excalidraw/excalidraw";
import { useParams } from "next/navigation";

export default function Page() {
    const { id } = useParams<{ id: string }>();
    return (
        <div className="h-full w-fit">
            <ExcalidrawClient />
        </div>
    );
}