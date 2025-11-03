import { Navbar } from "@/components/ui/navbar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useOnline } from "@/hooks/use-online";
import { syncManager } from "@/lib/store/syncManager";
import { useEffect } from "react";
import { Outlet } from "react-router";

export default function AppLayout() {
  const { isOnline } = useOnline();
  useEffect(() => {
    syncManager.sync();
  }, [syncManager]);

  // useEffect(() => {
  //   if (isOnline) {
  //     toast.info("You are online");
  //   }
  //   if (!isOnline) {
  //     toast.error("You are offline");
  //   }
  // }, [isOnline]);

  return (
    <div className="flex h-screen gap-2 w-full">
      <Navbar />
      <main className="flex h-screen w-full p-2 md:p-4">
        <SidebarTrigger className="h-5 w-5" />
        <Outlet />
      </main>
    </div>
  );
}
