import {
  FileId,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import { db } from "./dexie";
import { BinaryFiles, DataURL } from "@excalidraw/excalidraw/types";
import { uploadDrawingFiles } from "../actions/drawing";
import { syncChange } from "../utils/sync";
import { StoredFiles } from "../types";

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
      return drawing?.elements ?? [];
    } catch (error) {
      console.error("Failed to load elements:", error);
      return [];
    }
  }
  async saveElements(
    elements: Readonly<OrderedExcalidrawElement[]>,
  ): Promise<void> {
    try {
      console.log(`attempting to save this element`, this.id);
      const drawing = await this.getDrawingById();
      if (drawing) {
        await db.drawings.update(this.id, {
          id: this.id,
          updatedAt: new Date(),
          elements: elements as OrderedExcalidrawElement[],
        });
      } else {
        const id = await db.drawings.put({
          id: this.id,
          updatedAt: new Date(),
          elements: elements as OrderedExcalidrawElement[],
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
    await db.drawings.update(this.id, { name, updatedAt: new Date() });
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
      const filesToStore: StoredFiles = {};
      for (const id of currentIds) {
        const fileData = files[id];
        const blob = this.dataURLToBlob(fileData.dataURL); // Using existing helper
        filesToStore[id] = {
          blob,
          mimeType: fileData.mimeType,
          created: fileData.created,
        };
      }
      await db.files.put({ key: this.id, files: filesToStore });

      if (this.id && newIds.length > 0) {
        // const found = await db.files.where("");
        const toUpload = this.getFilesByIds(files, newIds);
        if (toUpload.length > 0) {
          const uploadedFiles = await uploadDrawingFiles(this.id, toUpload);

          if (uploadedFiles && uploadedFiles.length > 0) {
            syncChange("save_file", {
              id: this.id,
              files: uploadedFiles,
            });
          }
        }
      }
    } catch (e) {
      console.warn("FilesStore IndexedDB save failed", e);
      throw e;
    }
  }

  async getFiles(): Promise<BinaryFiles | null> {
    try {
      const rec = await db.files.get(this.id);
      const storedFiles = rec?.files as StoredFiles | undefined;
      if (!storedFiles) {
        return null;
      }

      const binaryFiles: BinaryFiles = {};
      const fileIds = Object.keys(storedFiles);

      const readBlobAsDataURL = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(blob);
        });
      };

      await Promise.all(
        fileIds.map(async (id) => {
          const fileData = storedFiles[id];
          if (fileData?.blob) {
            const dataURL = await readBlobAsDataURL(fileData.blob);
            binaryFiles[id as FileId] = {
              id: id as FileId,
              dataURL: dataURL as DataURL,
              mimeType: fileData.mimeType,
              created: fileData.created,
            };
          }
        }),
      );

      return binaryFiles;
    } catch (e) {
      console.warn("FilesStore IndexedDB get failed", e);
      return null;
    }
  }
  private dataURLToBlob(dataURL: string): Blob {
    const [header, base64] = dataURL.split(",");
    const mimeMatch = /data:(.*?);base64/.exec(header);
    const mime = mimeMatch?.[1] || "application/octet-stream";
    const buffer = Buffer.from(base64, "base64");
    return new Blob([buffer], { type: mime });
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
