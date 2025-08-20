import { Navbar } from "@/components/ui/navbar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getUserSubtasks } from "@/lib/data/task";
import { getRecentChats } from "@/lib/data/chat";


export default function layout({ children }: { children: React.ReactNode }) {
    const taskPromise = getUserSubtasks();
    const chatPromise = getRecentChats();
    return (
        <div className="flex h-screen gap-2 w-full">
            <Navbar taskPromise={taskPromise} chatPromise={chatPromise} />
            <main className="flex h-screen w-full p-2 md:p-4">
                <SidebarTrigger className="h-5 w-5" />
                {children}
            </main>
        </div>
    )
}
