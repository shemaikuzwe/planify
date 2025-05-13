import React from 'react';
import { Button } from '@/components/ui/button'
import {  ListTodo, MessageSquare, Share, Star } from 'lucide-react'
import Header from '@/components/home/header';

export default function page() {
  return (
    <div className='flex flex-col w-full h-full'>
    <Header title="Project Planner" icon={<ListTodo className="h-5 w-5 " />} />
  
</div>
  )
}
