import EditTaskForm from '@/components/task/edit-task-form';
import { getTaskById } from '@/lib/data';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function page({ params }: { params: Promise<{ tid: string }> }) {
    const { tid } = await params;
    if (!tid) notFound()
    const taskPromise = getTaskById(tid)

    return (
        <EditTaskForm taskPromise={taskPromise} />
    )
}
