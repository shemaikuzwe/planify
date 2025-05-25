import { TaskView } from '@/components/task/task-view';
import { TaskViewSkeleton } from '@/components/ui/skelton/task-view-skelton';
import { getTaskById } from '@/lib/data';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

export default async function page({ params }: { params: Promise<{ tid: string }> }) {
    const { tid } = await params;
    if (!tid) return notFound()
    const task = getTaskById(tid)
    return (
        <Suspense fallback={<TaskViewSkeleton />}>
            <TaskView
                taskPromise={task}
            />

        </Suspense>
    )
}
