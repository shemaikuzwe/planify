"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import GitHub from "./Github";
import Google from "./Google";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTransition } from "react";
import { Spinner } from "../ui/spinner";

export default function LoginForm({
  children,
  register = false,
}: {
  children: React.ReactNode;
  register?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const handleSignIn = (provider: "google" | "github") => {
    startTransition(() => {
      signIn(provider, { redirectTo: "/app" });
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-md h-80">
        <DialogHeader className="text-center items-center pb-2 mb-5">
          <DialogTitle className="text-2xl font-bold">
            Welcome {!register && "Back"}
          </DialogTitle>
          <p className="text-muted-foreground">
            {register
              ? "Create your account,to continue"
              : "Sign in to your account"}
          </p>
        </DialogHeader>
        <div className="flex flex-col mb-10 justify-center items-center">
          <form className="w-full" action={() => handleSignIn("github")}>
            <Button
              className="w-full h-12  flex gap-2 items-center justify-center mb-4"
              type="submit"
              variant={"outline"}
              disabled={isPending}
            >
              {isPending ? (
                <Spinner />
              ) : (
                <>
                  <GitHub />
                  Continue with GitHub
                </>
              )}
            </Button>
          </form>

          <form className="w-full" action={() => handleSignIn("google")}>
            <Button
              className="w-full h-12 text-base justify-center"
              type="submit"
              variant={"outline"}
              disabled={isPending}
            >
              {isPending ? (
                <Spinner />
              ) : (
                <>
                  <Google />
                  Continue with Google
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
