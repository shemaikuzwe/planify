import React from 'react'
import { Dialog, DialogFooter, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { DialogClose, DialogContent } from '@radix-ui/react-dialog'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addGroupSchema } from '@/lib/types/schema'
import { Form, FormField, FormControl, FormItem, FormMessage } from './ui/form'
import { useMutation} from '@tanstack/react-query'
import { toast } from 'sonner'
import z from 'zod'
import {  addStatus } from '@/lib/actions/task'
import { useParams } from 'next/navigation'


export default function AddGroup() {
    const [open, setOpen] = React.useState(false)
    const params = useParams();
    const taskId=params.taskId as string|undefined;
    type FormValues = z.infer<typeof addGroupSchema>
    const form = useForm<FormValues>({
        resolver: zodResolver(addGroupSchema),
        defaultValues:{
            id:taskId
        }
    })

    const mutation = useMutation({
        mutationFn: addStatus,
        onSuccess: () => {
            setOpen(false)
            form.reset()
        },
        onError: (error) => {
            toast.error('Failed to add group. Please try again.')
            console.error('Error adding group:', error)
        }
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Group</Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Group Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className='mt-2'>
                            <DialogClose asChild>
                                <Button variant="outline" disabled={mutation.isPending}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type='submit' disabled={mutation.isPending}>
                                {mutation.isPending ? 'Adding...' : 'Add Group'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
