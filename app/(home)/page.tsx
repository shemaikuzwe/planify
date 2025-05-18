import DailyTodo from '@/components/home/daily-todo'
import { GetUserTodos } from '@/lib/data'
import { CalendarCheck } from 'lucide-react'
import { Suspense } from 'react';
import { auth } from '../../auth';
import Header from '@/components/home/header';
import { LoadingCardSkeleton } from '@/components/skelton/card';


export default async function page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found");
  const todos = await GetUserTodos(userId);
  return (
    <div className='flex flex-col w-full h-full'>
      <Header title="Daily To-do" icon={<CalendarCheck className="h-5 w-5 " />} />
      <Suspense fallback={<LoadingCardSkeleton />}>
        <DailyTodo todos={todos} />
      </Suspense>
    </div>
  )

}