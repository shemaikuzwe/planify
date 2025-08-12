

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type Drawing = {
    lastUpdated: Date | null
    elements: string | null
}
export type Recording = {
    title: string
    start_time: string
    url: string
}
export type UserTeam = Team & {
    members: User[]
    createdBy: User
}

export interface TaskStatusTask extends TaskStatus {
    tasks: Task[]
}
