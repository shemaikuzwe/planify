import { Search, Home, Plus, Settings, FileText,  MessageSquare } from "lucide-react"
import Link from "next/link"
import User from "./dashboard/user"

export function Sidebar() {
  
  return (
    <aside className="w-60 border-r border-neutral-800 flex flex-col h-full">
      <div className="p-3 border-b border-neutral-800">
        Planify
      </div>

      <div className="p-2 space-y-1">
        {/* <button className="flex items-center gap-2 px-3 py-1.5 w-full rounded-md hover:bg-neutral-800 text-sm text-neutral-300">
          <Search className="h-4 w-4" />
          Search
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 w-full rounded-md hover:bg-neutral-800 text-sm text-neutral-300">
          <MessageSquare className="h-4 w-4" />
          Notion AI
        </button> */}
      </div>

      <div className="p-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-neutral-800 text-sm text-neutral-300"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
      </div>

      <div className="p-2 flex-1">
        <div className="text-xs font-medium text-neutral-500 px-3 py-1">Private</div>
        <div className="mt-1 space-y-0.5">
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-800 text-sm text-white">
            <FileText className="h-4 w-4" />
            Weekly To-do List
          </Link>
          <Link
            href="/project-planner"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-neutral-800 text-sm text-neutral-300"
          >
            <FileText className="h-4 w-4" />
            Project Planner
          </Link>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 mt-1 w-full rounded-md hover:bg-neutral-800 text-sm text-neutral-300">
          <Plus className="h-4 w-4" />
          Add new
        </button>
      </div>

      <div className="p-2 space-y-1 border-t border-neutral-800">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-neutral-800 text-sm text-neutral-300"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        {/* <Link
          href="/templates"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-neutral-800 text-sm text-neutral-300"
        >
          <FileText className="h-4 w-4" />
          Templates
        </Link>
        <Link
          href="/trash"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-neutral-800 text-sm text-neutral-300"
        >
          <Trash className="h-4 w-4" />
          Trash
        </Link> */}
      </div>

      <div className="p-2 border-t border-neutral-800">
        <User />
      </div>
    </aside>
  )
}

