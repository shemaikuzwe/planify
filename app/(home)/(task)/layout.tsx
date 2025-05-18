
import DailyTodo from '@/components/home/daily-todo'
import { GetUserTodos } from '@/lib/data'
import { CalendarCheck } from 'lucide-react'
import { Suspense } from 'react';
import { auth } from '@/auth';
import Header from '@/components/home/header';
import { LoadingCardSkeleton } from '@/components/skelton/card';
export default async function layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");
    const todos = await GetUserTodos(userId);
    return (
        <div className='flex flex-col w-full h-full'>
            <Header title="Daily To-do" icon={<CalendarCheck className="h-5 w-5 " />} />
            <div className='flex w-full h-full justify-between mt-2 px-3'>
                <Suspense fallback={<LoadingCardSkeleton />}>
                    <DailyTodo todos={todos} />
                </Suspense>
                {children}
            </div>
        </div>
    )

}
