"use client";

import MeetingRoom from "@/components/meet/meeting-room";
import MeetingSetup from "@/components/meet/meeting-setup";
import { MeetingSetupSkeleton } from "@/components/ui/skelton/meeting-setup-skelton";
import { useCall } from "@/hooks/use-call";
import {
  Call,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
export default function Meeting() {
  const searchParams = useSearchParams()
  const [isSetup, setIsSetUp] = useState(false);
  const client = useStreamVideoClient()
  const id = useParams().id as string | undefined;
  if (!id) {
    return notFound()
  }
  let roomCall: Call | undefined
  const { loading, call } = useCall(id);
  roomCall = call
  const room = searchParams.get("room")
  if (room && !roomCall) {
    startRoom(id)
  }
  async function startRoom(id: string) {
    const newCall = client?.call("default", id)
    await newCall?.getOrCreate({
      data: {
        starts_at: new Date().toISOString(),
      }
    })
    roomCall = newCall
  }

  if (loading) return <MeetingSetupSkeleton />;
  return (
    <StreamCall call={roomCall}>
      <StreamTheme>
        {isSetup ? (
          <MeetingRoom />
        ) : (
          <MeetingSetup setIsSetUp={setIsSetUp} call={call} />
        )}
      </StreamTheme>
    </StreamCall>
  );
} ``