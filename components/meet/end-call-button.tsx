import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function EndCallButton() {
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const router=useRouter()
  const localParticipant = useLocalParticipant();
  const isMeetingOwner=localParticipant && call?.state.createdBy && localParticipant.userId === call.state.createdBy.id
 
    if(!isMeetingOwner) return null;
    const handleClick=async()=>{
      await call.endCall();
      router.push("/meet")
     }
  return (
    <Button onClick={handleClick} className=" bg-red-500">End call for everyone</Button>
  );
}