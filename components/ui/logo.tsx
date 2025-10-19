"use client";
import { cn } from "@/lib/utils/utils";
import Image from "next/image";
import { useSidebar } from "./sidebar";
interface Props {
  className?: string;
  textClassName?: string;
}
export default function Logo({ className, textClassName }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  return (
    <div className="flex items-center gap-1">
      <div className={cn("p-1 h-8 w-8 rounded-full", className)}>
        <Image src={"/logo2.png"} alt="Logo" width={100} height={100} />
      </div>
      <h1
        className={cn(
          { "sr-only": collapsed },
          "text-2xl font-bold",
          textClassName,
        )}
      >
        lanify
      </h1>
    </div>
  );
}
