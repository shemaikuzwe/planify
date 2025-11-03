import React, { useState } from "react";
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
import { toast } from "sonner";
import { taskStore } from "@/lib/store/tasks-store";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { PageType } from "@/lib/types";
import { useNavigate } from "react-router";

export default function AddPage({ type = "TASK" }: { type?: PageType }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(2),
      }),
    ),
  });
  const router = useNavigate();
  const session = useSession();
  const onSubmit = async (data: { name: string }) => {
    try {
      const userId = session.data?.user.id;
      if (!userId) {
        throw new Error("User not found");
      }
      const page = await taskStore.addPage(data.name, type, userId);
      form.reset();
      setIsOpen(false);
      router(`/app/${type.toLocaleLowerCase()}/${page.pageId}`);
    } catch (error) {
      console.log(error);
      // toast.error("Failed to add page");
    }
  };
  const handleEmojiSelect = (newEmoji: string) => {
    const currentText = form.getValues("name") || "";
    form.setValue("name", currentText + newEmoji);
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <div className="flex items-center gap-2 ml-2 cursor-pointer">
          <div className="border-2 border-foreground/80 rounded-md p-0.5">
            <Plus className="h-3 w-3" />
          </div>
          <span>New Page</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>New Page</AlertDialogTitle>
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
                      Name <span className="text-red-500">*</span>{" "}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter name"
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
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
