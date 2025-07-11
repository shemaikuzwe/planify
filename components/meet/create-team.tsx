"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { EmailsInput } from "./emails-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Users, Loader2 } from "lucide-react"
import { DialogClose, DialogFooter } from "../ui/dialog"
import { teamSchema } from "@/lib/types/schema"
import { createTeam } from "@/lib/actions/meet"
import { toast } from "sonner"



type TeamFormData = z.infer<typeof teamSchema>

export default function CreateTeam({ setIsCreatingTeam }: { setIsCreatingTeam: (isCreatingTeam: boolean) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      slogan: "",
      members: [],
    }
  })


  const onSubmit = async (data: TeamFormData) => {
    setIsSubmitting(true)
    try {
      await createTeam(data)
      form.reset()
      setIsCreatingTeam(false)
    } catch (error) {
      console.error("Error creating team:", error)
      toast.error("Failed to create team. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Team Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your team name" {...field} />
                    </FormControl>
                    <div className="flex justify-between text-xs">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Team Slogan Field */}
              <FormField
                control={form.control}
                name="slogan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Slogan *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter a motivating slogan for your team" rows={3} {...field} />
                    </FormControl>
                    <div className="flex justify-between text-xs">
                      <FormMessage />
                      
                    </div>
                  </FormItem>
                )}
              />

              {/* Team Member Emails Field */}
              <FormField
                control={form.control}
                name="members"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Members *</FormLabel>
                    <FormControl>
                      <EmailsInput
                        value={field.value as string[]}
                        onChange={field.onChange}
                        placeholder="Enter team member email..."
                      />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex items-center justify-end pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isValid}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Team...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Create Team
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
    </div>
  )
}
