import React from 'react'
import { ThemeProvider } from './theme-provider'
import { SessionProvider } from 'next-auth/react'
import { SidebarProvider } from '../ui/sidebar'

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
                    {children}
                </SessionProvider>
            </SidebarProvider>

        </ThemeProvider>
    )
}
