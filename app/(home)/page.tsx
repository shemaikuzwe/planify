import DailyTodo from '@/components/home/daily-todo'
import { Button } from '@/components/ui/button'
import { GetUserTodos } from '@/lib/data'
import { CalendarCheck, MessageSquare, Share, Star } from 'lucide-react'
import { Suspense } from 'react';


export default async function page() {
  const todos = await GetUserTodos();
  return (
    <div className='flex flex-col w-full h-full'>
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 " />
          <h1 className="text-sm font-medium">Daily To-do</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 border  rounded">Private</span>
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
      <Suspense fallback={<div>Loading...</div>}>
        <DailyTodo todos={todos} />
      </Suspense>
    </div>
  )

}