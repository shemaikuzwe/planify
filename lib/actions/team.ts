"use server"
import {TeamData} from "@/lib/types/schema";
import {auth} from "@/auth";
import {db} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

async function createTeam(data: TeamData) {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }
    const userId = session.user.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const memberIds: string[] = [];
    for (const email of data.members) {
        const user = await db.user.findFirst({
            where: {email},
            select: {id: true},
        });
        // TODO: send invitation emails to the user
        if (user) {
            memberIds.push(user.id);
        }
    }

    if (!memberIds.includes(userId)) {
        memberIds.push(userId);
    }
    const newTeam = await db.team.create({
        data: {
            name: data.name,
            slogan: data.slogan,
            createdById: userId,
            members: {
                connect: memberIds.map((memberId) => ({
                    id: memberId,
                }))
            }

        }
    })
    if (!newTeam?.id) {
        throw new Error("Failed to create team.ts");
    }
    revalidatePath("/meet")
}

export {createTeam};