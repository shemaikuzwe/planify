"use client"
import { Drawing } from "@/lib/drizzle";
import dynamic from "next/dynamic";
import Script from "next/script";
import { use } from "react";


// const ExcalidrawWithClientOnly = dynamic(
//     async () => (await import("@/components/excalidraw/excalidraw-wrapper")).default,
//     {
//         ssr: false,
//     },
// );

export default function ExcalidrawClient({ drawingPromise }: { drawingPromise?: Promise<Drawing> }) {
    let drawing = undefined;
    if (drawingPromise) {
        drawing = use(drawingPromise)
    }
    return (
        <div className="h-full w-fit">
            <div>SHii</div>
            {/* <Script id="load-env-variables" strategy="beforeInteractive">
                {`window["EXCALIDRAW_ASSET_PATH"] = window.origin;`}
            </Script>


            <ExcalidrawWithClientOnly drawing={drawing} /> */}

        </div>
    );
}