import React, { useEffect, useState, useTransition } from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogTrigger
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Pen} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addGroupSchema } from '@/lib/types/schema'
import { Form, FormField, FormControl, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { editGroupName } from '@/lib/actions/task'
import EmojiPicker from '../ui/emoji-picker'
import { toast } from 'sonner'
import { TaskCategory } from '@prisma/client'

export default function EditPage({ page }: { page: TaskCategory }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(addGroupSchema),
        defaultValues: {
            name: page.name
        }
    })
    const onSubmit = async (data: { name: string }) => {
        try {
            startTransition(async () => {
                await editGroupName(page.id, data.name)
                form.reset()
                setIsOpen(false)
            })
        } catch (error) {
            console.log(error)
            toast.error("Failed to edit page")
        }
    }
    const handleEmojiSelect = (newEmoji: string) => {
        const currentText = form.getValues("name") || ""
        form.setValue("name", currentText + newEmoji)
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild >
                <Button size={"sm"} variant={"ghost"} >
                    <Pen className="w-4 h-4 mr-1" />
                    Edit Page
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>Edit Page</AlertDialogTitle>
                <Form {...form}>
                    <form className="space-y-3 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='space-y-3 flex  gap-4 w-full'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <span className="text-red-500">*</span> </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter name" className="w-full" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Add Emoji</FormLabel>
                                <div className="flex items-center h-10">
                                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                                </div>
                            </FormItem>
                        </div>

                        <div className='flex gap-2'>
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>
                            <Button type="submit" disabled={isPending}>{isPending ? "Editing..." : "Edit"}</Button>
                        </div>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
