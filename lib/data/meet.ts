import { auth } from "@/auth";
import db from "../drizzle";
import { meeting } from "../drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { StreamClient } from "@stream-io/node-sdk";

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

export async function generateToken() {
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
