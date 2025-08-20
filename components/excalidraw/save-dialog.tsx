'use client'
import React, { useTransition } from 'react'
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger, AlertDialogContent, AlertDialogCancel } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { useFormStatus } from 'react-dom'
import { Label } from '../ui/label'
import { saveDrawing, updateDrawing } from "@/lib/actions/drawing";

interface Props {
    elements: OrderedExcalidrawElement[] | null,
    drawingId?: string
}
export default function SaveDialog({ elements, drawingId }: Props) {
    const [isPending, startTransition] = useTransition()

    const handleSaveNewDrawing = async (formData: FormData) => {
        startTransition(async () => {
            try {
                localStorage.removeItem('drawing-new')
                saveDrawing(formData)
            } catch (error) {
                console.error('Failed to save drawing:', error)
            }
        })
    }

    return drawingId ? (
        <form action={updateDrawing}>
            <input type='hidden' name='elements' value={JSON.stringify(elements)} />
            <input type='hidden' name='drawingId' value={drawingId} />
            <SubmitButton />
        </form>
    ) : (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>Save</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <form className='flex flex-col gap-4' action={handleSaveNewDrawing}>
                        <input type='hidden' name='elements' value={JSON.stringify(elements)} />
                        <input type='hidden' name='drawingId' value={drawingId} />
                        <div className='space-y-2'>
                            <Label>Title<span className='text-red-500'>*</span></Label>
                            <Input placeholder='Enter your Title' name='title' />
                            <Label>Description</Label>
                            <Input placeholder='Enter your description' name='description' />
                        </div>
                        <div className='flex gap-2 items-center justify-center'>
                            <SubmitButton isPending={isPending} />
                            <AlertDialogCancel >
                                cancel
                            </AlertDialogCancel>
                        </div>
                    </form>
                </AlertDialogHeader>
            </AlertDialogContent>

        </AlertDialog>
    )
}

export function SubmitButton({ isPending }: { isPending?: boolean }) {
    const { pending } = useFormStatus()
    const isLoading = pending || isPending
    return (
        <Button type="submit" disabled={isLoading} >{isLoading ? "Saving..." : "Save"}</Button>
    )
}