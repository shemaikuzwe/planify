import "server-only"
import { db } from "@/lib/prisma";
import { unstable_cacheTag as cacheTag } from "next/cache"
export async function getUserDrawings(userId: string) {
    "use cache"
    cacheTag("drawings")
    const userDrawings = await db.drawing.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        }
    });
    return userDrawings;
}

export async function getDrawingById(id: string) {
    "use cache"
    cacheTag("drawings",id)
    const drawing = await db.drawing.findFirst({
        where: { id },
    });
    return drawing;
}