import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { NotebookPenIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function EmptyDrawings() {
  return (
    <div className="flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <NotebookPenIcon />
          </EmptyMedia>
          <EmptyTitle>No boards found!</EmptyTitle>
          {/*<EmptyDescription>Create a new chat to get started.</EmptyDescription>*/}
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href={`/app/whiteboard/${crypto.randomUUID()}`}>
              New Whiteboard
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
