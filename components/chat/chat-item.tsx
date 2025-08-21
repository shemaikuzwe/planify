"use client";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { IconUser } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Chat, User } from "@prisma/client";

interface Props {
  chat: { id: string; title: string; pinned: boolean; updatedAt: Date } & { user: User };
}
export default function ChatItem({ chat }: Props) {
  const content = chat.title;
  const router = useRouter();
  return (
    <Card className="rounded-md w-full">
      <CardTitle className="text-base py-1.5 px-2">{chat.title}</CardTitle>
      <CardContent
        className="p-2 cursor-pointer "
        onClick={() => router.push(`chat/${chat.id}`)}
      >
        <span className="text-muted-foreground text-sm">{content}</span>
      </CardContent>
    </Card>
  );
}