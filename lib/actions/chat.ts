"use server"

import { auth } from "@/auth";
import { db } from "../prisma";
import { revalidateTag } from "next/cache";

async function pinChat(id: string, pinned: boolean) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    await db.chat.update({
        where: {
            id,
            userId,
        },
        data: {
            pinned,
        }
    })
    revalidateTag("chats")
}

async function deleteChat(id: string) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    await db.chat.delete({
        where: {
            id,
            userId,
        }
    })
    revalidateTag("chats")
}

async function renameChat(id: string, title: string) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    await db.chat.update({
        where: {
            id,
            userId,
        },
        data: {
            title,
        }
    })
    revalidateTag("chats")
}

export { pinChat, deleteChat, renameChat }
