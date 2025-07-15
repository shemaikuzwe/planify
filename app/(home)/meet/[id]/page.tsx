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
import { useEffect, useState } from "react";
import { sendTeamNotification } from "@/lib/actions/push";
export default function Meeting() {
  const searchParams = useSearchParams()
  const [isSetup, setIsSetUp] = useState(false);
  const client = useStreamVideoClient()
  const id = useParams().id as string | undefined;
  const [isLoading, setIsLoading] = useState(true)
  const [roomCall, setRoomCall] = useState<Call | undefined>()

  if (!id) {
    return notFound()
  }

  const { loading, call } = useCall(id);
  // synchronize the call returned from useCall with local state
  useEffect(() => {
    if (call) return setRoomCall(call)
    startRoom(id)
  }, [call])
  async function startRoom(id: string) {
    setIsLoading(true)
    const newCall = client?.call("default", id)
    await newCall?.getOrCreate({
      data: {
        starts_at: new Date().toISOString(),
      }
    })
    setRoomCall(newCall)
    setIsLoading(false)
  }

  return (
    (loading || isLoading) ? (
      <MeetingSetupSkeleton />
    ) : (
      <StreamCall call={roomCall}>
        <StreamTheme>
          {isSetup ? (
            <MeetingRoom />
          ) : (
            <MeetingSetup setIsSetUp={setIsSetUp} call={roomCall} />
          )}
        </StreamTheme>
      </StreamCall>
    )
  );
}