import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function MeetingCardSkeleton() {
  return (
    <Card className="w-full max-w-xs mx-auto rounded-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-5 w-12 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full h-9 bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
}
export function MeetingCardSkeletons() {
  return (
    <div className="p-4 mx-auto flex justify-center items-center">
      <MeetingCardSkeleton />
      <MeetingCardSkeleton />
      <MeetingCardSkeleton />
    </div>
  );
}

export function MeetingSetupSkeleton() {
  return (
    <div className="min-h-screen bg-background w-full flex flex-col items-center justify-center p-4">
      {/* Title Skeleton */}
      <div className="w-48 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-8" />

      {/* Video Preview Area Skeleton */}
      <Card className="w-full max-w-2xl aspect-video mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </Card>

      {/* Controls Skeleton */}
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          {/* Checkbox Skeleton */}
          <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          {/* Label Skeleton */}
          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          {/* Settings Icon Skeleton */}
          <div className="ml-auto h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>

        {/* Join Button Skeleton */}
        <div className="flex justify-center">
          <div className="w-32 h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}