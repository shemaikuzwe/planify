"use client";

import dynamic from "next/dynamic";
const AppClient = dynamic(() => import("./app"), { ssr: false });
export default function page() {
  return <AppClient />;
}
