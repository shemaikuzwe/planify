import React from 'react'
import { ThemeProvider } from './theme-provider'
import { SessionProvider } from 'next-auth/react'
import { SidebarProvider } from '../ui/sidebar'
import { TooltipProvider } from '../ui/tooltip'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <SessionProvider>
                    <TooltipProvider delayDuration={0}>
                        {children}
                    </TooltipProvider>

                </SessionProvider>
            </SidebarProvider>

        </ThemeProvider>
    )
}
