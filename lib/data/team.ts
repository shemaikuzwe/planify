import "server-only"
import {auth} from "@/auth";
import {db} from "@/lib/prisma";

export async function getUserTeams() {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const teams = await db.team.findMany({
        where: {
            OR: [
                {createdById: userId},
                {members: {some: {id: userId}}},
            ],
        },
        include: {
            members: true,
            createdBy: true,
        }
    });

    return teams;
}