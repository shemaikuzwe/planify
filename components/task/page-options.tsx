"use client"

import React, { useState, useTransition } from 'react'
import { EllipsisVertical, Trash2, Edit } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import DeleteDialog from '../ui/delete-dialog'
import { TaskCategory } from '@prisma/client'
import EditPage from './edit-page'

interface PageOptionsProps {
    page: TaskCategory,
    onOpenChange?: (isOpen: boolean) => void
}

export default function PageOptions({ page, onOpenChange }: PageOptionsProps) {

    return (
        <>
            <DropdownMenu onOpenChange={onOpenChange}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <EllipsisVertical className="h-4 w-4" />
                        <span className="sr-only">Open page options</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuItem asChild>
                        <EditPage page={page}>
                            <Button size={"sm"} variant={"ghost"} >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit Page
                            </Button>
                        </EditPage>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <DeleteDialog id={page.id} type="group" text={page.name} >
                            <div className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete page</span>
                            </div>
                        </DeleteDialog>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


        </>
    )
}
