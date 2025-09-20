import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  Children,
  cloneElement,
} from "react";

import type * as TExcalidraw from "@excalidraw/excalidraw";
import type {
  NonDeletedExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";

import type {
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  BinaryFiles,
} from "@excalidraw/excalidraw/types";

import {
  resolvablePromise,
} from "./utils";

import CustomFooter from "./footer";
import type { ResolvablePromise } from "./utils";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils/utils";
import { useTheme } from "next-themes";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { createDrawingStorage } from "@/lib/store/excali-store";
import InlineInput from "../ui/inline-input";
import { useSession } from "next-auth/react";
import { ElementRecord } from "@/lib/store/schema/schema";


const initialData = {
  scrollToContent: true,
}
export interface AppProps {
  drawing?: ElementRecord | undefined,
  children: React.ReactNode;
  excalidrawLib: typeof TExcalidraw;
}

export default function App({
  children,
  drawing,
  excalidrawLib,
}: AppProps) {
  const {
    exportToClipboard,
    useHandleLibrary,
    MIME_TYPES,
    sceneCoordsToViewportCoords,
    viewportCoordsToSceneCoords,
    Footer,
    WelcomeScreen,
    LiveCollaborationTrigger,
    convertToExcalidrawElements,
  } = excalidrawLib;
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const appRef = useRef<any>(null);
  const { data: session, status } = useSession()
  // feat add react-compiler
  const drawingStorage = useMemo(() => {
    return createDrawingStorage(drawing?.id);
  }, [drawing]);

  const [elements, setElements] = useState<OrderedExcalidrawElement[] | null>(null);
  const [appState, setAppState] = useLocalStorage<null | AppState>("appState", null);
  const prevElementsRef = useRef<OrderedExcalidrawElement[]>([]);

  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const { theme } = useTheme()
  const [disableImageTool, setDisableImageTool] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);

  const initialStatePromiseRef = useRef<{
    promise: ResolvablePromise<ExcalidrawInitialDataState | null>;
    resolved: boolean;
  }>({ promise: null!, resolved: false });
  if (!initialStatePromiseRef.current.promise) {
    initialStatePromiseRef.current.promise =
      resolvablePromise<ExcalidrawInitialDataState | null>();
    initialStatePromiseRef.current.resolved = false;

  }
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);


  useHandleLibrary({ excalidrawAPI });
  //Elements changes
  useEffect(() => {
    if (!drawingStorage) return;

    async function init() {
      const storedElements = await drawingStorage?.getElements()
      if (storedElements) {
        setElements(storedElements)
        prevElementsRef.current = storedElements
      } else {
        setElements([])
        prevElementsRef.current = []
      }
    }
    init()
  }, [drawingStorage]);

  //Files changes
  useEffect(() => {
    if (!excalidrawAPI || elements === null || initialStatePromiseRef.current.resolved || !drawingStorage) {
      return;
    }
    const fetchData = async () => {
      try {
        const storedFiles = await drawingStorage!.getFiles();
        // @ts-ignore
        initialStatePromiseRef.current.promise.resolve({
          ...initialData,
          elements,
          files: storedFiles ?? {},
          scrollToContent: true,
        });
        initialStatePromiseRef.current.resolved = true;
        console.log('Initial data promise resolved successfully');
      } catch (error) {
        console.error('Failed to resolve initial data promise:', error);
        // Fallback: resolve with basic data
        // @ts-ignore
        initialStatePromiseRef.current.promise.resolve({
          ...initialData,
          elements: elements || [],
          files: {},
          scrollToContent: true,
        });
        initialStatePromiseRef.current.resolved = true;
      }
    };
    fetchData();
  }, [excalidrawAPI, convertToExcalidrawElements, MIME_TYPES, elements, drawing, drawingStorage]);

  // Fallback: ensure promise is resolved after a timeout
  useEffect(() => {
    if (initialStatePromiseRef.current.resolved) return;

    const timeout = setTimeout(() => {
      if (!initialStatePromiseRef.current.resolved) {
        console.log('Resolving initial data promise due to timeout');
        // @ts-ignore
        initialStatePromiseRef.current.promise.resolve({
          ...initialData,
          elements: elements || [],
          files: {},
          scrollToContent: true,
        });
        initialStatePromiseRef.current.resolved = true;
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [elements]);


  const renderExcalidraw = (children: React.ReactNode) => {
    const Excalidraw: any = Children.toArray(children).find(
      (child) =>
        React.isValidElement(child) &&
        typeof child.type !== "string" &&
        //@ts-expect-error
        // display
        child.type.displayName === "Excalidraw",
    );
    if (!Excalidraw) {
      return;
    }

    // Ensure the initial data promise is resolved with default data if not already resolved
    if (!initialStatePromiseRef.current.resolved) {
      console.log('Resolving initial data promise with default data');
      // @ts-ignore
      initialStatePromiseRef.current.promise.resolve({
        ...initialData,
        elements: elements || [],
        files: {},
        scrollToContent: true,
      });
      initialStatePromiseRef.current.resolved = true;
    }

    const newElement = cloneElement(
      Excalidraw,
      {
        excalidrawAPI: (api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api),
        // Always resolve initial data via promise so we can await files from IndexedDB
        initialData: initialStatePromiseRef.current.promise,
        onChange: (
          newElements: OrderedExcalidrawElement[],
          state: AppState,
          files: BinaryFiles
        ) => {
          setAppState(state);
          setElements(newElements);
          if (!drawingStorage) return;
          // Save elements only if changed
          if (JSON.stringify(newElements) !== JSON.stringify(prevElementsRef.current)) {
            drawingStorage.saveElements(newElements).catch(error => {
              console.error('Failed to save elements:', error);
            });
            prevElementsRef.current = newElements;
          }
          // Save files
          drawingStorage.saveFile(files).catch(error => {
            console.error('Failed to save files:', error);
          });
        },
        viewModeEnabled,
        zenModeEnabled,
        gridModeEnabled,
        theme,
        name: "excalidraw",
        UIOptions: {
          canvasActions: {
            toggleTheme: true,
            theme: theme == "light" ? "light" : "dark",
          },

          tools: { image: !disableImageTool },
        },
        renderTopRightUI,
        onLinkOpen,
        validateEmbeddable: true,
      },
      <>
        {excalidrawAPI && (
          <Footer>
            <CustomFooter
              excalidrawAPI={excalidrawAPI}
              excalidrawLib={excalidrawLib}
            />
          </Footer>
        )}
        <WelcomeScreen />
      </>,
    );
    return newElement;
  };
  const handleNameChange = (name: string) => {
    if (!drawingStorage) return;
    drawingStorage.editDrawingName(name)
  }

  const renderTopRightUI = (isMobile: boolean) => {
    return (
      <>
        <div className="absolute flex justify-center items-center top-0 left-8 z-[10000]">
          {/* <DrawingPicker drawingsPromise={drawingsPromise}/> */}
          <InlineInput value={drawing?.name ?? "Untitled"} onChange={handleNameChange}
            options={{ slice: 20 }}
            className="w-36 mt-2 ml-2 text-md"
          />
        </div>
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
        // signal that we're handling the redirect ourselves
        event.preventDefault();
        // do a custom redirect, such as passing to react-router
        // ...
      }
    },
    [],
  );



  return (
    <div className={cn("h-full fixed px-2 py-2", {
      "w-330": collapsed,
      "w-270": !collapsed
    })}
      ref={appRef}>
      {renderExcalidraw(children)}
      {/* {Object.keys(commentIcons || []).length > 0 && renderCommentIcons()}
        {comment && renderComment()} */}

    </div>
  );
}
