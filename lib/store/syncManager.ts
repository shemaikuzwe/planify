import { db } from "./dexie";

class SyncManager {
  private apiUrl: string;
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }
  async initialSync() {
    try {
      const res = await fetch(`${this.apiUrl}/initial-sync`);
      const { tables } = await res.json();
      // Use transaction to ensure atomicity
      await db.transaction("rw", db.tables, async () => {
        // Clear existing data (if any)
        for (const table of db.tables) {
          await table.clear();
        }

        // Insert data for each table
        for (const [tableName, data] of Object.entries(tables)) {
          const table = db.table(tableName);
          if (table && Array.isArray(data)) {
            await table.bulkAdd(data);

            // // Update sync metadata
            // await db.syncMetadata.put({
            //   id: tableName,
            //   tableName,
            //   lastSyncTimestamp: timestamp,
            // });
          }
        }
      });
    } catch (err) {
      console.error("Error during initial sync:", err);
    }
  }
  async isLocalDbEmpty(): Promise<boolean> {
    const tables = db.tables.filter((t) => t.name !== "syncMetadata");

    for (const table of tables) {
      const count = await table.count();
      if (count > 0) return false;
    }

    return true;
  }
}
