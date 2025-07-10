import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import EndCallButton from "./end-call-button";
import { MeetingSetupSkeleton } from "../ui/skelton/meeting-setup-skelton";

type CallLayout = "Grid" | "speaker-Left" | "speaker-Right";

export default function MeetingRoom() {
  const [layout, setLayout] = useState<CallLayout>("speaker-Left");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const router = useRouter();
  const callingState = useCallCallingState();
  if (callingState !== CallingState.JOINED) {
    return <div className="min-h-screen bg-background flex flex-col w-full">
      <div className="flex-1">
        <MeetingSetupSkeleton />
      </div>
    </div>;
  }
  const CallLayout = () => {  
    switch (layout) {
      case "Grid":
        return <PaginatedGridLayout />;

      case "speaker-Right":
        return <SpeakerLayout participantsBarPosition={"left"} />;
      default:
        return <SpeakerLayout participantsBarPosition={"right"} />;
    }
  };
  return (
    <section className="min-h-screen  w-full">
      <div className="h-screen flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={`h-[calc(100vh-86px)] hidden ml-2 ${showParticipants && "show-block"}`}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 left-28 max-md:bottom-28 max-md:flex-wrap max-md:left-0 flex w-full items-center justify-center gap-4">
        <CallControls onLeave={() => router.push(`/home`)} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-foreground" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-foreground">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() => setLayout(item.toLowerCase() as CallLayout)}
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-foreground" />
          </div>
        </button>
        {<EndCallButton />}
      </div>
    </section>
  );
}