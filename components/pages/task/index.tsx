// import { Metadata } from "next";
import Task from "./task";
// import { db } from "@/lib/prisma";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ taskId: string }>;
// }): Promise<Metadata> {
//   const { taskId } = await params;
//   const page = await db.taskCategory.findUnique({
//     where: { id: taskId },
//   });
//   if (!page) {
//     return {
//       title: "",
//     };
//   }
//   return {
//     title: page?.name || "",
//   };
// }

export default function TaskIndex() {
  return <Task />;
}
