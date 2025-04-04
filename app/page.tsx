import { Sidebar } from "@/components/sidebar"
import { WeeklyTodoList } from "@/components/weekly-todo-list"

export default function Home() {
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <WeeklyTodoList />
      </main>
    </div>
  )
}

