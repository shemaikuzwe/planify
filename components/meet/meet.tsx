import { Presentation } from "lucide-react";
import MeetTabs from "./meet-tabs";
import Header from "../ui/header";
import { getRecentMeetings } from "@/lib/data/meet";

export default async function Meet() {
   const recentMeetings = await getRecentMeetings();
    return (
        <div className="flex flex-col h-screen gap-2 w-full">
            <Header title="Meet" icon={<Presentation className="h-6 w-6" />} />
            <MeetTabs recentMeetings={recentMeetings} />
        </div>
    )
}
