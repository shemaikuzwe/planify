"use client"

import { useState } from "react"
import { MoreVertical, Grid3X3, Eye, EyeOff, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface GroupOptionsMenuProps {
  groupId: string
  groupColor?: string
  onColorChange: (groupId: string, color: string) => void
  onDeleteGroup: (groupId: string) => void
  onEditGroup: (groupId: string) => void
}

const colorOptions = [
  {
    name: "Default",
    value: "default",
    bgClass: "bg-neutral-800/50",
    headerClass: "bg-neutral-800",
    taskBgClass: "bg-neutral-700",
    taskTextClass: "text-white",
    taskButtonBgClass: "bg-neutral-700",
    taskButtonHoverClass: "hover:bg-neutral-600",
  },
  {
    name: "Gray",
    value: "gray",
    bgClass: "bg-gray-800/50",
    headerClass: "bg-gray-800",
    taskBgClass: "bg-gray-700",
    taskTextClass: "text-white",
    taskButtonBgClass: "bg-gray-700",
    taskButtonHoverClass: "hover:bg-gray-600",
  },
  {
    name: "Brown",
    value: "brown",
    bgClass: "bg-amber-900/30",
    headerClass: "bg-amber-900/50",
    taskBgClass: "bg-amber-800/50",
    taskTextClass: "text-amber-100",
    taskButtonBgClass: "bg-amber-800/50",
    taskButtonHoverClass: "hover:bg-amber-700/50",
  },
  {
    name: "Orange",
    value: "orange",
    bgClass: "bg-orange-900/30",
    headerClass: "bg-orange-900/50",
    taskBgClass: "bg-orange-800/50",
    taskTextClass: "text-orange-100",
    taskButtonBgClass: "bg-orange-800/50",
    taskButtonHoverClass: "hover:bg-orange-700/50",
  },
  {
    name: "Yellow",
    value: "yellow",
    bgClass: "bg-yellow-900/30",
    headerClass: "bg-yellow-900/50",
    taskBgClass: "bg-yellow-800/50",
    taskTextClass: "text-yellow-100",
    taskButtonBgClass: "bg-yellow-800/50",
    taskButtonHoverClass: "hover:bg-yellow-700/50",
  },
  {
    name: "Green",
    value: "green",
    bgClass: "bg-green-900/30",
    headerClass: "bg-green-900/50",
    taskBgClass: "bg-green-800/50",
    taskTextClass: "text-green-100",
    taskButtonBgClass: "bg-green-800/50",
    taskButtonHoverClass: "hover:bg-green-700/50",
  },
  {
    name: "Blue",
    value: "blue",
    bgClass: "bg-blue-900/30",
    headerClass: "bg-blue-900/50",
    taskBgClass: "bg-blue-800/50",
    taskTextClass: "text-blue-100",
    taskButtonBgClass: "bg-blue-800/50",
    taskButtonHoverClass: "hover:bg-blue-700/50",
  },
  {
    name: "Purple",
    value: "purple",
    bgClass: "bg-purple-900/30",
    headerClass: "bg-purple-900/50",
    taskBgClass: "bg-purple-800/50",
    taskTextClass: "text-purple-100",
    taskButtonBgClass: "bg-purple-800/50",
    taskButtonHoverClass: "hover:bg-purple-700/50",
  },
  {
    name: "Pink",
    value: "pink",
    bgClass: "bg-pink-900/30",
    headerClass: "bg-pink-900/50",
    taskBgClass: "bg-pink-800/50",
    taskTextClass: "text-pink-100",
    taskButtonBgClass: "bg-pink-800/50",
    taskButtonHoverClass: "hover:bg-pink-700/50",
  },
  {
    name: "Red",
    value: "red",
    bgClass: "bg-red-900/30",
    headerClass: "bg-red-900/50",
    taskBgClass: "bg-red-800/50",
    taskTextClass: "text-red-100",
    taskButtonBgClass: "bg-red-800/50",
    taskButtonHoverClass: "hover:bg-red-700/50",
  },
]

export function GroupOptionsMenu({
  groupId,
  groupColor = "default",
  onColorChange,
  onDeleteGroup,
  onEditGroup,
}: GroupOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Group options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEditGroup(groupId)}>
          <Grid3X3 className="mr-2 h-4 w-4" />
          Edit groups
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDeleteGroup(groupId)} className="text-red-400 hover:text-red-300">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete pages
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Colors</DropdownMenuLabel>

        {colorOptions.map((color) => (
          <DropdownMenuItem
            key={color.value}
            onClick={() => onColorChange(groupId, color.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${color.headerClass}`} />
              {color.name}
            </div>
            {groupColor === color.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { colorOptions }
