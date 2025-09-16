import { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { db } from './dexie';
import { BinaryFiles } from '@excalidraw/excalidraw/types';
import { uploadDrawingFiles } from '../actions/drawing';
import { syncChange } from '../utils/sync';
class DrawingStorage {
  private id: string
  constructor(drawingId?: string, userId?: string) {
    if (drawingId) {
      this.id = drawingId;
    } else {
      this.id = crypto.randomUUID();
      if (!userId) throw new Error("userId is required")
      this.createNewDrawing(userId)
    }
  }
  async createNewDrawing(userId: string) {
    const existingDrawings = await db.drawings.where('name').startsWith('untitled').toArray();
    const numbers = existingDrawings.map(d => {
      const match = d.name.match(/^untitled(?: (\d+))?$/);
      return match ? parseInt(match[1] || '0') : 0;
    });
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    const name = maxNum === 0 ? 'untitled' : `untitled ${maxNum + 1}`;
    await db.drawings.put({
      id: this.id,
      name,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      elements: []
    });
  }
  async getElements() {
    try {
      const element = await db.drawings.get(this.id);
      const elements = element?.elements ?? [];
      return elements;
    } catch (error) {
      console.error('Failed to load elements:', error);
      return [];
    }
  }
  async saveElements(elements: OrderedExcalidrawElement[]): Promise<void> {
    try {
      await db.drawings.update(this.id, {
        id: this.id,
        updatedAt: new Date(),
        elements
      });
    } catch (error) {
      console.error('Failed to save elements:', error);
    }
  }
  async getDrawings() {
    return await db.drawings.toArray()
  }
  private async getAllKeys(): Promise<string[]> {
    const keys = await db.drawings.toCollection().keys()
    return keys as string[];
  };
  async removeElements(): Promise<void> {
    await db.drawings.delete(this.id)
  }


  //Files

  async saveFile(files: BinaryFiles): Promise<void> {
    try {
      const prev = await db.files.get(this.id);
      const prevIds = new Set(Object.keys(prev?.files ?? {}));
      const currentIds = Object.keys(files ?? {});
      const newIds = currentIds.filter((id) => !prevIds.has(id));
      await db.files.put({ key: this.id, files });
      console.log(`Saved ${currentIds.length} files to ${this.id}`);
      if (this.id && newIds.length > 0) {
        const toUpload = this.getFilesByIds(files, newIds);
        if (toUpload.length > 0) {
          uploadDrawingFiles(this.id, toUpload);
          syncChange(toUpload);
        }
      }
    } catch (e) {
      console.warn("FilesStore IndexedDB save failed", e);
      throw e;
    }
  }

  async getFiles() {
    try {
      const rec = await db.files.get(this.id);
      const files = rec?.files ?? null;
      console.log(`Loaded ${files ? Object.keys(files).length : 0} files from ${this.id}`);
      return files;
    } catch (e) {
      console.warn("FilesStore IndexedDB get failed", e);
      return null;
    }
  }
  private dataURLToBlob(dataURL: string): Blob {
    const [header, base64] = dataURL.split(",");
    const mimeMatch = /data:(.*?);base64/.exec(header);
    const mime = mimeMatch?.[1] || "application/octet-stream";
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }
  private dataURLToFile(dataURL: string, filename: string): File {
    const blob = this.dataURLToBlob(dataURL);
    return new File([blob], filename, { type: blob.type });
  }
  private getFilesByIds(files: BinaryFiles, ids: string[]) {
    const result: File[] = [];
    for (const id of ids) {
      const rec = files[id];
      if (!rec) continue;
      result.push(this.dataURLToFile(rec.dataURL, `${id}`));
    }
    return result;
  }
}

export const createDrawingStorage = (drawingId?: string) => {
  return new DrawingStorage(drawingId);
};
