import AddTaskForm from '@/components/home/add-task-form';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function page({ params }: { params: Promise<{ cid: string }> }) {
  const { cid } = await params;
  if(!cid) return  notFound()
  return (
    <AddTaskForm categoryId={cid}/>
  )
}
