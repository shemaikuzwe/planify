import { Metadata } from "next";
import Whiteboard from "./whiteboard";

export const metadata: Metadata = {
  title: "Whiteboard",
};

export default function Page() {
  return <Whiteboard />;
}
