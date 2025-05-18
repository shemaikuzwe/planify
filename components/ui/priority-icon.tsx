import { Priority } from "@/lib/types"
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