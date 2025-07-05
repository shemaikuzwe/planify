"use client";

import MeetingRoom from "@/components/meet/meeting-room";
import MeetingSetup from "@/components/meet/meeting-setup";
import { MeetingSetupSkeleton } from "@/components/ui/skelton/meeting-setup-skelton";
import { useCall } from "@/hooks/use-call";
import {
  StreamCall,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
export default function Meeting() {
  const [isSetup, setIsSetUp] = useState(false);
  const id = useParams().id as string | undefined;
  if (!id) {
    return notFound()
  }
  const { loading, call } = useCall(id);
  if (loading) return <MeetingSetupSkeleton />;
  return (
      <StreamCall call={call}>
        <StreamTheme>
          {isSetup ? (
            <MeetingRoom />
          ) : (
            <MeetingSetup setIsSetUp={setIsSetUp} call={call} />
          )}
        </StreamTheme>
      </StreamCall>
  );
}``