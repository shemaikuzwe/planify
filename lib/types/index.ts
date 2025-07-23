import { Team, User } from "@prisma/client"

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED"
export type Drawing = {
    lastUpdated: Date | null
    elements: string | null
}

export type Recording = {
    title: string
    start_time:string
    url:string
}

export type UserTeam = Team &{
    members:User[]
    createdBy:User  
}