# Agent Guidelines for Planify

## Build & Development Commands
- **Development server**: `npm run dev`
- **Build production**: `npm run build`
- **Start production**: `npm run start`
- **Lint code**: `npm run lint`
- **Database push**: `npm run db:push`
- **Database studio**: `npm run db:studio`

## Code Style Guidelines

### TypeScript & React
- Use strict TypeScript with explicit types
- React components: PascalCase naming
- Functions/variables: camelCase naming
- Use "use client" directive for client components
- Use "use server" directive for server actions

### Imports
```typescript
// React imports first
import * as React from "react"

// External libraries
import { useState } from "react"
import { Button } from "lucide-react"

// Internal imports with @/ alias
import { cn } from "@/lib/utils/utils"
import type { Task } from "@/lib/types"
```

### Styling
- Use Tailwind CSS with class-variance-authority (cva) for component variants
- Use `cn()` utility for conditional classes (clsx + tailwind-merge)
- Follow existing color scheme and spacing patterns

### Validation & Error Handling
- Use Zod schemas for validation
- Return flattened field errors: `validate.error.flatten().fieldErrors`
- Handle validation failures gracefully

### Database & State
- Use Prisma for database operations
- Use `revalidateTag()` for cache invalidation
- Follow existing patterns for server actions

### ESLint Rules
- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-unused-vars`: warn
- `@typescript-eslint/ban-ts-comment`: off
- Follow Next.js core web vitals rules

### File Structure
- Components in `/components/` with subdirectories by feature
- Server actions in `/lib/actions/`
- Utilities in `/lib/utils/`
- Types in `/lib/types/`
- Database schema in `/lib/prisma/`

Keep code simple, readable, and follow existing patterns. No unnecessary comments.

## Known Issues to Fix
- Task component has type errors with TaskStatusIndicator usage
- Some unused imports in navbar.tsx (fixed)
- Missing revalidatePath import in task.ts (fixed)

## Testing
No test framework currently configured. Run `npm run lint` before commits.

## Linting Rules
- `@typescript-eslint/no-explicit-any`: warn (avoid using `any` type)
- `@typescript-eslint/no-unused-vars`: warn (remove unused imports/variables)
- `@typescript-eslint/ban-ts-comment`: off (allows @ts-ignore comments)
- Follow Next.js core web vitals rules