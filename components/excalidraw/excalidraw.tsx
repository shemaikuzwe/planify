"use client"
import { Drawing } from "@/lib/drizzle";
import dynamic from "next/dynamic";
import Script from "next/script";


const ExcalidrawWithClientOnly = dynamic(
    async () => (await import("@/components/excalidraw/excalidraw-wrapper")).default,
    {
        ssr: false,
    },
);

export default function ExcalidrawClient({ drawing }: { drawing?: Drawing }) {

    return (
        <div className="h-full w-fit">
            <Script id="load-env-variables" strategy="beforeInteractive">
                {`window["EXCALIDRAW_ASSET_PATH"] = window.origin;`}
            </Script>


            <ExcalidrawWithClientOnly drawing={drawing} />

        </div>
    );
}