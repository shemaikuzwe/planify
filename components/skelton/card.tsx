import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "../ui/card"

export function LoadingCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <CardSkeleton key={index} />
        ))}
    </div>
  )
}

function CardSkeleton() {
  return (
    <Card className="shadow-none cursor-pointer border rounded-lg w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-xl">
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
          <Skeleton className="w-6 h-6" />
        </div>
        <div className="mt-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <div className="flex items-center justify-between mt-3 pt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
