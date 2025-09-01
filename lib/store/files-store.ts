import { BinaryFiles } from "@excalidraw/excalidraw/types";

class IDBHelper {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private readonly dbName = "planify-files-db";
  private readonly storeName = "files";

  private open(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: "key" });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (e) {
        reject(e);
      }
    });
    return this.dbPromise;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const db = await this.open();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      const req = store.put({ key, value });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const db = await this.open();
    return await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const req = store.get(key);
      req.onsuccess = () => {
        resolve(req.result ? (req.result.value as T) : null);
      };
      req.onerror = () => reject(req.error);
    });
  }
}

class FilesStore {
  private storageKey: string;
  private idb: IDBHelper | null = null;

  constructor(drawingId?: string) {
    this.storageKey = drawingId ? `files-${drawingId}` : `files-new`;
    if (typeof indexedDB !== "undefined") {
      this.idb = new IDBHelper();
    }
  }

  async saveFile(files: BinaryFiles): Promise<void> {
    try {
      if (this.idb) {
        await this.idb.set<BinaryFiles>(this.storageKey, files);
        return;
      }
    } catch (e) {
      console.warn("FilesStore IndexedDB save failed, falling back to localStorage", e);
    }
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(files));
    } catch (e) {
      console.error("FilesStore localStorage save failed", e);
    }
  }

  async getFiles(): Promise<BinaryFiles | null> {
    try {
      if (this.idb) {
        return await this.idb.get<BinaryFiles>(this.storageKey);
      }
    } catch (e) {
      console.warn("FilesStore IndexedDB get failed, trying localStorage", e);
    }
    try {
      const item = localStorage.getItem(this.storageKey);
      if (!item) return null;
      return JSON.parse(item) as BinaryFiles;
    } catch (e) {
      console.error("FilesStore localStorage get failed", e);
      return null;
    }
  }
}

export function createFileStorage(drawingId?: string) {
  return new FilesStore(drawingId);
}