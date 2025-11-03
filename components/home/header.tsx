import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import Logo from "../ui/logo";
import LoginForm from "../auth/login-form";

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            to="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            to="#about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LoginForm>
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </LoginForm>

          <LoginForm register>
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Get Started
            </Button>
          </LoginForm>
        </div>
      </div>
    </header>
  );
}
