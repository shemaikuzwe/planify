"use client";
import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import App from "./app";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { Drawing } from "@prisma/client";

const ExcalidrawWrapper = ({ drawingsPromise,drawing }: { drawingsPromise: Promise<Drawing[]>,drawing?: Drawing }) => {

  const apiElements = drawing?.elements
    ? (Array.isArray(drawing.elements) ? drawing.elements as OrderedExcalidrawElement[] : [])
    : undefined;


  return (
    <>
      <App
        excalidrawLib={excalidrawLib}
        apiElements={apiElements}
        drawingsPromise={drawingsPromise}
        drawingId={drawing?.id}
        drawingName={drawing?.name}
      >
        <Excalidraw
        />
      </App>
    </>
  );
};

export default ExcalidrawWrapper;

