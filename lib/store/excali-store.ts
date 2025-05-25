import { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types';

interface DrawingElementData {
  element: OrderedExcalidrawElement;
  lastUpdated: string;
}

interface SyncResult {
  updatedFromApi: OrderedExcalidrawElement[];
  keptFromLocal: OrderedExcalidrawElement[];
  newFromApi: OrderedExcalidrawElement[];
  onlyInLocal: OrderedExcalidrawElement[];
  summary: {
    totalProcessed: number;
    updatedFromApiCount: number;
    keptFromLocalCount: number;
    newFromApiCount: number;
    onlyInLocalCount: number;
  };
}

// Simple localStorage-based storage without Zustand reactivity
class DrawingElementsStorage {
  private storageKey: string

  constructor(drawingId?: string) {
    // Use drawing ID as key for better database synchronization
    this.storageKey = drawingId
      ? `drawing-${drawingId}`
      : 'drawing-new';
  }

  private getStoredElements(): Record<string, DrawingElementData> {
    try {
      const stored = localStorage.getItem(this.storageKey);
  
      if (!stored) return {};

      const parsed = JSON.parse(stored);
      console.log(`📋 Parsed data from ${this.storageKey}:`, Object.keys(parsed).length, 'elements');

      // Validate and clean the data structure
      const cleaned: Record<string, DrawingElementData> = {};
      Object.entries(parsed).forEach(([key, value]: [string, any]) => {
        if (value && typeof value === 'object' && value.element && value.lastUpdated) {
          cleaned[key] = value as DrawingElementData;
        }
      });
      return cleaned;
    } catch (error) {
      this.clearAllElements();
      return {};
    }
  }

  private setStoredElements(elements: Record<string, DrawingElementData>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(elements));
    } catch (error) {
      console.error('Failed to save elements to localStorage:', error);
    }
  }

  saveElement(id: string, element: OrderedExcalidrawElement): void {
    const stored = this.getStoredElements();
    stored[id] = {
      element,
      lastUpdated: new Date().toISOString()
    };
    this.setStoredElements(stored);
  }

  saveElements(elements: OrderedExcalidrawElement[]): void {
    const timestamp = new Date().toISOString();
    const elementsMap: Record<string, DrawingElementData> = {};

    elements.forEach((element) => {
      elementsMap[element.id] = {
        element,
        lastUpdated: timestamp
      };
    });

    this.setStoredElements(elementsMap);
  }

  getElement(id: string): OrderedExcalidrawElement | null {
    const stored = this.getStoredElements();
    return stored[id]?.element || null;
  }

  getLastUpdated(id: string): string | null {
    const stored = this.getStoredElements();
    return stored[id]?.lastUpdated || null;
  }

  getElementsArray(): OrderedExcalidrawElement[] {
    const stored = this.getStoredElements();
    const elements = Object.values(stored).map(data => data.element);
   
    return elements;
  }

  getAllElements(): Record<string, DrawingElementData> {
    return this.getStoredElements();
  }

  removeElement(id: string): void {
    const stored = this.getStoredElements();
    delete stored[id];
    this.setStoredElements(stored);
  }

  clearAllElements(): void {
    this.setStoredElements({});
  }

  hasElement(id: string): boolean {
    const stored = this.getStoredElements();
    return id in stored;
  }

  /**
   * Clean up any corrupted data in localStorage
   * This method will remove any invalid entries and keep only valid ones
   */
  cleanupStorage(): void {
    console.log('🧹 Cleaning up storage...');
    const stored = this.getStoredElements(); // This already cleans the data
    this.setStoredElements(stored);
    console.log('✅ Storage cleanup complete');
  }

  /**
   * Compare two ISO timestamp strings to determine which is newer
   * @param timestamp1 First timestamp (ISO string)
   * @param timestamp2 Second timestamp (ISO string)
   * @returns 1 if timestamp1 is newer, -1 if timestamp2 is newer, 0 if equal
   */
  private compareTimestamps(timestamp1: string, timestamp2: string): number {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    if (date1.getTime() > date2.getTime()) return 1;
    if (date1.getTime() < date2.getTime()) return -1;
    return 0;
  }

  /**
   * Synchronize API elements with localStorage based on timestamps
   * @param apiElements Elements received from API (assumed to have lastUpdated in their metadata or use current time)
   * @param apiTimestamp Optional timestamp for all API elements (if they don't have individual timestamps)
   * @returns SyncResult with details about what was updated, kept, or added
   */
  syncWithApiElements(
    apiElements: OrderedExcalidrawElement[],
    apiTimestamp?: string
  ): SyncResult {
    const stored = this.getStoredElements();
    const currentTime = new Date().toISOString();
    const defaultApiTimestamp = apiTimestamp || currentTime;

    const result: SyncResult = {
      updatedFromApi: [],
      keptFromLocal: [],
      newFromApi: [],
      onlyInLocal: [],
      summary: {
        totalProcessed: 0,
        updatedFromApiCount: 0,
        keptFromLocalCount: 0,
        newFromApiCount: 0,
        onlyInLocalCount: 0,
      }
    };

    // Track which elements we've processed from API
    const processedApiElementIds = new Set<string>();

    // Process each API element
    apiElements.forEach(apiElement => {
      processedApiElementIds.add(apiElement.id);
      const localElementData = stored[apiElement.id];

      if (!localElementData) {
        // Element doesn't exist in localStorage - always save from API
        const elementData: DrawingElementData = {
          element: apiElement,
          lastUpdated: defaultApiTimestamp
        };
        stored[apiElement.id] = elementData;
        result.newFromApi.push(apiElement);
        result.summary.newFromApiCount++;
      } else {
        // Element exists in both - compare timestamps
        const comparison = this.compareTimestamps(defaultApiTimestamp, localElementData.lastUpdated);

        if (comparison > 0) {
          // API element is newer - update localStorage
          const elementData: DrawingElementData = {
            element: apiElement,
            lastUpdated: defaultApiTimestamp
          };
          stored[apiElement.id] = elementData;
          result.updatedFromApi.push(apiElement);
          result.summary.updatedFromApiCount++;
        } else {
          // Local element is newer or equal - keep local
          if (localElementData.element) {
            result.keptFromLocal.push(localElementData.element);
            result.summary.keptFromLocalCount++;
          } else {
            console.warn('Invalid local element data:', localElementData);
          }
        }
      }

      result.summary.totalProcessed++;
    });

    // Find elements that exist only in localStorage
    Object.values(stored).forEach(localElementData => {
      // Safety check to ensure the data structure is correct
      if (localElementData && localElementData.element && localElementData.element.id) {
        if (!processedApiElementIds.has(localElementData.element.id)) {
          result.onlyInLocal.push(localElementData.element);
          result.summary.onlyInLocalCount++;
        }
      } 
    });

    // Save the updated storage
    this.setStoredElements(stored);

    return result;
  }

  /**
   * Get the final merged elements after synchronization
   * This returns all elements (from API sync + local-only elements)
   */
  getMergedElements(): OrderedExcalidrawElement[] {
    return this.getElementsArray();
  }
}

// Create a factory function for drawing-specific storage instances
export const createDrawingElementsStorage = (drawingId?: string) => {
  return new DrawingElementsStorage(drawingId);
};

// Create a default singleton instance for backward compatibility
export const drawingElementsStorage = new DrawingElementsStorage();
