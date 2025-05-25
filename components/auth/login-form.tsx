"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Logo from "../ui/logo"
import { signIn } from "next-auth/react"
import GitHub from "./Github"
import Google from "./Google"
import TypingAnimation from "../ui/typing-animation"


export default function LoginForm() {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen w-full">
      <div className="hidden lg:flex flex-col justify-between bg-primary  w-full not-only:p-8 h-full">
        <Logo className="bg-white" />
        <div className="my-8 flex justify-start">
          <TypingAnimation words={["Plan", "Create"]} />
        </div>

        <div className="space-y-4">
          <p >Everything you need to plan and create.</p>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">Copyright © {new Date().getFullYear()} Planify</div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 md:p-8 h-full  bg-white">
        <div className="lg:hidden mb-8">
          <Logo className="bg-gray-900" textClassName="text-gray-900" />
        </div>

        <div className="w-full max-w-md border dark:bg-white rounded-xl border-gray-200 p-4 text-gray-900 mb-5">
          <div className="space-y-2 text-center pb-4">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to your account 
            </p>
          </div>
          <div className="space-y-4 pt-0">
            <form className="w-full" action={() => {
              signIn("github",{ redirectTo: "/" })
            }}>
              <Button
                className="w-full h-12  bg-slate-300  text-gray-900 hover:bg-slate-300 hover:opacity-90 flex gap-2 items-center justify-center mb-4"
                type="submit"
              >
                <GitHub />
                Continue with GitHub
              </Button>
            </form>

            <form className="w-full" action={() => {
              signIn("google", { redirectTo: "/" })
            }}>
              <Button
                className="w-full h-12 text-base  bg-slate-300 text-gray-900 hover:bg-slate-300  hover:opacity-90 flex gap-2 items-center justify-center"
                type="submit"
              >
                <Google />
                Continue with Google
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


