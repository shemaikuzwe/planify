"use client";
import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";

import App from "./app";

const ExcalidrawWrapper: React.FC = () => {
  return (
    <>
      <App
        useCustom={(api: any, args?: any[]) => { }}
        excalidrawLib={excalidrawLib}
      >
        <Excalidraw  theme="dark"/>
      </App>
    </>
  );
};

export default ExcalidrawWrapper;

