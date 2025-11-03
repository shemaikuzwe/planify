import Project from "./project";
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ taskId: string | undefined }>;
// }): Promise<Metadata> {
//   const { taskId } = await params;
//   if (!taskId) return { title: "" };
//   const page = await db.taskCategory.findUnique({ where: { id: taskId } });
//   if (!page) {
//     return {
//       title: "",
//     };
//   }
//   return {
//     title: page?.name || "",
//   };
// }
export default function ProjectIndex() {
  return <Project />;
}
