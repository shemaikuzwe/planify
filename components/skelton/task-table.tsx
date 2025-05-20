import { Skeleton } from "@/components/ui/skeleton"

export default function DailyTaskSkeleton() {

  const loadingCategories = Array(2).fill(null)
  const loadingTasks = Array(2).fill(null)

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="min-w-170 rounded-md border bg-background">
          {/* Table Header */}
          <div className="grid grid-cols-12 border-b text-sm">
            <div className="col-span-1 p-3 font-medium">Status</div>
            <div className="col-span-4 p-3 font-medium">Project</div>
            <div className="col-span-2 p-3 font-medium">Time</div>
            <div className="col-span-2 p-3 font-medium">Due Date</div>
            <div className="col-span-1 p-3 font-medium text-center">Actions</div>
          </div>

          {/* Loading Categories */}
          {loadingCategories.map((_, categoryIndex) => (
            <div key={`category-${categoryIndex}`} className="border-b last:border-0">
              {/* Category Header */}
              <div className="grid grid-cols-12 items-center bg-muted/30 px-3 py-2">
                <div className="col-span-6 flex items-center">
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="col-span-6 flex items-center justify-end gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>

              {/* Loading Tasks */}
              {loadingTasks.map((_, taskIndex) => (
                <div key={`task-${categoryIndex}-${taskIndex}`} className="grid grid-cols-12 items-center border-t">
                  <div className="col-span-1 p-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                  <div className="col-span-4 p-3">
                    <Skeleton className="h-5 w-full max-w-[180px]" />
                  </div>
                  <div className="col-span-2 p-3">
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="col-span-2 p-3">
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="col-span-1 p-3 flex justify-center">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}

              {/* Empty category for the last one */}
              {categoryIndex === loadingCategories.length - 1 && (
                <div className="py-3 px-6">
                  <Skeleton className="h-5 w-40" />
                </div>
              )}
            </div>
          ))}

          {/* Add Group Button */}
          <div className="p-3 border-t">
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
