"use client"
import { Home, Settings, ListTodo, CalendarCheck, Presentation, StickyNote, ChevronDown } from "lucide-react"
import Link from "next/link"
import User from "@/components/profile/user"
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
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Logo from "./logo"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible"
import { Suspense, use } from "react"
import { TaskCategory } from "@prisma/client"
interface Props {
  taskPromise: Promise<TaskCategory[]>
}
export function Navbar({ taskPromise }: Props) {
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
              <SidebarMenuItem className="ml-2">
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger className="flex items-center justify-center gap-2">
                    <ListTodo className="h-4 w-4" />
                    <span>Tasks</span>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <Suspense fallback={<NavBarSkelton />}>
                        <NavTask taskPromise={taskPromise} />
                      </Suspense>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Meet" isActive={pathName.includes("/meet")}>
                  <Link href="/meet" className="flex items-center gap-2 ">
                    <Presentation className="h-4 w-4" />
                    <span>Meet</span>
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
function NavBarSkelton() {
  return (
    <SidebarMenu>
      {Array.from({ length: 4 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
function NavTask({ taskPromise }: { taskPromise: Promise<Category[]> }) {
  const tasks = use(taskPromise)
  return tasks.map((task) => (
    <SidebarMenuSubItem key={task.id}>
      <SidebarMenuSubButton asChild>
        <Link href={`/`} className="flex items-center gap-2 ">
          <StickyNote className="h-4 w-4" />
          <span>{task.name}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  ))
}
