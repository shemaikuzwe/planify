import { Sidebar } from "@/components/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";


export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen gap-2 w-full">
            <Sidebar />
            <main className="flex h-screen w-full">
                <SidebarTrigger className="h-5 w-5" />
                {children}
            </main>
        </div>
    )
}
