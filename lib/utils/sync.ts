import { SyncType } from "../types/schema";

async function syncChange<T>(type: SyncType, data: T) {
  try {
    await fetch("/api/bsync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    });
  } catch (err) {
    // TODO: send toast notification
    console.log("Queued by SW:", data);
  }
}

export { syncChange };
