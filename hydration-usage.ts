// Example usage of the HydrationManager for syncing cloud data with local DB
import { hydrationManager } from '@/lib/store/kanban-store'

// Usage in a React component or service
export async function syncWithCloud() {
  try {
    console.log('🚀 Starting cloud sync...')

    // This will:
    // 1. Fetch data from cloud database (Prisma)
    // 2. Compare with local Dexie data
    // 3. Only add new/changed items to local DB
    const syncResult = await hydrationManager.hydrateDb()

    console.log('✅ Sync completed!')
    console.log('📊 Results:', syncResult)

    return syncResult

  } catch (error) {
    console.error('❌ Sync failed:', error)
    throw error
  }
}

// Usage in a component (commented out to avoid JSX in .ts file)
/*
// In a .tsx file:
import { useEffect, useState } from 'react'
import { syncWithCloud } from '@/hydration-usage'

function SyncComponent() {
  const [syncResult, setSyncResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSync = async () => {
    setLoading(true)
    try {
      const result = await syncWithCloud()
      setSyncResult(result)
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={handleSync} disabled={loading}>
        {loading ? 'Syncing...' : 'Sync with Cloud'}
      </button>

      {syncResult && (
        <div>
          <h3>Sync Results:</h3>
          <p>New categories: {syncResult.newCategories}</p>
          <p>New task statuses: {syncResult.newTaskStatuses}</p>
          <p>New tasks: {syncResult.newTasks}</p>
          <p>Updated categories: {syncResult.updatedCategories}</p>
          <p>Updated task statuses: {syncResult.updatedTaskStatuses}</p>
          <p>Updated tasks: {syncResult.updatedTasks}</p>
        </div>
      )}
    </div>
  )
}
*/