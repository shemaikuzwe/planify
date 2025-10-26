import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Task",
    template: "Task - %s",
  },
};

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
