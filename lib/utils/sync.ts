import { db } from "../store/dexie";
import { SyncType } from "../types/schema";

async function syncChange<T>(type: SyncType, data: T) {
  try {
    const lastSync = new Date();
    await db.metadata.put({ key: "lastSync", lastSyncedAt: lastSync });
    await fetch("/api/bsync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        data,
        metadata: { lastSyncedAt: lastSync },
      }),
    });
  } catch (err) {
    // TODO: send toast notification
    console.log("Queued by SW:", data);
  }
}

export { syncChange };
