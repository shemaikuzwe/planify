import { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { db } from './dexie';
class DrawingElementsStorage {
  private storageKey: string
  constructor(drawingId?: string) {
    this.storageKey = drawingId ? `drawing-${drawingId}` : 'drawing-new';
  }
  async getElements() {
    try {
      const element = await db.elements.get(this.storageKey);
      const elements = element?.elements ?? [];
      console.log(`Loaded ${elements.length} elements from ${this.storageKey}`);
      return elements;
    } catch (error) {
      console.error('Failed to load elements:', error);
      return [];
    }
  }
  async saveElements(elements: OrderedExcalidrawElement[]): Promise<void> {
    try {
      await db.elements.put({ key: this.storageKey, elements });
      console.log(`Saved ${elements.length} elements to ${this.storageKey}`);
    } catch (error) {
      console.error('Failed to save elements:', error);
    }
  }
  private async getAllKeys(): Promise<string[]> {
    const keys = await db.elements.toCollection().keys()
    return keys as string[];
  };
  async removeElements(): Promise<void> {
    await db.elements.delete(this.storageKey)
  }
}

export const createDrawingElementsStorage = (drawingId?: string) => {
  return new DrawingElementsStorage(drawingId);
};

export const drawingElementsStorage = new DrawingElementsStorage();
