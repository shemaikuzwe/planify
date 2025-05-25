export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED"
export type Drawing = {
    lastUpdated: Date | null
    elements: string | null
}