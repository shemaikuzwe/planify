
import React, { useState, useTransition } from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogTrigger
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addGroupSchema } from '@/lib/types/schema'
import { Form, FormField, FormControl, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { addGroup } from '@/lib/actions/task'
import EmojiPicker from '../ui/emoji-picker'
import { useSession } from 'next-auth/react'

export default function AddGroup() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const { data: session } = useSession()
    const userId = session?.user.id;
    const form = useForm({
        resolver: zodResolver(addGroupSchema),
        defaultValues: { userId: userId }
    })
    const onSubmit = async (data: { name: string, userId: string }) => {
        startTransition(async () => {
            await addGroup(data)
            form.reset()
            setIsOpen(false)
        })
    }
    const handleEmojiSelect = (newEmoji: string) => {
        const currentText = form.getValues("name") || ""
        form.setValue("name", currentText + newEmoji)
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button size={"sm"} variant={"ghost"} >
                    <Plus className="w-4 h-4 mr-1" />
                    New Group
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>New Group</AlertDialogTitle>
                <Form {...form}>
                    <form className="space-y-3 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='space-y-3 flex  gap-4 w-full'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group Name <span className="text-red-500">*</span> </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter group name" className="w-full" />
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
                            <Button type="submit" disabled={isPending}>{isPending ? "Adding..." : "Add"}</Button>
                        </div>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
