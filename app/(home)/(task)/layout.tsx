
import Task from '@/components/task/task'
import { getUserTasks } from '@/lib/data/task'
import { CalendarCheck } from 'lucide-react'
import { Suspense } from 'react';
import { auth } from '@/auth';
import Header from '@/components/ui/header';
import DailyTaskSkeleton from '@/components/ui/skelton/task-table';
export default async function layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");
    const todosPromise = getUserTasks(userId);
    return (
        <div className='flex flex-col w-full h-full'>
            <Header title="Daily To-do" icon={<CalendarCheck className="h-5 w-5 " />} />
            <div className='flex w-full h-full max-md:flex-col justify-between gap-2 mt-2 px-3'>
                <Suspense fallback={<DailyTaskSkeleton />}>
                    <Task todosPromise={todosPromise} />
                </Suspense>
                {children}
            </div>
        </div>
    )
}
