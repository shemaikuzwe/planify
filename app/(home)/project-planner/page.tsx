import React from 'react';
import {  ListTodo } from 'lucide-react'
import Header from '@/components/ui/header';

export default function page() {
  return (
    <div className='flex flex-col w-full h-full'>
    <Header title="Project Planner" icon={<ListTodo className="h-5 w-5 " />} />
  
</div>
  )
}
