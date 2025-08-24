"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Ellipsis, Trash2 } from "lucide-react";
import { RenameDialog, ShareDialog } from "../ui/dialogs";
import { Chat } from "@/lib/types/ai";
import DeleteDialog from "../ui/delete-dialog";
import { Button } from "../ui/button";

interface Props {
  chat: Chat;
}
export default function ChatItem({ chat }: Props) {
  const router = useRouter();
  return (
    <Card className="rounded-md w-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-base py-1.5 px-2">{chat.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <RenameDialog chat={chat} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ShareDialog chat={chat} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DeleteDialog text={chat.title} id={chat.id} type="chat">
                <Button variant={"destructive"}>
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </DeleteDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent
        className="p-2 cursor-pointer flex justify-center items-center "
        onClick={() => router.push(`chat/${chat.id}`)}
      >
        <span className="text-muted-foreground text-sm">{chat.updatedAt ? formatDate(chat.updatedAt) : ""}</span>
      </CardContent>
    </Card>
  );
}