"use server"

import {auth} from "@/auth";
import {db} from "../prisma";
import {MeetData} from "../types/schema";
import {StreamClient} from "@stream-io/node-sdk";
import {cleanMeetingLink} from "../utils/meet";
import {revalidatePath} from "next/cache";

async function createMeeting(data: MeetData, id: string) {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }
    const userId = session.user.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const meet = await db.meeting.create({
        data: {
            name: data.name,
            description: data.description,
            startTime: data.date ? new Date(data.date) : new Date(),
            userId,
            meetingId: id,
        }
    })
    if (!meet?.id) {
        throw new Error("Failed to create meeting");
    }
    revalidatePath("/meet")
    return {
        error: null,
    }
}

async function joinMeeting(meetingLink: string) {
    const meetingId = await cleanMeetingLink(meetingLink)
    if (!meetingId) {
        throw new Error("Invalid meeting link")
    }
    const meet = await db.meeting.findFirst({
        where: { meetingId },
    })
    if (!meet) {
        throw new Error("Meeting not found")
    }
    return {
        meetingId: meet.meetingId,
    }
}

async function endMeeting(meetingId: string) {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }
    const userId = session.user.id;
    const meet = await db.meeting.findFirst({
        where: { meetingId },
    })
    if (!meet) {
        // for room meetings
        return;
    }
    await db.meeting.update({
        where: { id: meet.id },
        data: { status: "ENDED" },
    })
}
async function generateToken() {
    const session = await auth();
    const user = session?.user;
    const apiSecret = process.env.STREAM_API_SECRET;
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    if (!user || !user.id || !user.name) throw new Error("User not found");
    if (!apiKey || !apiSecret) throw new Error("Invalid api key or secret");
    const client = new StreamClient(apiKey, apiSecret);
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
    const issued = Math.floor(Date.now() / 1000) - 60;
    // const token = client.createToken(user.id, exp, issued)
    await client.upsertUsers([
        {
            id: user.id,
            image: user.image as string | undefined,
            name: user.name,
        },
    ]);
    const token = client.generateUserToken({
        user_id: user.id,
        validity_in_seconds: exp,
        iat: issued,
    });
    return token;
}

export {
    createMeeting,
    joinMeeting,
    endMeeting,
    generateToken
}