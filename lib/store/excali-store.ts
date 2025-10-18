import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { db } from "./dexie";
import { BinaryFiles } from "@excalidraw/excalidraw/types";
import { uploadDrawingFiles } from "../actions/drawing";
import { syncChange } from "../utils/sync";

export class DrawingStorage {
  id: string;

  constructor(drawingId: string) {
    this.id = drawingId;
    console.log("Initialized with this id", this.id);
  }
  // async createNewDrawing() {
  //   const existingDrawings = await db.drawings.where('name').startsWith('untitled').toArray();
  //   const numbers = existingDrawings?.map(d => {
  //     const match = d.name.match(/^untitled(?: (\d+))?$/);
  //     return match ? parseInt(match[1] || '0') : 0;
  //   });
  //   const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
  //   const name = maxNum === 0 ? 'untitled' : `untitled ${maxNum + 1}`;

  //   await db.drawings.put({
  //     id: this.id,
  //     name,
  //     userId: "",
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     elements: []
  //   });
  // }
  async getElements(): Promise<OrderedExcalidrawElement[]> {
    try {
      const drawing = await this.getDrawingById();
      console.log("me i found", this.id);
      console.log("drawing", drawing?.elements);
      return drawing?.elements ?? [];
    } catch (error) {
      console.error("Failed to load elements:", error);
      return [];
    }
  }
  async saveElements(elements: OrderedExcalidrawElement[]): Promise<void> {
    try {
      console.log(`attempting to save this element`, this.id);
      const drawing = await this.getDrawingById();
      if (drawing) {
        await db.drawings.update(this.id, {
          id: this.id,
          updatedAt: new Date(),
          elements,
        });
      } else {
        const id = await db.drawings.put({
          id: this.id,
          updatedAt: new Date(),
          elements,
          createdAt: new Date(),
          userId: "",
          name: "untitled",
        });
      }
      syncChange("save_element", {
        id: this.id,
        elements: elements,
      });
      console.log(`saved this element`, this.id);
    } catch (error) {
      console.error("Failed to save elements:", error);
    }
  }
  async editDrawingName(name: string) {
    await db.drawings.update(this.id, { name });
    syncChange("editDrawingName", {
      id: this.id,
      name,
    });
  }
  async getDrawings() {
    return await db.drawings.toArray();
  }
  private async getDrawingById() {
    const drawing = await db.drawings.get(this.id);
    return drawing;
  }
  async removeElements(): Promise<void> {
    await db.drawings.delete(this.id);
  }

  //Files
  async saveFile(files: BinaryFiles): Promise<void> {
    try {
      const prev = await db.files.get(this.id);
      const prevIds = new Set(Object.keys(prev?.files ?? {}));
      const currentIds = Object.keys(files ?? {});
      const newIds = currentIds.filter((id) => !prevIds.has(id));
      await db.files.put({ key: this.id, files });
      if (this.id && newIds.length > 0) {
        const toUpload = this.getFilesByIds(files, newIds);
        if (toUpload.length > 0) {
          uploadDrawingFiles(this.id, toUpload);
          // syncChange(toUpload);
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

export const createDrawingStorage = (drawingId: string) => {
  return new DrawingStorage(drawingId);
};
