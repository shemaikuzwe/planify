import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { renameChat } from "@/lib/actions/chat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClipBoard } from "@/hooks/use-clipBoard";
import {

  Check,
  Copy,
  Edit3,
  Link,
  Loader2,
  Save,
  Share2,
} from "lucide-react";
import { Chat } from "@/lib/types/ai";


interface Props {
  chat: Chat;
}

export function RenameDialog({ chat }: Props) {
 const [isPending, startTransition] = useTransition();
 const [title, setTitle] = useState(chat.title);
 const handleRename = () => {
    startTransition(async () => {
      await renameChat(chat.id, title);
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Edit3 className="w-4 h-4 mr-2" />
          Rename
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Rename Chat
          </DialogTitle>
          <DialogDescription>Enter a new name for your chat.</DialogDescription>
        </DialogHeader>
          <Input
            type="text"
            defaultValue={chat.title}
            name="title"
            placeholder="New chat name"
            onChange={(e) => setTitle(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button onClick={handleRename} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ShareDialog({ chat }: Props) {
  const [isCopied, copyText] = useClipBoard();
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chat.id}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Share Chat
          </DialogTitle>
          <DialogDescription>
            Copy the link below to share this chat with others.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input value={link} readOnly className="flex-1" />
          <Button onClick={() => copyText(link)} className="shrink-0">
            {isCopied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}