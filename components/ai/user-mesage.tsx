"use client";

import { IconUser } from "../ui/icons";


export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center">
        <IconUser />
      </div>
      <div className="ml-2 -mt-4 flex-1 flex-col text-sm md:text-sm lg:text-base">
        {children}
      </div>
    </div>
  );
}