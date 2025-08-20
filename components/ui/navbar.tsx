"use client"
import { Settings, ListTodo, Presentation, StickyNote, ChevronDown, MessageCircle } from "lucide-react"
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
import { Suspense, use, useState } from "react"
import { TaskCategory } from "@prisma/client"
import { Plus } from "lucide-react"
import AddPage from "../task/add-page"
import PageOptions from "../task/page-options"
import ChatOptions from "../chat/options"
interface Props {
  taskPromise: Promise<TaskCategory[]>
  chatPromise: Promise<{ id: string, title: string, pinned: boolean }[]>
}
export function Navbar({ taskPromise, chatPromise }: Props) {
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
                <SidebarMenuItem className="ml-2">
                  <Collapsible defaultOpen className="group/collapsible">
                    <CollapsibleTrigger className="flex items-center justify-center gap-5">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>Chats</span>
                      </div>
                      {/* <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" /> */}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href="/" className="flex items-center gap-2 w-full text-left ">
                              <div className="border-2 border-foreground/80 rounded-md p-0.5">
                                <Plus className="h-3 w-3" />
                              </div>
                              <span>New Chat</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarGroupLabel className="text-xs font-medium text-neutral-500">Recent Chats</SidebarGroupLabel>
                        <Suspense fallback={<NavBarSkelton number={3} />}>
                          <NavChat chatPromise={chatPromise} />
                        </Suspense>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
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
                  <CollapsibleTrigger className="flex items-center justify-center gap-5">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4" />
                      <span>Tasks</span>
                    </div>
                    {/* <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" /> */}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <Suspense fallback={<NavBarSkelton />}>
                        <NavTask taskPromise={taskPromise} />
                      </Suspense>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Meet" isActive={pathName.includes("/meet")}>
                  <Link href="/meet" className="flex items-center gap-2 ">
                    <Presentation className="h-4 w-4" />
                    <span>Meet</span>
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
function NavBarSkelton({ number = 5 }: { number?: number }) {
  return (
    <SidebarMenu>
      {Array.from({ length: number }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
function NavTask({ taskPromise }: { taskPromise: Promise<TaskCategory[]> }) {
  const tasks = use(taskPromise)
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const handleMouseEnter = (taskId: string) => {
    setHoveredTaskId(taskId)
  }

  const handleMouseLeave = (taskId: string) => {
    if (openDropdownId !== taskId) {
      setHoveredTaskId(null)
    }
  }

  const handleDropdownOpenChange = (taskId: string, isOpen: boolean) => {
    setOpenDropdownId(isOpen ? taskId : null)
    if (!isOpen) {
      setHoveredTaskId(null)
    }
  }

  return tasks.map((task) => (
    <SidebarMenuSubItem key={task.id}>
      <SidebarMenuSubButton asChild>
        <div
          className="flex items-center justify-between gap-2 w-full"
          onMouseEnter={() => handleMouseEnter(task.id)}
          onMouseLeave={() => handleMouseLeave(task.id)}
        >
          <Link href={`/${task.id}`} className="flex items-center gap-2 flex-1">
            <StickyNote className="h-4 w-4" />
            <span>{task.name}</span>
          </Link>
          {(hoveredTaskId === task.id || openDropdownId === task.id) && (
            <div onClick={(e) => e.preventDefault()}>
              <PageOptions
                page={task}
                onOpenChange={(isOpen) => handleDropdownOpenChange(task.id, isOpen)}
              />
            </div>
          )}
        </div>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  ))
}

function NavChat({ chatPromise }: { chatPromise: Promise<{ id: string; title: string, pinned: boolean }[]> }) {
  const chats = use(chatPromise)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const handleMouseEnter = (taskId: string) => {
    setHoveredId(taskId)
  }

  const handleMouseLeave = (taskId: string) => {
    if (openDropdownId !== taskId) {
      setHoveredId(null)
    }
  }

  return chats.map((chat) => {
    const isHovered = hoveredId === chat.id
    return (
      <SidebarMenuSubItem key={chat.id}>
        <SidebarMenuSubButton asChild>
          <Link href={`/chat/${chat.id}`}
            className="flex items-center gap-2 w-full relative group"
            onMouseEnter={() => handleMouseEnter(chat.id)}
            onMouseLeave={() => handleMouseLeave(chat.id)}>
            <MessageCircle className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 truncate">{chat.title}</span>
            {(isHovered) && (
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 backdrop-blur-sm pl-2"
                onClick={(e) => e.preventDefault()}
              >
                <ChatOptions
                  chat={chat}
                />
              </div>
            )}
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  })
}