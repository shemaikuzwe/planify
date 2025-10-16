"use client";
import React, { useEffect } from "react";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          </SessionProvider>
        </QueryClientProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
