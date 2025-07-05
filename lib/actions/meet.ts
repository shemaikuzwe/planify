"use server"

import { auth } from "@/auth";
import db from "../drizzle";
import { meeting } from "../drizzle/schema";
import { MeetData } from "../types/schema";
import { StreamClient } from "@stream-io/node-sdk";
import { cleanMeetingLink } from "../utils/meet";
import { eq } from "drizzle-orm";

async function createMeeting(data: MeetData, id: string) {
        const session = await auth();
        if (!session) {
            throw new Error("Unauthorized");
        }
        const userId = session.user.id;
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const [meet] = await db.insert(meeting).values({
            name: data.name,
            description: data.description,
            startTime: data.date ? new Date(data.date) : new Date(),
            userId,
            meetingId: id,
        }).returning({
            id: meeting.id,
        })
        if (!meet?.id) {
            throw new Error("Failed to create meeting");
        }
        return {
            error: null,
        }
}

async function joinMeeting(meetingLink: string) {
    const meetingId = await cleanMeetingLink(meetingLink)
    if (!meetingId) {
        throw new Error("Invalid meeting link")
    }
    const meet = await db.query.meeting.findFirst({
        where: eq(meeting.meetingId, meetingId),
    })
    if (!meet) {
        throw new Error("Meeting not found")
    }
    return {
     meetingId: meet.meetingId,
    }
}


export {
    createMeeting,
    joinMeeting,
}