import { auth } from "@/auth";
import db from "../drizzle";
import { meeting } from "../drizzle/schema";
import { desc, eq } from "drizzle-orm";

export async function getRecentMeetings() {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }
    const userId = session.user.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const meetings = await db.query.meeting.findMany({
        where: eq(meeting.userId, userId),
        orderBy: desc(meeting.startTime),
        limit: 10,
    });
    return meetings;
}