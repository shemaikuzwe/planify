import "server-only"
import { auth } from "@/auth";
import { db } from '@/lib/prisma';

async function getUserPages(pageName?: string) {
    const session = await auth()
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    if (pageName) {
        const page = await db.taskCategory.findFirst({
            where: {
                user: { id: userId }, name: {
                    contains: pageName
                },          
            },
            include: {
                taskStatus: {
                  include:{
                    tasks:true
                  }
                }
            },
        });
        return page;
    }
    const pages = await db.taskCategory.findMany({
        where: { user: { id: userId } },
        include: {
            taskStatus: {
                include: {
                    tasks: true
                }
            }
        },
    });
    return pages;
}

async function getUserTasks(pageName?: string) {
    const session = await auth()
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const todos = await db.taskCategory.findMany({
      where: { userId, name: pageName },
      include: {
        taskStatus: {
          include: {
            tasks: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });
  return todos.flatMap(cat =>
    cat.taskStatus.flatMap(status =>
      status.tasks.map(task => ({
        ...task,
        page: cat.name,
        status: status.name,
      }))
    )
  );
}

export { getUserPages, getUserTasks };