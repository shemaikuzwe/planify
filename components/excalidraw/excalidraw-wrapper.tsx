"use client";
import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import App from "./app";


const ExcalidrawWrapper = () => {
  return (

      <App
        excalidrawLib={excalidrawLib}
      >
        <Excalidraw
        />
      </App>
  );
};

export default ExcalidrawWrapper;

