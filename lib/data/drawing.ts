import "server-only"
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUserDrawings(userId?: string | undefined) {
    if (!userId) {
        const session = await auth()
        if (!session) {
            throw new Error("Unauthorized");
        }
        userId = session.user.id
    }
    const userDrawings = await db.drawing.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        }
    });
    return userDrawings;
}

export async function getDrawingById(id: string) {
    const drawing = await db.drawing.findFirst({
        where: { id },
    });
    return drawing;
}