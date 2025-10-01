import React, { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import EmojiPicker from "../ui/emoji-picker";
import z from "zod";
import { taskStore } from "@/lib/store/tasks-store";
import { useParams } from "next/navigation";

export default function AddGroup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { id } = useParams<{ id: string | undefined }>();
  if (!id) return null;

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(2).max(100),
        id: z.string().uuid(),
      }),
    ),
    defaultValues: { id },
  });
  const onSubmit = async (data: { name: string; id: string }) => {
    startTransition(async () => {
      await taskStore.addStatus(data);
      form.reset();
      setIsOpen(false);
    });
  };
  const handleEmojiSelect = (newEmoji: string) => {
    const currentText = form.getValues("name") || "";
    form.setValue("name", currentText + newEmoji);
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} variant={"ghost"}>
          <Plus className="w-4 h-4 mr-1" />
          New Group
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>New Group</AlertDialogTitle>
        <Form {...form}>
          <form
            className="space-y-3 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-3 flex  gap-4 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Group Name <span className="text-red-500">*</span>{" "}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter group name"
                        className="w-full"
                      />
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

            <div className="flex gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
