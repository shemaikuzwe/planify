import Chat from "@/components/excalidraw/chat";
import {auth} from "@/auth";
import {GetUserDrawings} from "@/lib/data";


export default async function Page() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("User not found")
  const drawings = await GetUserDrawings(userId)
  return (
    <Chat  drawings={drawings}/>
  );
}