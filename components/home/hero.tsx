import { Button } from "@/components/ui/button";
import Image from "next/image";
import LoginForm from "../auth/login-form";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left column - Text content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Plan
              <br />& Organize
              <br />
              Your Work
            </h1>
            <p className="max-w-lg text-pretty text-lg text-muted-foreground md:text-xl">
              Planify is your all-in-one app for task management, project
              planning, and whiteboards
            </p>
          </div>
          <LoginForm>
            <Button size="lg">Get Started</Button>
          </LoginForm>
        </div>
        {/*<div className="relative">*/}
        <Image
          src={"/hero.png"}
          width={500}
          height={500}
          alt="hero Image"
          className="rounded-lg"
        />
        {/*</div>*/}
      </div>
    </section>
  );
}
