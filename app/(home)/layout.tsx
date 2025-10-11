"use client";
import { Navbar } from "@/components/ui/navbar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { syncManager } from "@/lib/store/syncManager";
import { useEffect } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    syncManager.sync();
  }, [syncManager]);

  return (
    <div className="flex h-screen gap-2 w-full">
      <Navbar />
      <main className="flex h-screen w-full p-2 md:p-4">
        <SidebarTrigger className="h-5 w-5" />
        {children}
      </main>
    </div>
  );
}
