import { auth } from "@/auth";
import { db } from "../prisma";

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

export async function getUserTeams() {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const teams = await db.team.findMany({
        where: {
            OR: [
                { createdById: userId },
                { members: { some: { id: userId } } },
            ],
        },
        include: {
            members: true,
            createdBy: true,
        }
    });

    return teams;
}
