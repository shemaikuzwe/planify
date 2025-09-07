import { BinaryFiles } from "@excalidraw/excalidraw/types";
import { uploadDrawingFiles } from "../actions/drawing";
import { db } from "./dexie";

class FilesStore {
  private storageKey: string;
  private drawingId?: string;

  constructor(drawingId?: string) {
    this.storageKey = drawingId ? `files-${drawingId}` : `files-new`;
    if (drawingId) {
      this.drawingId = drawingId
    }
  }

  async saveFile(files: BinaryFiles): Promise<void> {
    try {
      console.log("Saving files", files);

      const prev = await db.files.get(this.storageKey);
      const prevIds = new Set(Object.keys(prev?.files ?? {}));
      const currentIds = Object.keys(files ?? {});
      const newIds = currentIds.filter((id) => !prevIds.has(id));

      if (this.drawingId && newIds.length > 0) {
        const toUpload = this.getFilesByIds(files, newIds);
        if (toUpload.length > 0) {
          uploadDrawingFiles(this.drawingId, toUpload);
        }
      }


      await db.files.put({ key: this.storageKey, files, drawingId: this.drawingId });
    } catch (e) {
      console.warn("FilesStore IndexedDB save failed", e);
    }
  }

  async getFiles() {
    try {
      const rec = await db.files.get(this.storageKey);
      console.log("FilesStore IndexedDB get", rec);
      return rec?.files ?? null;
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
  private getFileFromBinaryFiles(
    files: BinaryFiles,
    fileId: string,
    filename: string = `${fileId}.bin`
  ) {
    const record = files[fileId];
    if (!record) return null;
    return this.dataURLToFile(record.dataURL, filename);
  }
  private getAllFiles(files: BinaryFiles) {
    return Object.entries(files).map(([id, rec]) =>
      this.dataURLToFile(rec.dataURL, `${id}`)
    );
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

export function createFileStorage(drawingId?: string) {
  return new FilesStore(drawingId);
}


