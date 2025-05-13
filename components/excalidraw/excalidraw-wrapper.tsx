"use client";
import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";

import App from "./app";
import { Drawing } from "@/lib/drizzle";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

const ExcalidrawWrapper = ({ drawing }: { drawing?: Drawing }) => {
  const { drawing: localDrawing, removeAll, addId, updateElement, updateLastUpdated } = useStore();

  useEffect(() => {
    if (drawing) {
      // Different IDs - clear local and use DB version
      if (drawing.id !== localDrawing?.id) {
        console.log("Different drawing IDs - clearing local and using DB version");
        removeAll();
        addId(drawing.id ?? null);
        processElements(drawing.elements);
        updateLastUpdated();
      }
      // Same ID but check which is more recent
      else if (drawing.updatedAt && localDrawing?.lastUpdated) {
        const dbUpdatedAt = new Date(drawing.updatedAt).getTime();
        const localUpdatedAt = new Date(localDrawing.lastUpdated).getTime();
        
        if (dbUpdatedAt > localUpdatedAt) {
          console.log("DB is more recent - using DB version");
          processElements(drawing.elements);
          updateLastUpdated();
        } else {
          //  if(dbUpdatedAt < localUpdatedAt){
          //   console.log("Local is more recent - using local version");
          //   processElements(localDrawing.elements);
          //   updateLastUpdated();
          //  }
        
        }
      } else {
        // No timestamp to compare, default to local version
        console.log("No timestamp to compare - using local version");
        processElements(localDrawing.elements);
        updateLastUpdated();
      }
    }
  }, [drawing, localDrawing, removeAll, addId, updateElement, updateLastUpdated]);

  // Helper function to process elements from any format
  const processElements = (elements: any) => {
    if (!elements) {
      updateElement([]);
      return;
    }

    try {
      // If elements is already an array, use it directly
      if (Array.isArray(elements)) {
        updateElement(elements);
      }
      // If elements is a string, try to parse it
      else if (typeof elements === 'string') {
        try {
          const parsedElements = JSON.parse(elements);
          updateElement(parsedElements);
        } catch (error) {
          console.error('Error parsing elements:', error);
          updateElement([]);
        }
      }
      // Otherwise, use it as is
      else {
        updateElement(elements);
      }
    } catch (error) {
      console.error('Error processing elements:', error);
      updateElement([]);
    }
  };

  return (
    <>
      <App
        excalidrawLib={excalidrawLib}
        apiElements={drawing?.elements as OrderedExcalidrawElement[]}
        drawingId={drawing?.id}
      >
        <Excalidraw />
      </App>
    </>
  );
};

export default ExcalidrawWrapper;
