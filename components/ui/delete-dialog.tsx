import { AlertDialog } from '@radix-ui/react-alert-dialog'
import React, { useState, useTransition } from 'react'
import { AlertDialogCancel, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { deleteDrawing, deleteGroup, deleteTask } from '@/lib/actions'
import { useRouter } from 'next/navigation'
interface Props {
    id: string;
    type: "group" | "task" | "drawing",
    text: string
}
export default function DeleteDialog({ id, type, text }: Props) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const handleDelete = () => {
        startTransition(async () => {
            if (type === "group") {
                await deleteGroup(id)
            } else if (type === "task") {
                await deleteTask(id)
            } else if (type === "drawing") {
                await deleteDrawing(id)
            }
            setIsOpen(false)
            router.push("/")
        })
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen} >
            <AlertDialogTrigger asChild >
                <Button size={"sm"} variant={`${type === "group" ? "ghost" : "destructive"}`} className='w-7 h-7' >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='w-100'>
                <AlertDialogTitle className='font-light'>Are you sure you want to delete  <span className='font-bold'>{text}</span>?</AlertDialogTitle>
                <div className='flex gap-2'>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <Button disabled={isPending} variant={"destructive"} onClick={handleDelete}>{isPending ? "Deleting..." : "Delete"}</Button>
                </div>

            </AlertDialogContent>
        </AlertDialog>
    )
}
