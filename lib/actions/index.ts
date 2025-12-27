"use server";

import { signIn } from "@/auth";

export async function login(provider: "google" | "github") {
  await signIn(provider, { redirectTo: "/app" });
}
