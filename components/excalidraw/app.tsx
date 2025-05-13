import { nanoid } from "nanoid";
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
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import { loadFromBlob } from "@excalidraw/excalidraw/data/blob";

import type {
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  Gesture,
  PointerDownState as ExcalidrawPointerDownState,
  BinaryFiles,
} from "@excalidraw/excalidraw/types";

import {
  resolvablePromise,
  distance2d,
  withBatchedUpdates,
  withBatchedUpdatesThrottled,
} from "./utils";

import CustomFooter from "./footer";
import type { ResolvablePromise } from "./utils";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useLocalStorage } from "@/hooks/use-local-storage";
import SaveDialog from "./save-dialog";
import { useStore } from "@/lib/store";

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
const COMMENT_INPUT_HEIGHT = 50;
const COMMENT_INPUT_WIDTH = 150;
const initialData = {
  scrollToContent: true,
}
export interface AppProps {
  apiElements?: OrderedExcalidrawElement[],
  drawingId?: string,
  children: React.ReactNode;
  excalidrawLib: typeof TExcalidraw;
}

export default function App({
  apiElements,
  children,
  drawingId,
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
  const { updateElement, drawing, updateLastUpdated } = useStore()
  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const { theme } = useTheme()
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


  useHandleLibrary({ excalidrawAPI });

  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }
    const fetchData = async () => {
      console.log(drawing.elements);

      // const res = await fetch("/images/rocket.jpeg");
      // const imageData = await res.blob();
      // const reader = new FileReader();
      // reader.readAsDataURL(imageData);

      // reader.onload = function () {
      //   //@ts-ignore
      //   initialStatePromiseRef.current.promise.resolve();
      // };

      // Make sure elements is in the correct format
      let parsedElements = apiElements;

      if (!parsedElements && drawing.elements) {
        try {
          if (typeof drawing.elements === 'string') {
            parsedElements = JSON.parse(drawing.elements);
          } else {
            parsedElements = drawing.elements;
          }

          if (!Array.isArray(parsedElements)) {
            parsedElements = [];
          }
        } catch (error) {
          console.error('Error parsing elements:', error);
          parsedElements = [];
        }
      }

      // @ts-ignore
      initialStatePromiseRef.current.promise.resolve({
        ...initialData,
        elements: parsedElements,
      });
    };
    fetchData();
  }, [excalidrawAPI, convertToExcalidrawElements, MIME_TYPES])
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
          elements: OrderedExcalidrawElement[],
          state: AppState,
          files: BinaryFiles
        ) => {
          const elementsString = JSON.stringify(elements);
          const currentElements = drawing?.elements || "";

          // Only update if elements have actually changed
          if (elementsString !== currentElements) {
            console.log("Elements have changed");
            updateElement(elementsString);
            updateLastUpdated();
          }
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
            toggleTheme: true,
            theme: theme,
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
        {/* <SaveDialog elements={apiElements} drawingId={drawingId} /> */}
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

  const onCopy = async (type: "png" | "svg" | "json") => {
    if (!excalidrawAPI) {
      return false;
    }
    await exportToClipboard({
      elements: excalidrawAPI.getSceneElements(),
      appState: excalidrawAPI.getAppState(),
      files: excalidrawAPI.getFiles(),
      type,
    });
    window.alert(`Copied to clipboard as ${type} successfully`);
  };

  const [pointerData, setPointerData] = useState<{
    pointer: { x: number; y: number };
    button: "down" | "up";
    pointersMap: Gesture["pointers"];
  } | null>(null);

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

  const onPointerMoveFromPointerDownHandler = (
    pointerDownState: PointerDownState,
  ) => {
    return withBatchedUpdatesThrottled((event) => {
      if (!excalidrawAPI) {
        return false;
      }
      const { x, y } = viewportCoordsToSceneCoords(
        {
          clientX: event.clientX - pointerDownState.hitElementOffsets.x,
          clientY: event.clientY - pointerDownState.hitElementOffsets.y,
        },
        excalidrawAPI.getAppState(),
      );
      setCommentIcons({
        ...commentIcons,
        [pointerDownState.hitElement.id!]: {
          ...commentIcons[pointerDownState.hitElement.id!],
          x,
          y,
        },
      });
    });
  };
  const onPointerUpFromPointerDownHandler = (
    pointerDownState: PointerDownState,
  ) => {
    return withBatchedUpdates((event) => {
      window.removeEventListener("pointermove", pointerDownState.onMove);
      window.removeEventListener("pointerup", pointerDownState.onUp);
      excalidrawAPI?.setActiveTool({ type: "selection" });
      const distance = distance2d(
        pointerDownState.x,
        pointerDownState.y,
        event.clientX,
        event.clientY,
      );
      if (distance === 0) {
        if (!comment) {
          setComment({
            x: pointerDownState.hitElement.x + 60,
            y: pointerDownState.hitElement.y,
            value: pointerDownState.hitElement.value,
            id: pointerDownState.hitElement.id,
          });
        } else {
          setComment(null);
        }
      }
    });
  };

  const renderCommentIcons = () => {
    return Object.values(commentIcons).map((commentIcon) => {
      if (!excalidrawAPI) {
        return false;
      }
      const appState = excalidrawAPI.getAppState();
      const { x, y } = sceneCoordsToViewportCoords(
        { sceneX: commentIcon.x, sceneY: commentIcon.y },
        excalidrawAPI.getAppState(),
      );
      return (
        <div
          id={commentIcon.id}
          key={commentIcon.id}
          style={{
            top: `${y - COMMENT_ICON_DIMENSION / 2 - appState!.offsetTop}px`,
            left: `${x - COMMENT_ICON_DIMENSION / 2 - appState!.offsetLeft}px`,
            position: "absolute",
            zIndex: 1,
            width: `${COMMENT_ICON_DIMENSION}px`,
            height: `${COMMENT_ICON_DIMENSION}px`,
            cursor: "pointer",
            touchAction: "none",
          }}
          className="comment-icon"
          onPointerDown={(event) => {
            event.preventDefault();
            if (comment) {
              commentIcon.value = comment.value;
              saveComment();
            }
            const pointerDownState: any = {
              x: event.clientX,
              y: event.clientY,
              hitElement: commentIcon,
              hitElementOffsets: { x: event.clientX - x, y: event.clientY - y },
            };
            const onPointerMove =
              onPointerMoveFromPointerDownHandler(pointerDownState);
            const onPointerUp =
              onPointerUpFromPointerDownHandler(pointerDownState);
            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", onPointerUp);

            pointerDownState.onMove = onPointerMove;
            pointerDownState.onUp = onPointerUp;

            excalidrawAPI?.setActiveTool({
              type: "custom",
              customType: "comment",
            });
          }}
        >
          {/* <div className="comment-avatar">
            <img src="images/doremon.png" alt="doremon" />
          </div> */}
        </div>
      );
    });
  };

  const saveComment = () => {
    if (!comment) {
      return;
    }
    if (!comment.id && !comment.value) {
      setComment(null);
      return;
    }
    const id = comment.id || nanoid();
    setCommentIcons({
      ...commentIcons,
      [id]: {
        x: comment.id ? comment.x - 60 : comment.x,
        y: comment.y,
        id,
        value: comment.value,
      },
    });
    setComment(null);
  };

  const renderComment = () => {
    if (!comment) {
      return null;
    }
    const appState = excalidrawAPI?.getAppState()!;
    const { x, y } = sceneCoordsToViewportCoords(
      { sceneX: comment.x, sceneY: comment.y },
      appState,
    );
    let top = y - COMMENT_ICON_DIMENSION / 2 - appState.offsetTop;
    let left = x - COMMENT_ICON_DIMENSION / 2 - appState.offsetLeft;

    if (
      top + COMMENT_INPUT_HEIGHT <
      appState.offsetTop + COMMENT_INPUT_HEIGHT
    ) {
      top = COMMENT_ICON_DIMENSION / 2;
    }
    if (top + COMMENT_INPUT_HEIGHT > appState.height) {
      top = appState.height - COMMENT_INPUT_HEIGHT - COMMENT_ICON_DIMENSION / 2;
    }
    if (
      left + COMMENT_INPUT_WIDTH <
      appState.offsetLeft + COMMENT_INPUT_WIDTH
    ) {
      left = COMMENT_ICON_DIMENSION / 2;
    }
    if (left + COMMENT_INPUT_WIDTH > appState.width) {
      left = appState.width - COMMENT_INPUT_WIDTH - COMMENT_ICON_DIMENSION / 2;
    }

    return (
      <textarea
        className="comment"
        style={{
          top: `${top}px`,
          left: `${left}px`,
          position: "absolute",
          zIndex: 1,
          height: `${COMMENT_INPUT_HEIGHT}px`,
          width: `${COMMENT_INPUT_WIDTH}px`,
        }}
        ref={(ref) => {
          setTimeout(() => ref?.focus());
        }}
        placeholder={comment.value ? "Reply" : "Comment"}
        value={comment.value}
        onChange={(event) => {
          setComment({ ...comment, value: event.target.value });
        }}
        onBlur={saveComment}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === "Enter") {
            event.preventDefault();
            saveComment();
          }
        }}
      />
    );
  };



  return (
    <div className={cn("h-full fixed px-4 py-2", {
      "w-320": collapsed,
      "w-270": !collapsed
    })}
      ref={appRef}>
      {renderExcalidraw(children)}
      {/* {Object.keys(commentIcons || []).length > 0 && renderCommentIcons()}
        {comment && renderComment()} */}

    </div>
  );
}