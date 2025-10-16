import { Theme } from "@excalidraw/excalidraw/element/types";

export function useTheme(): Theme {
  const theme = localStorage.getItem("theme") || "system";
}
