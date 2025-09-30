import { addPage } from "@/lib/actions/task";
import { addPageSchema, SyncType } from "@/lib/types/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    switch (body.type as SyncType) {
      case "addPage": {
        const validate = addPageSchema.parse(body.data);
        await addPage({
          name: validate.name,
          pageId: validate.pageId,
          todoId: validate.todoId,
          inProgressId: validate.inProgressId,
          doneId: validate.doneId,
        });
        break;
      }
    }

    return NextResponse.json(
      { message: "Synced successfully" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}
