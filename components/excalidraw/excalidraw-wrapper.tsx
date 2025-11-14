"use client";
import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import App from "@/components/excalidraw/app";
import { useParams } from "react-router";

const ExcalidrawWrapper = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("id is required");
  return (
    <App excalidrawLib={excalidrawLib} key={id}>
      <Excalidraw />
    </App>
  );
};

export default ExcalidrawWrapper;
