import { drawingElementsStorage, createDrawingElementsStorage } from '@/lib/store/excali-store';
import { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types';

/**
 * Utility functions for working with drawing elements storage
 * These functions can be used outside of React components
 */

/**
 * Save a single drawing element with timestamp
 */
export const saveDrawingElement = async (id: string, element: OrderedExcalidrawElement): Promise<void> => {
  await drawingElementsStorage.saveElement(id, element);
};

/**
 * Get a drawing element by ID
 */
export const getDrawingElement = async (id: string): Promise<OrderedExcalidrawElement | null> => {
  return await drawingElementsStorage.getElement(id);
};

/**
 * Get the last updated timestamp for an element
 */
export const getElementLastUpdated = async (id: string): Promise<string | null> => {
  return await drawingElementsStorage.getLastUpdated(id);
};

/**
 * Get element with its metadata (element + lastUpdated)
 */
export const getElementWithMetadata = async (id: string) => {
  const element = await drawingElementsStorage.getElement(id);
  const lastUpdated = await drawingElementsStorage.getLastUpdated(id);

  return {
    element,
    lastUpdated,
    exists: !!element
  };
};

/**
 * Get all elements as an array
 */
export const getAllDrawingElements = async (): Promise<OrderedExcalidrawElement[]> => {
  return await drawingElementsStorage.getElementsArray();
};

/**
 * Get all elements with their metadata
 */
export const getAllElementsWithMetadata = async () => {
  return await drawingElementsStorage.getAllElements();
};

/**
 * Check if an element exists in storage
 */
export const hasDrawingElement = async (id: string): Promise<boolean> => {
  return await drawingElementsStorage.hasElement(id);
};

/**
 * Remove a specific element from storage
 */
export const removeDrawingElement = async (id: string): Promise<void> => {
  await drawingElementsStorage.removeElement(id);
};

/**
 * Clear all elements from storage
 */
export const clearAllDrawingElements = async (): Promise<void> => {
  await drawingElementsStorage.clearAllElements();
};

/**
 * Save multiple elements at once
 */
export const saveMultipleDrawingElements = async (elements: OrderedExcalidrawElement[]): Promise<void> => {
  await drawingElementsStorage.saveElements(elements);
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
export const saveDrawingElementForDrawing = async (drawingId: string, id: string, element: OrderedExcalidrawElement): Promise<void> => {
  const storage = createDrawingElementsStorage(drawingId);
  await storage.saveElement(id, element);
};

/**
 * Get a drawing element by ID for a specific drawing
 */
export const getDrawingElementForDrawing = async (drawingId: string, id: string): Promise<OrderedExcalidrawElement | null> => {
  const storage = createDrawingElementsStorage(drawingId);
  return await storage.getElement(id);
};

/**
 * Save multiple elements at once for a specific drawing
 */
export const saveMultipleDrawingElementsForDrawing = async (drawingId: string, elements: OrderedExcalidrawElement[]): Promise<void> => {
  const storage = createDrawingElementsStorage(drawingId);
  await storage.saveElements(elements);
};

/**
 * Get elements that were updated after a specific timestamp
 */
export const getElementsUpdatedAfter = async (timestamp: string): Promise<OrderedExcalidrawElement[]> => {
  const allElements = await drawingElementsStorage.getAllElements();

  return Object.values(allElements)
    .filter(data => data.lastUpdated > timestamp)
    .map(data => data.element);
};

/**
 * Get the most recently updated element
 */
export const getMostRecentlyUpdatedElement = async (): Promise<{ element: OrderedExcalidrawElement; lastUpdated: string } | null> => {
  const allElements = await drawingElementsStorage.getAllElements();

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
export const exportElementsWithMetadata = async () => {
  const allElements = await drawingElementsStorage.getAllElements();

  return {
    exportedAt: new Date().toISOString(),
    elementsCount: Object.keys(allElements).length,
    elements: allElements
  };
};

/**
 * Import elements from JSON (with or without metadata)
 */
export const importElements = async (data: any): Promise<void> => {
  if (Array.isArray(data)) {
    // If it's just an array of elements, save them
    await drawingElementsStorage.saveElements(data);
  } else if (data.elements) {
    // If it's an export with metadata, we need to restore each element individually
    const elementsMap = data.elements;
    for (const [id, elementData] of Object.entries(elementsMap)) {
      await drawingElementsStorage.saveElement(id, (elementData as any).element);
    }
  }
};


