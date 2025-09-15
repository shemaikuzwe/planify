"use client"
import { Settings, ListTodo, StickyNote } from "lucide-react"
import Link from "next/link"
import User from "@/components/profile/user"
import { useLiveQuery } from "dexie-react-hooks";
import {
  Sidebar,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import Logo from "./logo"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible"
import AddPage from "../task/add-page"
import InlineInput from "./inline-input"
import { db } from "@/lib/store/dexie";
import { useState } from "react";
import { editGroupName } from "@/lib/actions/task";
import PageOptions from "../task/page-options";
export function Navbar() {
  const pathName = usePathname()
  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <div className="flex items-center gap-2 py-2">
            <Logo className="bg-black dark:bg-white" textClassName="text-black dark:text-white" />
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-xs font-medium text-neutral-500">Private</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="ml-2">
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger className="flex items-center justify-center gap-5">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4" />
                      <span>Tasks</span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <NavTask />
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <AddPage />
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={"Excalidraw"} isActive={pathName.includes("/excalidraw")}>
                  <Link href={"/whiteboard"} className="flex gap-2 items-center w-full">
                    <Image src="/excalidraw.png" alt="Excalidraw" width={16} height={16} />
                    <span>White Board</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Project Planner" isActive={pathName.includes("/project-planner")}>
                  <Link href="/project-planner" className="flex items-center gap-2 ">
                    <ListTodo className="h-4 w-4" />
                    <span>Project Planner</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="border-t">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link href="/settings?tab=settings" className="flex items-center gap-2 ">
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
    </Sidebar>
  )
}
// function NavBarSkelton({ number = 5 }: { number?: number }) {
//   return (
//     <SidebarMenu>
//       {Array.from({ length: number }).map((_, index) => (
//         <SidebarMenuItem key={index}>
//           <SidebarMenuSkeleton showIcon />
//         </SidebarMenuItem>
//       ))}
//     </SidebarMenu>
//   )
// }
function NavTask() {
  const tasks = useLiveQuery(async () => await db.pages.toArray())
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null)
  const router = useRouter()
  const handleMouseEnter = (taskId: string) => {
    setHoveredTaskId(taskId)
  }

  const handleMouseLeave = () => {
    setHoveredTaskId(null)
  }
  return tasks && tasks.length > 0 && tasks.map((task) => (
    <SidebarMenuSubItem key={task.id}>
      <SidebarMenuSubButton
        href={`/${task.id}`}
        className="flex items-center justify-between gap-2 w-full relative group"
        onMouseEnter={() => handleMouseEnter(task.id)}
        onMouseLeave={() => handleMouseLeave()}
        asChild
      >
        <div
          className="flex items-center justify-between gap-2 w-full"
          onMouseEnter={() => handleMouseEnter(task.id)}
          onMouseLeave={() => handleMouseLeave()}
        >
          <Link href={`/${task.id}`} className="flex items-center gap-2 w-full relative group">
            <StickyNote className="h-4 w-4" />
            <InlineInput value={task.name} onChange={async (val) => {
              await editGroupName(task.id, val)
              router.refresh()
            }} options={{ slice: 20 }} className="flex-1 truncate" />
          </Link>
          {(hoveredTaskId === task.id) && (
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 backdrop-blur-sm pl-2"
              onClick={(e) => e.preventDefault()}
            >
              <PageOptions
                page={task}
              />
            </div>
          )}
        </div>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  ))
}
