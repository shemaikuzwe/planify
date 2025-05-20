"use client"
import { Home, Settings, LayoutDashboard, List, ListTodo, CalendarCheck } from "lucide-react"
import Link from "next/link"
import User from "./home/user"
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
import Image from "next/image"
import { usePathname } from "next/navigation"
import Logo from "./logo"

export function Sidebar() {
  const pathName=usePathname()

  return (
    <ShadcnSidebar className="border-r" collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <div className="flex items-center gap-2 py-2">
             <Logo className="bg-black dark:bg-white" textClassName="text-black dark:text-white"/>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link href="/" className="flex items-center gap-2 ">
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
                <SidebarMenuButton asChild tooltip={"Daily Todo"} isActive={pathName==="/"}>
                  <Link href={"/"} className="flex gap-2 items-center w-full">
                    <CalendarCheck className="h-4 w-4" />
                    <span>Daily Todo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={"Excalidraw"} isActive={pathName.includes("/excalidraw")}>
                  <Link href={"/excalidraw"} className="flex gap-2 items-center w-full">
                    <Image src="/excalidraw.png" alt="Excalidraw" width={16} height={16} />
                    <span>Excalidraw</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild  tooltip="Weekly To-do List" isActive={pathName.includes("/weeklytodo")}>
                  <Link href="/weeklytodo" className="flex items-center gap-2 ">
                    <List className="h-4 w-4" />
                    <span>Weekly Todo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Project Planner" isActive={pathName.includes("/project-planner")}>
                  <Link href="/project-planner" className="flex items-center gap-2 ">
                    <ListTodo className="h-4 w-4" />
                    <span>Project Planner</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* <SidebarMenuItem>
                
                <SidebarMenuButton asChild tooltip="Add new">
                  <button className="flex items-center gap-2 w-full">
                    <Plus className="h-4 w-4" />
                    <span>Add new</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="border-t">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link href="/settings" className="flex items-center gap-2 ">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <div >
            <User />
          </div>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  )
}
