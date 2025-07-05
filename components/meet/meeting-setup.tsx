import {
  Call,
  DeviceSettings,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MicIcon, MicOffIcon, VideoOffIcon, VideoIcon } from "lucide-react";
interface Props {
  setIsSetUp: React.Dispatch<React.SetStateAction<boolean>>;
  call: Call | undefined;
}

export default function MeetingSetup({ setIsSetUp, call }: Props) {
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCamEnabled, setIsCamEnabled] = useState(true);
  if (!call) {
    throw new Error("call not found");
  }
  useEffect(() => {
    if (call) {
      if (isCamEnabled) {
        call.camera.enable();
      }
      else {
        call.camera.disable();
      }
      if (isMicEnabled) {
        call.microphone.enable();
      } else {
        call.microphone.disable();
      }
    }
  }, [isCamEnabled, isMicEnabled, call]);
  const handleClick = () => {
    call?.join();
    setIsSetUp(true);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3 w-full">
      <h1 className="text-2xl font-bold">Meeting setup</h1>
     
        <VideoPreview />
    
      <div className="flex h-16  items-center justify-center gap-3">
        <Button size={"icon"} variant={`${isMicEnabled ? "outline" : "destructive"}`} onClick={() => setIsMicEnabled(!isMicEnabled)}>
          {isMicEnabled ? <MicIcon /> : <MicOffIcon />}
        </Button> 
        <Button size={"icon"} variant={`${isCamEnabled ? "outline" : "destructive"}`} onClick={() => setIsCamEnabled(!isCamEnabled)}> 
          {isCamEnabled ? <VideoIcon /> : <VideoOffIcon />}
        </Button>
        <DeviceSettings />
      </div>
      <Button className=" rounded-md  px-4 py-2.5" onClick={handleClick}>
        Join Meeting
      </Button>
    </div>
  );
}