"use client";
import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import App from "./app";
import { Drawing } from "@/lib/types";
import { ElementRecord } from "@/lib/store/schema/schema";


interface ExcalidrawWrapperProps {
  drawing?: ElementRecord|undefined;
}

const ExcalidrawWrapper = ({ drawing}: ExcalidrawWrapperProps) => {
  return (

      <App
        excalidrawLib={excalidrawLib}
        drawing={drawing}
      >
        <Excalidraw
        />
      </App>
  );
};

export default ExcalidrawWrapper;

