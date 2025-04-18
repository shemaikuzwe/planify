import React from 'react';
import { Button } from '@/components/ui/button'
import {  ListTodo, MessageSquare, Share, Star } from 'lucide-react'

export default function page() {
  return (
    <div className='flex flex-col w-full h-full'>
    <header className="flex items-center justify-between p-4 border-b">
       <div className="flex items-center gap-2">
           <ListTodo className="h-5 w-5 " />
           <h1 className="text-sm font-medium">Project Planner</h1>
       </div>
       <div className="flex items-center gap-2">
           <span className="text-xs text-neutral-400 px-2 py-1 border border-neutral-700 rounded">Private</span>
           <Button variant="ghost" size="sm" >
               <Share className="h-4 w-4 mr-1" />
               Share
           </Button>
           <Button variant="ghost" size="sm" >
               <MessageSquare className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="sm" >
               <Star className="h-4 w-4" />
           </Button>
       </div>
   </header>
  
</div>
  )
}
