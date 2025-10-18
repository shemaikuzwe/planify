import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left column - Text content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Organize
              <br />& Simplify
              <br />
              Your Work
            </h1>
            <p className="max-w-lg text-pretty text-lg text-muted-foreground md:text-xl">
              Planify is your all-in-one app for task management, project
              planning, and whiteboards
            </p>
          </div>
          <Button
            size="lg"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Get Started
          </Button>
        </div>

        {/* Right column - Mockup */}
        <div className="relative">
          <div className="space-y-6">
            {/* Tasks Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Tasks</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-foreground">Design new UI</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-foreground">Fix password issue</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-teal-500" />
                  <span className="text-foreground">
                    Prepare for presentation
                  </span>
                </div>
              </div>
            </div>

            {/* Charts and Whiteboards Preview */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Chart Preview */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>2</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-blue-400" />
                  <div className="h-3 w-4/5 rounded-full bg-teal-400" />
                  <div className="h-3 w-3/4 rounded-full bg-blue-300" />
                </div>
              </div>

              {/* Whiteboard Preview */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                <h4 className="mb-4 text-sm font-semibold">Whiteboards</h4>
                <div className="flex items-center justify-center">
                  <svg
                    className="h-24 w-24 text-muted-foreground"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    {/* Flowchart diagram */}
                    <rect
                      x="10"
                      y="10"
                      width="25"
                      height="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      rx="2"
                    />
                    <rect
                      x="10"
                      y="70"
                      width="25"
                      height="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      rx="2"
                    />
                    <circle
                      cx="72"
                      cy="50"
                      r="12"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M35 20 L60 20 L60 50 L60 50"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M60 50 L60 50 L72 50"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M35 80 L50 80 L50 50 L60 50"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    {/* Arrows */}
                    <path
                      d="M58 48 L60 50 L58 52"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
