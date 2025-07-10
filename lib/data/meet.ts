import { auth } from "@/auth";
import db from "../drizzle";
import { meeting, team} from "../drizzle/schema";
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

export async function getUserTeams() {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const teams = await db.query.team.findMany({
        where: eq(team.createdBy, userId),
        with: {
            teamMembers: {
                with: {
                    user: {
                        columns: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        }
                    }
                }
            },
            creator: {
                columns: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            }
        }
    });

    return teams;
}

export type UserTeam = Awaited<ReturnType<typeof getUserTeams>>[number];