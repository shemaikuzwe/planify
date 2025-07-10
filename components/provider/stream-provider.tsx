"use client"

import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { generateToken } from "@/lib/actions/meet";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export const StreamVideoProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    const session = useSession()
    const user = session.data?.user
    useEffect(() => {
        if (!user || !user.id) return;
        if (!apiKey) throw new Error("stream api key missing");
        const client = new StreamVideoClient({
            apiKey,
            user: {
                id: user?.id,
                name: user?.name || user?.id,
                image: user?.image ?? undefined,
            },
            tokenProvider: generateToken,
        });
        setVideoClient(client);
    }, [user]);

    if (!videoClient) return null;
    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};