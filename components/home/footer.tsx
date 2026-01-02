import { Button } from "@/components/ui/button";
import LoginForm from "../auth/login-form";

export function Footer() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to get started?
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          Sign up for Planify today and take your productivity to the next
          level.
        </p>
        <LoginForm>
          <Button size="lg" variant={"outline"}>
            Sign Up
          </Button>
        </LoginForm>
      </div>
    </section>
  );
}
