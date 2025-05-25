import { drawingElementsStorage, createDrawingElementsStorage } from '@/lib/store/excali-store';
import { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types';

/**
 * Utility functions for working with drawing elements storage
 * These functions can be used outside of React components
 */

/**
 * Save a single drawing element with timestamp
 */
export const saveDrawingElement = (id: string, element: OrderedExcalidrawElement) => {
  drawingElementsStorage.saveElement(id, element);
};

/**
 * Get a drawing element by ID
 */
export const getDrawingElement = (id: string): OrderedExcalidrawElement | null => {
  return drawingElementsStorage.getElement(id);
};

/**
 * Get the last updated timestamp for an element
 */
export const getElementLastUpdated = (id: string): string | null => {
  return drawingElementsStorage.getLastUpdated(id);
};

/**
 * Get element with its metadata (element + lastUpdated)
 */
export const getElementWithMetadata = (id: string) => {
  const element = drawingElementsStorage.getElement(id);
  const lastUpdated = drawingElementsStorage.getLastUpdated(id);

  return {
    element,
    lastUpdated,
    exists: !!element
  };
};

/**
 * Get all elements as an array
 */
export const getAllDrawingElements = (): OrderedExcalidrawElement[] => {
  return drawingElementsStorage.getElementsArray();
};

/**
 * Get all elements with their metadata
 */
export const getAllElementsWithMetadata = () => {
  return drawingElementsStorage.getAllElements();
};

/**
 * Check if an element exists in storage
 */
export const hasDrawingElement = (id: string): boolean => {
  return drawingElementsStorage.hasElement(id);
};

/**
 * Remove a specific element from storage
 */
export const removeDrawingElement = (id: string) => {
  drawingElementsStorage.removeElement(id);
};

/**
 * Clear all elements from storage
 */
export const clearAllDrawingElements = () => {
  drawingElementsStorage.clearAllElements();
};

/**
 * Save multiple elements at once
 */
export const saveMultipleDrawingElements = (elements: OrderedExcalidrawElement[]) => {
  drawingElementsStorage.saveElements(elements);
};

/**
 * Create a drawing-specific storage instance
 */
export const createDrawingStorage = (drawingId?: string) => {
  return createDrawingElementsStorage(drawingId);
};

/**
 * Save a single drawing element with timestamp for a specific drawing
 */
export const saveDrawingElementForDrawing = (drawingId: string, id: string, element: OrderedExcalidrawElement) => {
  const storage = createDrawingElementsStorage(drawingId);
  storage.saveElement(id, element);
};

/**
 * Get a drawing element by ID for a specific drawing
 */
export const getDrawingElementForDrawing = (drawingId: string, id: string): OrderedExcalidrawElement | null => {
  const storage = createDrawingElementsStorage(drawingId);
  return storage.getElement(id);
};

/**
 * Save multiple elements at once for a specific drawing
 */
export const saveMultipleDrawingElementsForDrawing = (drawingId: string, elements: OrderedExcalidrawElement[]) => {
  const storage = createDrawingElementsStorage(drawingId);
  storage.saveElements(elements);
};

/**
 * Get elements that were updated after a specific timestamp
 */
export const getElementsUpdatedAfter = (timestamp: string): OrderedExcalidrawElement[] => {
  const allElements = drawingElementsStorage.getAllElements();

  return Object.values(allElements)
    .filter(data => data.lastUpdated > timestamp)
    .map(data => data.element);
};

/**
 * Get the most recently updated element
 */
export const getMostRecentlyUpdatedElement = (): { element: OrderedExcalidrawElement; lastUpdated: string } | null => {
  const allElements = drawingElementsStorage.getAllElements();

  if (Object.keys(allElements).length === 0) {
    return null;
  }

  const mostRecent = Object.values(allElements).reduce((latest, current) => {
    return current.lastUpdated > latest.lastUpdated ? current : latest;
  });

  return {
    element: mostRecent.element,
    lastUpdated: mostRecent.lastUpdated
  };
};

/**
 * Export elements to JSON with metadata
 */
export const exportElementsWithMetadata = () => {
  const allElements = drawingElementsStorage.getAllElements();

  return {
    exportedAt: new Date().toISOString(),
    elementsCount: Object.keys(allElements).length,
    elements: allElements
  };
};

/**
 * Import elements from JSON (with or without metadata)
 */
export const importElements = (data: any) => {
  if (Array.isArray(data)) {
    // If it's just an array of elements, save them
    drawingElementsStorage.saveElements(data);
  } else if (data.elements) {
    // If it's an export with metadata, we need to restore each element individually
    const elementsMap = data.elements;
    Object.entries(elementsMap).forEach(([id, elementData]: [string, any]) => {
      drawingElementsStorage.saveElement(id, elementData.element);
    });
  }
};

/**
 * Synchronize API elements with localStorage based on timestamps
 * @param apiElements Elements from API
 * @param apiTimestamp Optional timestamp for API elements
 * @returns Sync result with details about what was updated
 */
export const syncApiElementsWithLocal = (
  apiElements: OrderedExcalidrawElement[],
  apiTimestamp?: string
) => {
  return drawingElementsStorage.syncWithApiElements(apiElements, apiTimestamp);
};

/**
 * Get merged elements after synchronization
 * @returns All elements (from API sync + local-only elements)
 */
export const getMergedElements = (): OrderedExcalidrawElement[] => {
  return drawingElementsStorage.getMergedElements();
};
