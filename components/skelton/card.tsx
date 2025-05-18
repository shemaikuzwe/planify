import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare, MoreVertical, ChevronRight } from "lucide-react"

export function LoadingCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto p-4">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="w-full md:w-1/2 border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
          <MessageSquare className="h-4 w-4 text-primary" />
        </div>
        <div className="h-8 w-8 rounded flex items-center justify-center">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-6" />
      </div>

      <div className="flex justify-between items-center mt-4">
        <div></div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  )
}
