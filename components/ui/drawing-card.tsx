"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { ChevronRight, MessageSquare, Pencil, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"

interface DrawingCardProps {
    id: string
    name: string
    description: string|null
    createdAt: Date|null
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function DrawingCard({ id, name, description, createdAt, onEdit, onDelete }: DrawingCardProps) {
    const router = useRouter()
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        onEdit(id)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDelete(id)
    }

    return (
        <Card
            className="px-3 shadow-none cursor-pointer border rounded-lg"
            onClick={() => router.push(`/excalidraw/${id}`)}
        >
            <CardContent className="p-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full">
                            <MessageSquare className="text-primary h-5 w-5" />
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical size={16} />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEdit}>
                                <Pencil size={16} className="mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                                <Trash2 size={16} className="mr-2 text-destructive" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>


                <div className="mt-3 space-y-2">
                    <p className="text-sm ">{name}</p>
                    <div className="flex flex-col items-baseline space-x-1">
                        {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    </div>
                    <div className="flex items-center justify-between text-xs w-full">
                        <span>{createdAt ? formatDate(createdAt) : ""}</span>
                        <ChevronRight size={16} className="text-muted-foreground" />
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
