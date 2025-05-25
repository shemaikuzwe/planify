"use client";
import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";

import App from "./app";
import { Drawing } from "@/lib/drizzle";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

const ExcalidrawWrapper = ({ drawing }: { drawing?: Drawing }) => {
  // Safely handle elements from database - they could be null, undefined, or a JSON array
  const apiElements = drawing?.elements
    ? (Array.isArray(drawing.elements) ? drawing.elements as OrderedExcalidrawElement[] : [])
    : undefined;

  console.log(`🎨 ExcalidrawWrapper: Drawing ID=${drawing?.id}, Drawing name=${drawing?.name}, API elements count=${apiElements?.length || 0}`);

  // Log the raw elements data for debugging
  if (drawing?.elements) {
    console.log(`📊 Raw elements data type:`, typeof drawing.elements, `isArray:`, Array.isArray(drawing.elements));
    if (Array.isArray(drawing.elements) && drawing.elements.length > 0) {
      console.log(`📊 First element sample:`, drawing.elements[0]);
    }
  }

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

