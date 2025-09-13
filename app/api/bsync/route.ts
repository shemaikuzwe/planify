import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Syncing", body);

        return NextResponse.json({ message: "Synced successfully" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
    }
}