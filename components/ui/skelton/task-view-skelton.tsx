import { Skeleton } from "@/components/ui/skeleton"

export function TaskViewSkeleton() {
  return (
    <div className="rounded-md w-full">
      <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md w-full">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </div>

      <div className="p-3 space-y-4">
        <div className="flex justify-between w-full">
          <div className="flex items-start gap-2">
            <Skeleton className="h-4 w-4 mt-0.5" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-30 w-full" />
        </div>
      </div>
    </div>
  )
}
