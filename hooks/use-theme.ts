import { Theme } from "@excalidraw/excalidraw/element/types";
import { useTheme as useNextTheme } from "next-themes";
/*
 * This hook returns the current theme.
 * If the theme is set to "system", it returns the system theme light or dark.
 */
export function useTheme(): { theme: Theme } {
  const { theme, systemTheme } = useNextTheme();
  if (theme !== "system") return { theme: theme as Theme };
  return { theme: systemTheme as Theme };
}
