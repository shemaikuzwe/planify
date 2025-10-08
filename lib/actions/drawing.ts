import { db } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { addDrawingSchema } from "@/lib/types/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// const utapi = new UTApi({ logLevel: "Error" });

async function saveDrawing(data: { id: string; elements: any }): Promise<void> {
  const validate = addDrawingSchema.safeParse(data);
  if (!validate.success) {
    throw validate.error.flatten().fieldErrors;
  }
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) throw new Error("No user ID in session");
  const { elements, id } = validate.data;
  const parsedElements = JSON.parse(elements);
  await db.drawing.upsert({
    where: { id },
    update: { elements: parsedElements },
    create: {
      id,
      name: "Untitled",
      elements: parsedElements,
      userId: userId,
    },
  });
}

async function editDrawingName(drawingId: string, name: string) {
  await db.drawing.update({ where: { id: drawingId }, data: { name } });
}

async function deleteDrawing(drawingId: string) {
  await db.drawing.delete({ where: { id: drawingId } });
}
async function uploadDrawingFiles(key: string, files: File[]): Promise<void> {
  // const uploadedFiles = await utapi.uploadFiles(files)
  console.log("uploadedFiles", files);

  // for (const file of uploadedFiles) {
  //     if (file.error) continue;
  //     await db.drawingFile.create({
  //         data: {
  //             drawingId: key,
  //             url: file.data.ufsUrl,
  //             mimeType: file.data.type,
  //             name: file.data.name,
  //         }
  //     })
  // }
}

export { saveDrawing, editDrawingName, deleteDrawing, uploadDrawingFiles };
