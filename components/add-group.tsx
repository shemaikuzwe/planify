import React from "react";
import { Dialog, DialogFooter, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogClose, DialogContent } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormMessage } from "./ui/form";
import { toast } from "sonner";
import z from "zod";
import { taskStore } from "@/lib/store/tasks-store";
import { useParams } from "next/navigation";

export default function AddGroup() {
  const [open, setOpen] = React.useState(false);
  const params = useParams();
  const taskId = params.taskId as string | undefined;
  type FormValues = {
    id: string;
    name: string;
  };
  const form = useForm<FormValues>({
    resolver: zodResolver(
      z.object({ id: z.string().uuid(), name: z.string().min(2) }),
    ),
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
      <DialogContent>
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
