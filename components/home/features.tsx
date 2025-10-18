import { Check } from "lucide-react";

export function Features() {
  return (
    <section className="container mx-auto px-4 py-24" id="features">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
            Key Features
          </div>
          <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Everything you need to be productive
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Planify is packed with features to help you and your team stay
            organized and focused.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Task Management */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Task Management</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Create, assign, and track tasks with ease. Set deadlines,
              priorities, and get notified of updates.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">
                  Task creation and assignment
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">
                  Due dates and reminders
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">Progress tracking</span>
              </li>
            </ul>
          </div>

          {/* Project Planner */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Project Planner</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Plan and visualize your projects with our intuitive project
              planner.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">
                  Gantt charts and timelines
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">
                  Resource management
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">
                  Milestone tracking
                </span>
              </li>
            </ul>
          </div>

          {/* Collaborative Whiteboards */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Collaborative Whiteboards</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Brainstorm ideas, create diagrams, and collaborate in real-time
              with Excalidraw-powered whiteboards.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">Infinite canvas</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">
                  Real-time collaboration
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">
                  Excalidraw integration
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
