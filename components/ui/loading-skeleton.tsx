import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-gray-200 dark:bg-gray-700 rounded", className)} />
  )
}

export function MessageSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <LoadingSkeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
        <LoadingSkeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function ChatroomSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <LoadingSkeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}