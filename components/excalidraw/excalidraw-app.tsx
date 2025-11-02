"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";
import type {
  NonDeletedExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";

import type {
  AppState,
  ExcalidrawImperativeAPI,
  BinaryFiles,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";

import CustomFooter from "./footer";
import { cn } from "@/lib/utils/utils";
import { createDrawingStorage } from "@/lib/store/excali-store";
import InlineInput from "../ui/inline-input";
import { useParams, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/store/dexie";
import { useDebouncedCallback } from "use-debounce";
import DrawingPicker from "../ui/drawing-picker";
import { useTheme } from "@/hooks/use-theme";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import ThemeToggleButton from "../ui/theme-toggleBtn";
import "@excalidraw/excalidraw/index.css";

const ExcalidrawWrapper = () => {
  const { useHandleLibrary, Footer, WelcomeScreen, LiveCollaborationTrigger } =
    excalidrawLib;
  const appRef = useRef<any>(null);
  const { id } = useParams<{ id: string }>();
  const drawingStorage = useMemo(() => createDrawingStorage(id), [id]);

  const [initialData, setInitialData] =
    useState<ExcalidrawInitialDataState | null>(null);

  const [elements, setElements] = useState<Readonly<
    OrderedExcalidrawElement[]
  > | null>(null);
  const { theme } = useTheme();
  const router = useRouter();
  const drawing = useLiveQuery(async () => db.drawings.get(id));

  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [disableImageTool, setDisableImageTool] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);

  useEffect(() => {
    async function init() {
      if (!drawingStorage) return;
      const [storedFiles, storedElements] = await Promise.all([
        drawingStorage.getFiles(),
        drawingStorage?.getElements(),
      ]);
      setElements(storedElements);
      setInitialData({
        scrollToContent: true,
        files: storedFiles ?? undefined,
        elements: storedElements,
      });
    }
    init();
  }, [drawingStorage]);

  const updateElements = useDebouncedCallback(
    (newElements: Readonly<OrderedExcalidrawElement[]>, files: BinaryFiles) => {
      setElements(newElements);
      if (!(JSON.stringify(newElements) === JSON.stringify(elements))) {
        drawingStorage.saveElements(newElements).catch((error) => {
          console.error("Failed to save elements:", error);
        });
      }
      console.log("saved changes", files);
      // Save files
      drawingStorage.saveFile(files).catch((error) => {
        console.error("Failed to save files:", error);
      });
    },
    500,
  );

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  useHandleLibrary({ excalidrawAPI });

  const handleNameChange = (name: string) => {
    if (!drawingStorage) return;
    drawingStorage.editDrawingName(name);
  };

  const renderTopRightUI = (isMobile: boolean) => {
    return (
      <>
        {!isMobile && (
          <>
            <div className="absolute top-0 left-0 z-[10000]">
              <Button
                onClick={() => router.back()}
                variant={"outline"}
                size={"icon"}
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <DrawingPicker defaultDrawingId={id} />
            </div>

            <div className="absolute flex justify-center items-center top-0 left-32 z-[10000]">
              <InlineInput
                value={drawing?.name ?? "Untitled"}
                onChange={handleNameChange}
                options={{ slice: 20 }}
                className="w-36 mt-2 ml-2 text-md"
              />
            </div>
            <ThemeToggleButton />
          </>
        )}

        {!isMobile && (
          <LiveCollaborationTrigger
            isCollaborating={isCollaborating}
            onSelect={() => {
              window.alert("Collab dialog clicked");
            }}
          />
        )}
      </>
    );
  };

  const onLinkOpen = useCallback(
    (
      element: NonDeletedExcalidrawElement,
      event: CustomEvent<{
        nativeEvent: MouseEvent | React.PointerEvent<HTMLCanvasElement>;
      }>,
    ) => {
      const link = element.link!;
      const { nativeEvent } = event.detail;
      const isNewTab = nativeEvent.ctrlKey || nativeEvent.metaKey;
      const isNewWindow = nativeEvent.shiftKey;
      const isInternalLink =
        link.startsWith("/") || link.includes(window.location.origin);
      if (isInternalLink && !isNewTab && !isNewWindow) {
        event.preventDefault();
      }
    },
    [],
  );

  // if (!initialData) {
  //   // TODO: Add a proper skeleton loader
  //   return <div>Loading...</div>;
  // }

  return (
    <div className={cn("h-full fixed w-full")} ref={appRef}>
      <Excalidraw
        excalidrawAPI={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
        initialData={initialData}
        onChange={(
          newElements: Readonly<OrderedExcalidrawElement[]>,
          state: AppState,
          files: BinaryFiles,
        ) => {
          updateElements(newElements, files);
        }}
        viewModeEnabled={viewModeEnabled}
        zenModeEnabled={zenModeEnabled}
        gridModeEnabled={gridModeEnabled}
        theme={theme}
        name={drawing?.name ?? "Untitled"}
        UIOptions={{
          canvasActions: {
            saveAsImage: true,
          },
          tools: { image: !disableImageTool },
        }}
        renderTopRightUI={renderTopRightUI}
        onLinkOpen={onLinkOpen}
        validateEmbeddable={true}
      >
        {excalidrawAPI && (
          <Footer>
            <CustomFooter
              excalidrawAPI={excalidrawAPI}
              excalidrawLib={excalidrawLib}
            />
          </Footer>
        )}
        <WelcomeScreen />
      </Excalidraw>
    </div>
  );
};

export default ExcalidrawWrapper;
