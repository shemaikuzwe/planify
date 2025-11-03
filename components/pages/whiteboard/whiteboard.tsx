import ExcalidrawClient from "@/components/excalidraw/excalidraw";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string | undefined }>;
// }): Promise<Metadata> {
//   const { id } = await params;
//   if (!id) return { title: "Untitled" };
//   const drawing = await db.drawing.findUnique({ where: { id } });
//   if (!drawing) return { title: "Untitled" };
//   return { title: drawing.name };
// }

export default function Whiteboard() {
  return (
    <div className="h-full w-fit">
      <ExcalidrawClient />
    </div>
  );
}
