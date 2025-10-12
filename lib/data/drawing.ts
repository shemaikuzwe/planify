import "server-only";
import { db } from "@/lib/prisma";
export async function getUserDrawings(userId: string) {
  const userDrawings = await db.drawing.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
  return userDrawings;
}

export async function getDrawingById(id: string) {
  const drawing = await db.drawing.findFirst({
    where: { id },
  });
  return drawing;
}
