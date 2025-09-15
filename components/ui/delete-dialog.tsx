import React, { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogDescription, DialogTitle, DialogClose } from '../ui/dialog'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { taskStore } from '@/lib/store/tasks-store'
import { DialogFooter } from '../ui/dialog'
interface Props {
    id: string;
    type: "group" | "task" | "drawing",
    text: string,   
    children?: React.ReactNode
    onDelete?: () => void
}
export default function DeleteDialog({ id, type, text, children, onDelete }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const handleDelete = () => {
        startTransition(async () => {
            if (type === "group") {
                await taskStore.deleteStatus(id)
            } else if (type === "task") {
                await taskStore.deleteTask(id)
            } 
            // else if (type === "drawing") {
            //     await deleteDrawing(id)
            // }
            onDelete?.()
            setIsOpen(false)
           
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild >
                {children ? children : (
                    <Button size={"sm"} variant={`${type === "group" ? "ghost" : "destructive"}`} className='w-7 h-7' >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className=' flex flex-col gap-2 w-full'>
                <DialogHeader>
                    <DialogTitle>Delete Confirmation</DialogTitle>
                    <DialogDescription className='font-light'>Are you sure you want to delete  <span className='font-bold'>{text}</span>?</DialogDescription>
                </DialogHeader>

                <DialogFooter className='flex gap-2'>
                    <DialogClose>
                        Cancel
                    </DialogClose>
                    <Button disabled={isPending} variant={"destructive"} onClick={handleDelete}>{isPending ? "Deleting..." : "Delete"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
