"use client";
import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import App from "./app";
import { useTheme } from "next-themes";

const ExcalidrawWrapper = () => {
  const { theme } = useTheme();
  return (
    <App excalidrawLib={excalidrawLib}>
      <Excalidraw theme={theme === "system" ? "light" : (theme ?? "light")} />
    </App>
  );
};

export default ExcalidrawWrapper;
