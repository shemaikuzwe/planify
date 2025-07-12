"use client";
import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";

import App from "./app";
import { Drawing } from "@/lib/drizzle";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

const ExcalidrawWrapper = ({ drawing }: { drawing?: Drawing }) => {

  const apiElements = drawing?.elements
    ? (Array.isArray(drawing.elements) ? drawing.elements as OrderedExcalidrawElement[] : [])
    : undefined;


  return (
    <>
      <App
        excalidrawLib={excalidrawLib}
        apiElements={apiElements}
        drawingId={drawing?.id}
      >
        <Excalidraw
        />
      </App>
    </>
  );
};

export default ExcalidrawWrapper;

