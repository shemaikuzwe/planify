import { useParams } from "react-router";
import Task from "./task";

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

interface Props {
  type?: string;
}

export default function TaskIndex({ type }: Props) {
  const { taskId } = useParams<{ taskId: string }>();
  if (!taskId) {
    throw new Error("something went wrong");
  }
  return <Task id={taskId} key={taskId} type={type} />;
}
