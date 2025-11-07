import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";
import { taskStore } from "@/lib/store/tasks-store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams } from "react-router";

export default function AddGroup() {
  const [open, setOpen] = React.useState(false);
  const params = useParams<{ taskId: string }>();
  const taskId = params.taskId as string | undefined;
  if (!taskId) {
    throw new Error("task Id is required");
  }
  type FormValues = {
    id: string;
    name: string;
  };
  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({ id: z.uuid(), name: z.string().min(2) })),
    defaultValues: {
      id: taskId,
    },
  });
  const handleSubmit = async (data: FormValues) => {
    try {
      await taskStore.addStatus(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add group");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Group</Button>
      </DialogTrigger>
      <DialogContent className="w-90">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Group Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Group</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
