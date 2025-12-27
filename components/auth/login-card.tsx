"use client";

import {
  ChevronLeft,
  ShieldCheck,
  Box,
  Brain,
  ListTodo,
  ListCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useTransition } from "react";
import { login } from "@/lib/actions";
import { Spinner } from "../ui/spinner";
import Google from "./Google";
import GitHub from "./Github";
import Image from "next/image";
import Logo from "../ui/logo";

export function LoginCard({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isPending, startTransition] = useTransition();
  const handleSignIn = (provider: "google" | "github") => {
    startTransition(async () => {
      await login(provider);
    });
  };
  return (
    <Card className="overflow-hidden border-none  w-full bg-card shadow-2xl">
      <CardContent className="p-0 flex flex-col md:flex-row min-h-[580px]">
        <div className="flex-1 p-8 flex flex-col relative">
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="absolute left-6 top-6 rounded-full bg-muted/50 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="mt-12 flex flex-col items-center text-center space-y-6 max-w-sm mx-auto w-full">
            <div className="flex items-center gap-2 mb-2">
              <Logo />
            </div>

            <p className="text-muted-foreground text-sm">
              Sign in or create your planify account
            </p>
            <Button
              className="w-full h-12 text-base justify-center"
              type="submit"
              variant={"outline"}
              disabled={isPending}
              onClick={() => handleSignIn("google")}
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
            <div className="w-full flex items-center gap-4 py-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground uppercase">
                Or
              </span>
              <Separator className="flex-1" />
            </div>

            <div className="w-full space-y-4">
              <Button
                className="w-full h-12  flex gap-2 items-center justify-center mb-4"
                onClick={() => handleSignIn("github")}
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
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              By clicking continue, you agree to our{" "}
              <a
                href="#"
                className="underline hover:text-foreground underline-offset-2"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline hover:text-foreground underline-offset-2"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right Pane */}
        <div className="flex-1 bg-secondary/30 p-12 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold leading-tight">Planify</h2>
              <p className="text-muted-foreground leading-relaxed">
                Plan your tasks and projects in one app.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-lg bg-background shadow-sm">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Collaborative Whiteboards</h3>
                  <p className="text-sm text-muted-foreground">
                    create diagrams, and collaborate in real-time with
                    Excalidraw-powered whiteboards.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-lg bg-background shadow-sm">
                  <ListCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Task Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Create, assign, and track tasks with ease.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-lg bg-background shadow-sm">
                  <ListTodo className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Project Planner</h3>
                  <p className="text-sm text-muted-foreground">
                    Plan and visualize your projects with our intuitive project
                    planner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
