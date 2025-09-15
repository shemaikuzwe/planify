import { db } from './dexie'
import { TaskStatus, Task, TaskCategory } from '@prisma/client'
import { db as prismaDb } from '@/lib/prisma'


interface HydrationData {
    taskStatus: TaskStatus[]
    tasks: Task[]
    categories: TaskCategory[]
}

interface SyncResult {
    newTaskStatuses: number
    newTasks: number
    newCategories: number
    updatedTaskStatuses: number
    updatedTasks: number
    updatedCategories: number
}

export class HydrationManager {
    private userId: string;
    constructor(userId: string) {
        this.userId = userId;
    }
    async hydrateDb(): Promise<SyncResult> {
        try {
            console.log('🔄 Starting database hydration from cloud...')

            const cloudData = await this.fetchCloudData()
            console.log(`☁️ Fetched ${cloudData.categories.length} categories, ${cloudData.taskStatus.length} statuses, ${cloudData.tasks.length} tasks from cloud`)

            const localData = await this.getLocalData()
            console.log(`💾 Local DB has ${localData.categories.length} categories, ${localData.taskStatus.length} statuses, ${localData.tasks.length} tasks`)

            const syncResult = await this.syncData(cloudData, localData)

            console.log(`📊 Sync result: ${JSON.stringify(syncResult, null, 2)}`)

            return syncResult

        } catch (error) {
            throw error
        }
    }

    private async fetchCloudData(): Promise<HydrationData> {

        const categories = await prismaDb.taskCategory.findMany({
            where: { userId: this.userId },
            include: {
                taskStatus: {
                    include: {
                        tasks: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Flatten task statuses and tasks
        const taskStatus: TaskStatus[] = []
        const tasks: Task[] = []

        categories.forEach(category => {
            category.taskStatus.forEach(status => {
                taskStatus.push(status)
                tasks.push(...status.tasks)
            })
        })

        return {
            categories,
            taskStatus,
            tasks
        }
    }

    /**
     * Get all local data from Dexie
     */
    private async getLocalData(): Promise<HydrationData> {
        try {
            const [taskStatus, tasks] = await Promise.all([
                db.taskStatus.toArray(),
                db.tasks.toArray()
            ])

            // Get unique category IDs from task statuses
            const categoryIds = [...new Set(taskStatus.map(ts => (ts as any).categoryId))]

            const categories: TaskCategory[] = categoryIds.map(id => ({
                id,
                name: `Category ${id.slice(-4)}`,
                userId: '',
                createdAt: new Date(),
                updatedAt: new Date()
            }))

            return {
                categories,
                taskStatus: taskStatus as any,
                tasks: tasks as any
            }
        } catch (error) {
            console.warn('Error getting local data, assuming empty:', error)
            return {
                categories: [],
                taskStatus: [],
                tasks: []
            }
        }
    }

    private async syncData(cloudData: HydrationData, localData: HydrationData): Promise<SyncResult> {
        const result: SyncResult = {
            newTaskStatuses: 0,
            newTasks: 0,
            newCategories: 0,
            updatedTaskStatuses: 0,
            updatedTasks: 0,
            updatedCategories: 0
        }

        const localTaskStatusMap = new Map(localData.taskStatus.map(ts => [ts.id, ts]))
        const localTasksMap = new Map(localData.tasks.map(t => [t.id, t]))
        const localCategoriesMap = new Map(localData.categories.map(c => [c.id, c]))
        for (const category of cloudData.categories) {
            const localCategory = localCategoriesMap.get(category.id)

            if (!localCategory) {

                await this.addCategoryToLocal(category)
                result.newCategories++
            } else if (this.isNewer(category.updatedAt, localCategory.updatedAt)) {
                await this.updateCategoryInLocal(category)
                result.updatedCategories++
            }
        }

        for (const taskStatus of cloudData.taskStatus) {
            const localTaskStatus = localTaskStatusMap.get(taskStatus.id)

            if (!localTaskStatus) {
                await this.addTaskStatusToLocal(taskStatus)
                result.newTaskStatuses++
            } else if (this.isNewer(taskStatus.updatedAt, localTaskStatus.updatedAt)) {
                await this.updateTaskStatusInLocal(taskStatus)
                result.updatedTaskStatuses++
            }
        }

        // Sync tasks
        for (const task of cloudData.tasks) {
            const localTask = localTasksMap.get(task.id)

            if (!localTask) {
                // New task - add to local
                await this.addTask(task)
                result.newTasks++
            } else if (this.isNewer(task.updatedAt, localTask.updatedAt)) {
                // Updated task - update local
                await this.updateTask(task)
                result.updatedTasks++
            }
        }

        return result
    }

    /**
     * Helper methods for adding/updating local data
     */
    private async addCategoryToLocal(category: TaskCategory): Promise<void> {
        // Categories are not stored in Dexie currently, but we could add them if needed
        console.log(`➕ Added new category: ${category.name}`)
    }

    private async updateCategoryInLocal(category: TaskCategory): Promise<void> {
        console.log(`🔄 Updated category: ${category.name}`)
    }

    private async addTaskStatusToLocal(taskStatus: TaskStatus): Promise<void> {
        const taskStatusWithTasks = {
            ...taskStatus,
            tasks: [] // Add empty tasks array to match Dexie schema
        }
        await db.taskStatus.put(taskStatusWithTasks as any)
        console.log(`➕ Added new task status: ${taskStatus.name}`)
    }

    private async updateTaskStatusInLocal(taskStatus: TaskStatus): Promise<void> {
        const taskStatusWithTasks = {
            ...taskStatus,
            tasks: [] // Add empty tasks array to match Dexie schema
        }
        await db.taskStatus.put(taskStatusWithTasks as any)
        console.log(`🔄 Updated task status: ${taskStatus.name}`)
    }

    private async addTask(task: Task): Promise<void> {
        await db.tasks.put(task as any)
        console.log(`➕ Added new task: ${task.text}`)
    }

    private async updateTask(task: Task): Promise<void> {
        await db.tasks.put(task as any)
        console.log(`🔄 Updated task: ${task.text}`)
    }
    private isNewer(cloudUpdatedAt: Date | null, localUpdatedAt: Date | null): boolean {
        if (!cloudUpdatedAt) return false
        if (!localUpdatedAt) return true

        return new Date(cloudUpdatedAt) > new Date(localUpdatedAt)
    }
}

export type { HydrationData, SyncResult }

