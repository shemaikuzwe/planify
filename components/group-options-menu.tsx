"use client"

import { useState } from "react"
import { MoreVertical, Grid3X3, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { colors } from "@/lib/constants"
import { db } from "@/lib/store/dexie"

interface Props {
  groupId: string
  groupColor?: string
}

export function GroupOptionsMenu({
  groupId,
  groupColor = "default",
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const deleteGroup = () => {
    db.taskStatus.delete(groupId)
  }
  const editGroup = () => {

  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Group options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={editGroup}>
          <Grid3X3 className="mr-2 h-4 w-4" />
          Edit groups
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteGroup} className="text-red-400 hover:text-red-300">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Group
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuLabel>Colors</DropdownMenuLabel>

        {colors.map((color, index) => (
          <DropdownMenuItem
            key={index}
            onClick={async () => db.taskStatus.update(groupId, { primaryColor: color.value })}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded mr-2 ${color.value}`} />
              {color.name}
            </div>
            {groupColor === color.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

