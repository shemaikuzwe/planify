import "server-only"
import { auth } from "@/auth";
import { db } from '@/lib/prisma';
import { convertToModelMessages, generateObject, UIMessage } from "ai";
import z from "zod";
import { groq } from "@ai-sdk/groq";
import { revalidateTag } from "next/cache";

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
          include: {
            tasks: true
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
export const getChatById = async (id: string | undefined) => {
  if (!id) return null;
  const chat = await db.chat.findFirst({
    where: { id },
  });
  return chat;
};
async function getChatTitle(messages: UIMessage[]) {
  const modelMessages = convertToModelMessages(messages);
  const title = await generateObject({
    model: groq("openai/gpt-oss-20b"),
    system: `you are a chat title generator assistant  based The main context in chat messages about programming concepts.
    if you are given chat message generate a small title for it`,
    messages: modelMessages,
    schema: z.object({
      title: z.string().describe("chat title"),
    }),
  });

  return title.object.title;
}

export { getUserPages, getUserTasks ,getChatTitle };