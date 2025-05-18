"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Logo from "../logo"
import { signIn } from "next-auth/react"


export default function LoginForm() {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen w-full">
      <div className="hidden lg:flex flex-col justify-between bg-primary  w-full not-only:p-8 h-full">
        <Logo className="bg-white"/>
        <div className="my-8">
          <div className="relative h-64 w-64 mx-auto">
            <Image
              src="/placeholder.svg?height=250&width=250"
              alt="Dashboard illustration"
              width={250}
              height={250}
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Welcome back to Planify</h2>
          <p>Everything you need in an easily customizable dashboard.</p>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">Copyright © {new Date().getFullYear()} Planify</div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 md:p-8 h-full  bg-white">
        <div className="lg:hidden mb-8">
          <Logo className="bg-gray-900" textClassName="text-gray-900" />
        </div>

        <div className="w-full max-w-md border dark:bg-white rounded-xl border-gray-200 p-4 text-gray-900">
          <div className="space-y-2 text-center pb-4">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to your account using your preferred method
            </p>
          </div>
          <div className="space-y-4 pt-0">
            <form className="w-full" action={ () => {
               signIn("github")
            }}>
              <Button
                className="w-full h-12  bg-gray-300  text-gray-900 hover:bg-gray-300 hover:opacity-90 flex gap-2 items-center justify-center mb-4"
                type="submit"
              >
                {/* <GitHub /> */}
                Continue with GitHub
              </Button>
            </form>

            <form className="w-full" action={ () => {
              signIn("google",{redirectTo:"/"})
            }}>
              <Button
                className="w-full h-12 text-base  bg-gray-300 text-gray-900 hover:bg-gray-300  hover:opacity-90 flex gap-2 items-center justify-center"
                type="submit"
              >
                {/* <Google /> */}
                Continue with Google
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

