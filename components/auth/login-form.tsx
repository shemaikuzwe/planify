import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signIn } from "@/app/auth"
import Google from "./Google"
import GitHub from "./Github"

export default function LoginForm() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Card className="w-full max-w-xs   shadow-xl">
        <CardHeader className="space-y-1 text-center pb-2">
          <CardTitle className="text-2xl font-bold ">Welcome back</CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Sign in to your account using your preferred method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 py-4">
          <form>
            <Button
              variant="outline"
              className="w-full justify-center py-3 text-base flex gap-2"
              type="submit"
            >
              <GitHub/>
              Continue With Github
            </Button>
          </form>

          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/" })
            }}
          >
            <Button
              variant="outline"
              className="w-full justify-center py-3 text-base flex gap-2"
              type="submit"
            >
              <Google/>
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
