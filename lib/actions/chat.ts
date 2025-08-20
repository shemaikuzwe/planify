"use server"

import { auth } from "@/auth";
import { db } from "../prisma";

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
}

export { pinChat, deleteChat }
