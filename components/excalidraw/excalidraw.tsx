"use client"
import { ElementRecord } from "@/lib/store/schema/schema";
import { Drawing } from "@prisma/client";
import dynamic from "next/dynamic";
import Script from "next/script";

const ExcalidrawWithClientOnly = dynamic(
    async () => (await import("@/components/excalidraw/excalidraw-wrapper")).default,
    {
        ssr: false,
    },
);

interface ExcalidrawClientProps {
    drawing?: ElementRecord | undefined;

}

export default function ExcalidrawClient({ drawing }: ExcalidrawClientProps) {
    return (
        <div className="h-full w-fit">
            <Script id="load-env-variables" strategy="afterInteractive">
                {`window["EXCALIDRAW_ASSET_PATH"] = window.origin;`}
            </Script>
            <ExcalidrawWithClientOnly drawing={drawing} />
        </div>
    );
}