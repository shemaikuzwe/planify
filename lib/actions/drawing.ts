"use server";
import { db } from "@/lib/prisma";
import { addDrawingSchema } from "@/lib/types/schema";
import { auth } from "@/auth";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ logLevel: "Error" });

async function saveDrawing(data: {
  id: string;
  elements: any[];
}): Promise<void> {
  const validate = addDrawingSchema.safeParse(data);
  if (!validate.success) {
    throw validate.error.flatten().fieldErrors;
  }
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) throw new Error("No user ID in session");
  const { elements, id } = validate.data;

  await db.drawing.upsert({
    where: { id },
    update: { elements },
    create: {
      id,
      name: "Untitled",
      elements,
      userId: userId,
    },
  });
}

async function editDrawingName(drawingId: string, name: string) {
  await db.drawing.update({ where: { id: drawingId }, data: { name } });
}

async function deleteDrawing(drawingId: string) {
  await db.drawing.delete({ where: { id: drawingId } });
  await db.drawingFile.deleteMany({ where: { drawingId } });
}
async function uploadDrawingFiles(key: string, files: File[]) {
  const uploadedFiles = await utapi.uploadFiles(files);
  const uploaded: {
    id: string;
    url: string;
    mimeType: string;
    created: number | undefined;
  }[] = [];
  for (const file of uploadedFiles) {
    if (file.error) continue;
    await db.drawingFile.create({
      data: {
        id: file.data.name,
        drawingId: key,
        url: file.data.ufsUrl,
        mimeType: file.data.type,
        name: file.data.name,
      },
    });
    uploaded.push({
      url: file.data.ufsUrl,
      id: file.data.name,
      mimeType: file.data.type,
      created: file.data.lastModified,
    });
  }
  return uploaded;
}

export { saveDrawing, editDrawingName, deleteDrawing, uploadDrawingFiles };
