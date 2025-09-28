import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Children,
  cloneElement,
  useMemo,
} from "react";

import type * as TExcalidraw from "@excalidraw/excalidraw";
import type {
  NonDeletedExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";

import type {
  AppState,
  ExcalidrawImperativeAPI,
  BinaryFiles,
} from "@excalidraw/excalidraw/types";

import CustomFooter from "./footer";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils/utils";
import { useTheme } from "next-themes";
import { createDrawingStorage } from "@/lib/store/excali-store";
import InlineInput from "../ui/inline-input";
import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/store/dexie";


type InitialData = {
  scrollToContent: boolean
  files: BinaryFiles | null
  elements: OrderedExcalidrawElement[]
}
const initialData: InitialData = {
  scrollToContent: true,
  files: {},
  elements: []
}
export interface AppProps {
  children: React.ReactNode;
  excalidrawLib: typeof TExcalidraw;
}

export default function App({
  children,
  excalidrawLib,
}: AppProps) {
  const {
    useHandleLibrary,
    Footer,
    WelcomeScreen,
    LiveCollaborationTrigger,
    convertToExcalidrawElements,
  } = excalidrawLib;
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const appRef = useRef<any>(null);
  const { id } = useParams<{ id: string }>();
  const drawingStorage = useMemo(() => createDrawingStorage(id), [id]);
  const [elements, setElements] = useState<OrderedExcalidrawElement[] | null>(null);

  const drawing = useLiveQuery(async () => db.drawings.get(id))

  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const { theme } = useTheme()
  const [disableImageTool, setDisableImageTool] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);


  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
 

  useHandleLibrary({ excalidrawAPI });

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
  

    useEffect(() => {
      async function init() {
        if (!drawingStorage) return;
        const [storedFiles, storedElements] = await Promise.all([drawingStorage.getFiles(), drawingStorage?.getElements()])
        setElements(storedElements)
        initialData.files = storedFiles
        initialData.elements = storedElements
      }
      init()
    }, [drawingStorage])

    const newElement = cloneElement(
      Excalidraw,
      {
        excalidrawAPI: (api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api),
        // Always resolve initial data via promise so we can await files from IndexedDB
        initialData: initialData,
        onChange: (
          newElements: OrderedExcalidrawElement[],
          state: AppState,
          files: BinaryFiles
        ) => {
          // if (!drawingStorage) return;
          setElements(newElements)
          if (!(JSON.stringify(newElements) === JSON.stringify(elements))) {
            drawingStorage.saveElements(newElements).catch(error => {
              console.error('Failed to save elements:', error);
            });
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
