import { TaskView } from '@/components/home/task-view';
import { getTaskById } from '@/lib/data';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function page({ params }: { params: Promise<{ tid: string }> }) {
    const { tid } = await params;
    if (!tid) return notFound()
    const task = getTaskById(tid)
    return (
        <TaskView
            taskPromise={task}
        />
    )
}
