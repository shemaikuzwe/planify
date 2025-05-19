import { Priority, TaskStatus } from "@/lib/types"
import { ThumbsUp } from "lucide-react"

export const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
        case "HIGH":
            return <ThumbsUp className="h-4 w-4 text-red-400" />
        case "MEDIUM":
            return <ThumbsUp className="h-4 w-4 text-yellow-400" />
        case "LOW":
            return <ThumbsUp className="h-4 w-4 text-blue-400" />
        default:
            return null
    }
}
export const getTaskStatusVariants = (status: TaskStatus) => {
    switch (status) {
        case "COMPLETED":
            return "bg-green-800 text-green-200"
        case "IN_PROGRESS":
            return "bg-blue-800 text-blue-200"
        case "NOT_STARTED":
            return "bg-background "
        case "FAILED":
            return "bg-red-800 text-red-200"
        default:
            return "bg-neutral-800 text-neutral-300"
    }
}
