import { auth } from "@/auth";
import { db } from "../prisma";

async function getRecentChats() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const chats = await db.chat.findMany({
        where: {
            userId,
            pinned: false,
        },
        select: {
            id: true,
            title: true,
            pinned: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
        take: 5,
    });
    return chats;
}
async function getPinnedChats() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const chats = await db.chat.findMany({
        where: {
            userId,
            pinned: true,
        },
        select: {
            id: true,
            title: true,
            pinned: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
        take: 5,
    });
    return chats;
}
async function getChats() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const chats = await db.chat.findMany({
        where: {
            userId,
        },
        select: {
            id: true,
            title: true,
            pinned: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
    return chats;
}
export { getRecentChats, getPinnedChats, getChats };
