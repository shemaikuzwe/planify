"use client"
import dynamic from "next/dynamic";
import Script from "next/script";


// Since client components get prerenderd on server as well hence importing the excalidraw stuff dynamically
// with ssr false
const ExcalidrawWithClientOnly = dynamic(
  async () => (await import("../../../components/excalidraw/excalidraw-wrapper")).default,
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <div className="h-full w-fit">
      <Script id="load-env-variables" strategy="beforeInteractive">
        {`window["EXCALIDRAW_ASSET_PATH"] = window.origin;`}
      </Script>

      <ExcalidrawWithClientOnly />
    </div>
  );
}