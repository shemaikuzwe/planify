"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { List, Share, Star, MessageSquare } from "lucide-react"
import Header from "./home/header"

interface Todo {
  id: string
  text: string
  completed: boolean
}

interface DayTodos {
  [key: string]: Todo[]
}

export function WeeklyTodoList() {
  const [todos, setTodos] = useState<DayTodos>({
    Mon: [
      { id: "mon-1", text: "Call Mom", completed: false },
      { id: "mon-2", text: "Book appt", completed: false },
      { id: "mon-3", text: "To-do", completed: false },
    ],
    Tues: [
      { id: "tues-1", text: "To-do", completed: false },
      { id: "tues-2", text: "To-do", completed: false },
      { id: "tues-3", text: "To-do", completed: false },
    ],
    Wed: [
      { id: "wed-1", text: "To-do", completed: false },
      { id: "wed-2", text: "To-do", completed: false },
      { id: "wed-3", text: "To-do", completed: false },
    ],
    Thur: [
      { id: "thur-1", text: "To-do", completed: false },
      { id: "thur-2", text: "To-do", completed: false },
      { id: "thur-3", text: "To-do", completed: false },
    ],
    Fri: [
      { id: "fri-1", text: "To-do", completed: false },
      { id: "fri-2", text: "To-do", completed: false },
      { id: "fri-3", text: "To-do", completed: false },
    ],
    Sat: [
      { id: "sat-1", text: "To-do", completed: false },
      { id: "sat-2", text: "To-do", completed: false },
    ],
    Sun: [
      { id: "sun-1", text: "To-do", completed: false },
      { id: "sun-2", text: "To-do", completed: false },
      { id: "sun-3", text: "To-do", completed: false },
    ],
  })

  const toggleTodo = (day: string, id: string) => {
    setTodos((prev) => {
      const updatedTodos = { ...prev }
      updatedTodos[day] = updatedTodos[day].map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      )
      return updatedTodos
    })
  }

  const addTodo = (day: string) => {
    setTodos((prev) => {
      const updatedTodos = { ...prev }
      updatedTodos[day] = [...updatedTodos[day], { id: `${day}-${Date.now()}`, text: "To-do", completed: false }]
      return updatedTodos
    })
  }

  const updateTodoText = (day: string, id: string, text: string) => {
    setTodos((prev) => {
      const updatedTodos = { ...prev }
      updatedTodos[day] = updatedTodos[day].map((todo) => (todo.id === id ? { ...todo, text } : todo))
      return updatedTodos
    })
  }

  const createNewWeek = () => {
    const emptyTodos: DayTodos = {
      Mon: [{ id: "mon-new-1", text: "To-do", completed: false }],
      Tues: [{ id: "tues-new-1", text: "To-do", completed: false }],
      Wed: [{ id: "wed-new-1", text: "To-do", completed: false }],
      Thur: [{ id: "thur-new-1", text: "To-do", completed: false }],
      Fri: [{ id: "fri-new-1", text: "To-do", completed: false }],
      Sat: [{ id: "sat-new-1", text: "To-do", completed: false }],
      Sun: [{ id: "sun-new-1", text: "To-do", completed: false }],
    }
    setTodos(emptyTodos)
  }

  return (
    <div className="min-h-screen w-full">
      <Header title="Weekly To-do" icon={<List className="h-5 w-5 " />} />

      {/* <div className="p-8 max-w-5xl mx-auto">

        <Button variant="default" className="mb-8" onClick={createNewWeek}>
          <List className="h-4 w-4 mr-2" />
          New
        </Button>

        <h2 className="text-2xl font-semibold mb-6 border-b border-neutral-800 pb-2">March 4 - March 9</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {Object.entries(todos).map(([day, dayTodos]) => (
            <div key={day} className="space-y-2">
              <h3 className="font-medium text-neutral-300 bg-neutral-800 p-2">{day}</h3>
              <div className="space-y-1">
                {dayTodos.map((todo) => (
                  <div key={todo.id} className="flex items-start gap-2 group">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(day, todo.id)}
                      className="mt-1"
                    />
                    <input
                      type="text"
                      value={todo.text}
                      onChange={(e) => updateTodoText(day, todo.id, e.target.value)}
                      className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm flex-1 py-0.5"
                    />
                  </div>
                ))}
                <button onClick={() => addTodo(day)} className="text-neutral-500 hover:text-neutral-300 text-sm pl-6">
                  + Add task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}

