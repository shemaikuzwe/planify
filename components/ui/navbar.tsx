"use client";
import { Settings, ListTodo, StickyNote, PresentationIcon } from "lucide-react";
import Link from "next/link";
import User from "@/components/profile/user";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible";
import AddPage from "../task/add-page";
import InlineInput from "./inline-input";
import { db } from "@/lib/store/dexie";
import { useState } from "react";
import PageOptions from "../task/page-options";
import { syncChange } from "@/lib/utils/sync";

export function Navbar() {
  const pathName = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <div className="flex items-center gap-2 py-2">
            <Logo
              className="bg-black dark:bg-white"
              textClassName="text-black dark:text-white"
            />
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-xs font-medium text-neutral-500">
            Private
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={"Excalidraw"}
                  isActive={pathName === "/app"}
                >
                  <Link
                    href={"/app"}
                    className="flex gap-2 items-center w-full"
                  >
                    <PresentationIcon />
                    <span>Whiteboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="ml-2">
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger className="flex items-center justify-center gap-5">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5" />
                      {!isCollapsed && <span>Tasks</span>}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <NavTask type="task" />
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <AddPage />
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              <SidebarMenuItem className="ml-2">
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger className="flex items-center justify-center gap-5">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5" />
                      {!isCollapsed && <span>Projects</span>}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <NavTask type="project" />
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <AddPage type="PROJECT" />
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="border-t">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link
                    href="/app/settings?tab=settings"
                    className="flex items-center gap-2 "
                  >
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
          <div>
            <User />
          </div>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
function NavTask({ type }: { type: "task" | "project" }) {
  const pathName = usePathname();
  const tasks = useLiveQuery(
    async () =>
      await db.pages.where("type").equals(type.toUpperCase()).toArray(),
  );
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const handleMouseEnter = (taskId: string) => {
    setHoveredTaskId(taskId);
  };

  const handleMouseLeave = () => {
    setHoveredTaskId(null);
  };
  return (
    tasks &&
    tasks.length > 0 &&
    tasks.map((task) => (
      <SidebarMenuSubItem key={task.id}>
        <SidebarMenuSubButton
          isActive={pathName.includes(task.id)}
          href={`/app/${type}/${task.id}`}
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
            <Link
              href={`/app/${type}/${task.id}`}
              className="flex items-center gap-2 w-full relative group"
            >
              <StickyNote className="h-4 w-4" />
              <InlineInput
                value={task.name}
                onChange={async (val) => {
                  await db.pages.update(task.id, { name: val });
                  syncChange("editPageName", { id: task.id, name: val });
                }}
                options={{ slice: 20 }}
                className="flex-1 truncate"
              />
            </Link>
            {hoveredTaskId === task.id && (
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 backdrop-blur-sm pl-2"
                onClick={(e) => e.preventDefault()}
              >
                <PageOptions page={task} />
              </div>
            )}
          </div>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    ))
  );
}
