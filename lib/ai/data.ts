import "server-only"
import { auth } from "@/auth";
import { db } from '@/lib/prisma';
import { convertToModelMessages, generateObject, UIMessage } from "ai";
import z from "zod";
import { groq } from "@ai-sdk/groq";

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
export async function saveChatData(id: string, messages: UIMessage[]) {
  try {
    const session = auth();
    const existing = await getChatById(id);
    const title = existing ? existing.title : await getChatTitle(messages);
    const userId = existing ? existing.userId : (await session)?.user?.id;
    if (!userId) return null;
    const chat = await db.chat.upsert({
      where: { id },
      update: {
        messages: messages as any,
      },
      create: {
        id: id,
        userId: userId,
        title: title,
        messages: messages as any,
      },
    });
    return chat;
  } catch (e) {
    return null;
  }
}
async function getChatTitle(messages: UIMessage[]) {
  const modelMessages = convertToModelMessages(messages);
  const title = await generateObject({
    model: groq("openai/gpt-oss-20b"),
    system: `you are a chat title generator assistant  based The main context in chat messages about programming concepts.
    if you are given achat message generate a small title for it`,
    messages: modelMessages,
    schema: z.object({
      title: z.string().describe("chat title"),
    }),
  });

  return title.object.title;
}

export { getUserPages, getUserTasks };