"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "../ui/delete-dialog";
import { TaskCategory } from "@prisma/client";
import { useLocation, useNavigate, useParams } from "react-router";

interface PageOptionsProps {
  page: TaskCategory;
}

export default function PageOptions({ page }: PageOptionsProps) {
  const { pathname } = useLocation();
  const router = useNavigate();
  return (
    <div className="flex items-center gap-1 z-10">
      {/* <Button size="sm" variant="ghost" onClick={async () =>{
             await pinChat(chat.id, !chat.pinned)
             router.refresh()
        }}>
            {chat.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
        </Button> */}
      <DeleteDialog
        id={page.id}
        type="group"
        text={page.name}
        onDelete={() => {
          if (pathname.includes(page.id)) {
            router("/app", { replace: true });
          }
        }}
      >
        <Button size="sm" variant="destructive" className="w-7 h-7">
          <X className="h-3 w-3" />
        </Button>
      </DeleteDialog>
    </div>
  );
}
