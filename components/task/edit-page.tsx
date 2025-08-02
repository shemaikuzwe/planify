import React, { useState, useTransition } from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogTrigger
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import EmojiPicker from '../ui/emoji-picker'
import { toast } from 'sonner'
import { TaskCategory } from '@prisma/client'
import { editGroupName } from '@/lib/actions/task'
interface EditPageProps {
    page: TaskCategory,
    children?: React.ReactNode
}

export default function EditPage({ page, children }: EditPageProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [name, setName] = useState(page.name)

    const handleUpdate = async () => {
        if (!name.trim()) {
            toast.error("Name is required")
            return
        }

        try {
            startTransition(async () => {
                await editGroupName(page.id, name)
                setIsEditOpen(false)
            })
        } catch (error) {
            console.log(error)
            toast.error("Failed to update page")
        }
    }

    const handleEmojiSelect = (newEmoji: string) => {
        setName(prev => prev + newEmoji)
    }
    return (
        <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>   
            <AlertDialogContent>
                <AlertDialogTitle>Edit Page</AlertDialogTitle>
                <div className="space-y-3 w-full">
                    <div className='space-y-3 flex gap-4 w-full'>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter name"
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Add Emoji</label>
                            <div className="flex items-center h-10">
                                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-2'>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <Button onClick={handleUpdate} disabled={isPending}>
                            {isPending ? "Editing..." : "Edit"}
                        </Button>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
