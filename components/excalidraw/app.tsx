import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Children,
  cloneElement,
} from "react";

import type * as TExcalidraw from "@excalidraw/excalidraw";
import type {
  NonDeletedExcalidrawElement,
  Theme,
} from "@excalidraw/excalidraw/element/types";
import type {
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  Gesture,
  PointerDownState as ExcalidrawPointerDownState,
} from "@excalidraw/excalidraw/types";

import {
  resolvablePromise,
} from "./utils";

import CustomFooter from "./footer";


import type { ResolvablePromise } from "./utils";

type Comment = {
  x: number;
  y: number;
  value: string;
  id?: string;
};

type PointerDownState = {
  x: number;
  y: number;
  hitElement: Comment;
  onMove: any;
  onUp: any;
  hitElementOffsets: {
    x: number;
    y: number;
  };
};

const COMMENT_ICON_DIMENSION = 32;

export interface AppProps {
  useCustom: (api: ExcalidrawImperativeAPI | null, customArgs?: any[]) => void;
  customArgs?: any[];
  children: React.ReactNode;
  excalidrawLib: typeof TExcalidraw;
}

export default function ExampleApp({

  useCustom,
  customArgs,
  children,
  excalidrawLib,
}: AppProps) {
  const {

    useHandleLibrary,
    MIME_TYPES,
    sceneCoordsToViewportCoords,

    Footer,
    WelcomeScreen,
 
    LiveCollaborationTrigger,
    convertToExcalidrawElements,
  } = excalidrawLib;
  const appRef = useRef<any>(null);
  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [disableImageTool, setDisableImageTool] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [commentIcons, setCommentIcons] = useState<{ [id: string]: Comment }>(
    {},
  );
  const [comment, setComment] = useState<Comment | null>(null);

  const initialStatePromiseRef = useRef<{
    promise: ResolvablePromise<ExcalidrawInitialDataState | null>;
  }>({ promise: null! });
  if (!initialStatePromiseRef.current.promise) {
    initialStatePromiseRef.current.promise =
      resolvablePromise<ExcalidrawInitialDataState | null>();
  }

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  useCustom(excalidrawAPI, customArgs);

  useHandleLibrary({ excalidrawAPI });

  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }
    const fetchData = async () => {
      const res = await fetch("/images/rocket.jpeg");
      const imageData = await res.blob();
      const reader = new FileReader();
      reader.readAsDataURL(imageData);

      reader.onload = function () {


        //@ts-ignore
        initialStatePromiseRef.current.promise.resolve();

      };
    };
    fetchData();
  }, [excalidrawAPI, convertToExcalidrawElements, MIME_TYPES]);

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
    const newElement = cloneElement(
      Excalidraw,
      {
        excalidrawAPI: (api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api),
        initialData: initialStatePromiseRef.current.promise,
        onChange: (
          elements: NonDeletedExcalidrawElement[],
          state: AppState,
        ) => {
          console.info("Elements :", elements, "State : ", state);
        },
        onPointerUpdate: (payload: {
          pointer: { x: number; y: number };
          button: "down" | "up";
          pointersMap: Gesture["pointers"];
        }) => setPointerData(payload),
        viewModeEnabled,
        zenModeEnabled,
        gridModeEnabled,
        theme,
        name: "Custom name of drawing",
        UIOptions: {
          canvasActions: {
            loadScene: false,
          },
          tools: { image: !disableImageTool },
        },
        renderTopRightUI,
        onLinkOpen,
        onPointerDown,
        onScrollChange: rerenderCommentIcons,
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
  const renderTopRightUI = (isMobile: boolean) => {
    return (
      <>
        {!isMobile && (
          <LiveCollaborationTrigger
            isCollaborating={isCollaborating}
            onSelect={() => {
              window.alert("Collab dialog clicked");
            }}
          />
        )}
        <button
          onClick={() => alert("This is an empty top right UI")}
          style={{ height: "2.5rem" }}
        >
          Click me
        </button>
      </>
    );
  };

  // const loadSceneOrLibrary = async () => {
  //   const file = await fileOpen({ description: "Excalidraw or library file" });
  //   const contents = await loadSceneOrLibraryFromBlob(file, null, null);
  //   if (contents.type === MIME_TYPES.excalidraw) {
  //     excalidrawAPI?.updateScene(contents.data as any);
  //   } else if (contents.type === MIME_TYPES.excalidrawlib) {
  //     excalidrawAPI?.updateLibrary({
  //       libraryItems: (contents.data as ImportedLibraryData).libraryItems!,
  //       openLibraryMenu: true,
  //     });
  //   }
  // };

  // const updateScene = () => {
  //   const sceneData = {
  //     elements: restoreElements(
  //       convertToExcalidrawElements([
  //         {
  //           type: "rectangle",
  //           id: "rect-1",
  //           fillStyle: "hachure",
  //           strokeWidth: 1,
  //           strokeStyle: "solid",
  //           roughness: 1,
  //           angle: 0,
  //           x: 100.50390625,
  //           y: 93.67578125,
  //           strokeColor: "#c92a2a",
  //           width: 186.47265625,
  //           height: 141.9765625,
  //           seed: 1968410350,
  //           roundness: {
  //             type: ROUNDNESS.ADAPTIVE_RADIUS,
  //             value: 32,
  //           },
  //         },
  //         {
  //           type: "arrow",
  //           x: 300,
  //           y: 150,
  //           start: { id: "rect-1" },
  //           end: { type: "ellipse" },
  //         },
  //         {
  //           type: "text",
  //           x: 300,
  //           y: 100,
  //           text: "HELLO WORLD!",
  //         },
  //       ]),
  //       null,
  //     ),
  //     appState: {
  //       viewBackgroundColor: "#edf2ff",
  //     },
  //   };
  //   excalidrawAPI?.updateScene(sceneData);
  // };

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

  // const onCopy = async (type: "png" | "svg" | "json") => {
  //   if (!excalidrawAPI) {
  //     return false;
  //   }
  //   await exportToClipboard({
  //     elements: excalidrawAPI.getSceneElements(),
  //     appState: excalidrawAPI.getAppState(),
  //     files: excalidrawAPI.getFiles(),
  //     type,
  //   });
  //   window.alert(`Copied to clipboard as ${type} successfully`);
  // };

  // const [pointerData, setPointerData] = useState<{
  //   pointer: { x: number; y: number };
  //   button: "down" | "up";
  //   pointersMap: Gesture["pointers"];
  // } | null>(null);

  const onPointerDown = (
    activeTool: AppState["activeTool"],
    pointerDownState: ExcalidrawPointerDownState,
  ) => {
    if (activeTool.type === "custom" && activeTool.customType === "comment") {
      const { x, y } = pointerDownState.origin;
      setComment({ x, y, value: "" });
    }
  };

  const rerenderCommentIcons = () => {
    if (!excalidrawAPI) {
      return false;
    }
    const commentIconsElements = appRef.current.querySelectorAll(
      ".comment-icon",
    ) as HTMLElement[];
    commentIconsElements.forEach((ele) => {
      const id = ele.id;
      const appstate = excalidrawAPI.getAppState();
      const { x, y } = sceneCoordsToViewportCoords(
        { sceneX: commentIcons[id].x, sceneY: commentIcons[id].y },
        appstate,
      );
      ele.style.left = `${x - COMMENT_ICON_DIMENSION / 2 - appstate!.offsetLeft
        }px`;
      ele.style.top = `${y - COMMENT_ICON_DIMENSION / 2 - appstate!.offsetTop
        }px`;
    });
  };

  return (
    <div className="w-full h-full fixed px-7 py-2" ref={appRef}>
        {renderExcalidraw(children)}
        {/* {Object.keys(commentIcons || []).length > 0 && renderCommentIcons()}
        {comment && renderComment()} */}
    
    </div>
  );
}