import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../skeleton";

interface Props {
    className?: string
}
export function ButtonSkeleton({ className }: Props) {
    return (
        <Skeleton className={cn("h-8", className)} />
    )
}