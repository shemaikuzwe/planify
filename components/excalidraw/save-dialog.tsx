import React from 'react'
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger, AlertDialogContent, AlertDialogCancel } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types'

interface Props {
    elements: OrderedExcalidrawElement[] | null,
}
export default function SaveDialog({ elements }: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>Save</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <form className='flex flex-col gap-4'>
                        <input type='hidden' name='elements' value={JSON.stringify(elements)} />
                        <Input placeholder='Enter your Title' name='title' />
                        <Input placeholder='Enter your description' name='description' />
                        <div className='flex gap-2 items-center justify-center'>
                            <Button type="submit" size={"lg"}>Save</Button>
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
