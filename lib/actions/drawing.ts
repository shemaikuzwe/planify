"use server"
import { db } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { saveDrawingSchema, updateDrawingSchema } from "@/lib/types/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({logLevel:"Error"})

async function saveDrawing(formData: FormData): Promise<void> {
    const validate = saveDrawingSchema.safeParse(
        Object.fromEntries(formData.entries())
    );
    if (!validate.success) {
        throw validate.error.flatten().fieldErrors;
    }
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) throw new Error("No user ID in session");
    const { elements, title, description } = validate.data;

    // Parse elements string back to JSON
    let parsedElements;
    try {
        parsedElements = JSON.parse(elements);
    } catch (error) {
        throw new Error("Invalid elements data");
    }

    const drawing = await db.drawing.create({
        data: {
            name: title,
            description,
            userId,
            elements: parsedElements,
        }
    })
    revalidateTag("drawings")
    redirect(`/whiteboard/${drawing.id}`)
}

async function updateDrawing(formData: FormData): Promise<void> {
    const validate = updateDrawingSchema.safeParse(
        Object.fromEntries(formData.entries())
    );
    if (!validate.success) {
        throw validate.error.flatten().fieldErrors;
    }
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) throw new Error("something went wrong");
    const { elements, drawingId } = validate.data;

    // Parse elements string back to JSON
    let parsedElements;
    try {
        parsedElements = JSON.parse(elements);
    } catch (error) {
        throw new Error("Invalid elements data");
    }

    await db.drawing.update({
        where: { id: drawingId },
        data: {
            elements: parsedElements,
            userId,
        }
    })
    revalidateTag("drawings")
}

async function editDrawingName(drawingId: string | undefined, name: string) {
    await db.drawing.update({ where: { id: drawingId }, data: { name } });
    revalidateTag("drawings")
}

async function deleteDrawing(drawingId: string) {
    await db.drawing.delete({ where: { id: drawingId } });
    revalidateTag("drawings")
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

export {
    saveDrawing,
    updateDrawing,
    editDrawingName,
    deleteDrawing,
    uploadDrawingFiles
}