"use client"
import { Settings, ListTodo, Presentation, StickyNote, MessageCircle, Plus } from "lucide-react"
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
import { usePathname, useRouter } from "next/navigation"
import Logo from "./logo"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible"
import { Suspense, use, useState } from "react"
import { TaskCategory } from "@prisma/client"
import AddPage from "../task/add-page"
import PageOptions from "../task/page-options"
import ChatOptions from "../chat/options"
import InlineInput from "./inline-input"
import { renameChat } from "@/lib/actions/chat"
import { editGroupName } from "@/lib/actions/task"
import { ScrollArea } from "./scroll-area"
interface Props {
  taskPromise: Promise<TaskCategory[]>
  chatPromise: Promise<{ id: string, title: string, pinned: boolean }[]>
  pinnedChatPromise: Promise<{ id: string, title: string, pinned: boolean }[]>
}
export function Navbar({ taskPromise, chatPromise, pinnedChatPromise }: Props) {
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
          <SidebarGroupLabel className="text-xs font-medium text-neutral-500">Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="ml-2">
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger className="flex items-center justify-center gap-5">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Chats</span>
                    </div>
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
                      <Suspense fallback={<NavBarSkelton number={3} />}>
                        <NavChat chatPromise={pinnedChatPromise} text="Pinned Chats" />
                      </Suspense>
                      <Suspense fallback={<NavBarSkelton number={3} />}>
                        <NavChat chatPromise={chatPromise} text="Recent Chats" />
                      </Suspense>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
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
  const router = useRouter()
  const handleMouseEnter = (taskId: string) => {
    setHoveredTaskId(taskId)
  }

  const handleMouseLeave = () => {
    setHoveredTaskId(null)
  }
  return tasks.map((task) => (
    <SidebarMenuSubItem key={task.id}>
      <SidebarMenuSubButton asChild>
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

function NavChat({ text, chatPromise }: { text: string; chatPromise: Promise<{ id: string; title: string, pinned: boolean }[]> }) {
  const chats = use(chatPromise)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const router = useRouter()

  const handleMouseEnter = (id: string) => {
    setHoveredId(id)
  }

  const handleMouseLeave = () => {
    setHoveredId(null)
  }

  return chats.length == 0 ? null : (
    <>
      <SidebarGroupLabel className="text-xs font-medium">{text}</SidebarGroupLabel>
      {/* <ScrollArea className="max-h-30 pr-2 w-full"> */}
        {chats.map((chat) => (

          <SidebarMenuSubItem key={chat.id}>
            <SidebarMenuSubButton asChild>
              <Link href={`/chat/${chat.id}`}
                className="flex items-center gap-2 w-full relative group"
                onMouseEnter={() => handleMouseEnter(chat.id)}
                onMouseLeave={() => handleMouseLeave()}>
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                <InlineInput value={chat.title} onChange={async (val) => {
                  await renameChat(chat.id, val)
                  router.refresh()
                }} options={{ slice: 20 }} className="flex-1 truncate" />
                {(hoveredId === chat.id) && (
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

        ))}
      {/* </ScrollArea> */}

    </>
  )
}