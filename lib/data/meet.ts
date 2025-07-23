import "server-only"
import {auth} from "@/auth";
import {db} from "../prisma";

export async function getRecentMeetings() {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }
    const userId = session.user.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const meetings = await db.meeting.findMany({
        where: { userId },
        orderBy: { startTime: "desc" },
    });
    return meetings;
}

