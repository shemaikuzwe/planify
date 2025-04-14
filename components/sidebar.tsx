"use client"

import { Home, Plus, Settings, FileText, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import User from "./dashboard/user"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

export function Sidebar() {
  return (
    <ShadcnSidebar className="border-r border-neutral-800" collapsible="icon">
      <SidebarHeader className="border-b border-neutral-800">
        <div className="flex items-center gap-2 px-3 py-2 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="font-semibold text-lg sr-only">Planify</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link href="/" className="flex items-center gap-2 text-neutral-300">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-xs font-medium text-neutral-500">Private</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive tooltip="Weekly To-do List">
                  <Link href="/" className="flex items-center gap-2 text-white">
                    <FileText className="h-4 w-4" />
                    <span>Weekly To-do List</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Project Planner">
                  <Link href="/project-planner" className="flex items-center gap-2 text-neutral-300">
                    <FileText className="h-4 w-4" />
                    <span>Project Planner</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href={"/excalidraw"}className="flex gap-2 items-center w-full text-neutral-300"> 
                 <FileText className="h-4 w-4" />
                 <span>Excalidraw</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Add new">
                  <button className="flex items-center gap-2 w-full text-neutral-300">
                    <Plus className="h-4 w-4" />
                    <span>Add new</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="border-t border-neutral-800">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link href="/settings" className="flex items-center gap-2 text-neutral-300">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800">
        <div className="p-2">
          <User />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  )
}
