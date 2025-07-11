"use client"

import { DialogFooter } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Loader2, Video } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MeetData, meetSchema } from "@/lib/types/schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useSession } from "next-auth/react"
import { nanoid } from "nanoid"
import { createMeeting, joinMeeting } from "@/lib/actions/meet"
import { useRouter } from "next/navigation"
import MeetingCreated from "./meeting-created"
import { toast } from "sonner"
interface StartMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StartMeetingDialog({ open, onOpenChange }: StartMeetingDialogProps) {
  const [activeTab, setActiveTab] = useState("instant")
  const [meetingCreatedOpen, setMeetingCreatedOpen] = useState(false)
  const [meetingId, setMeetingId] = useState("")
  const form = useForm({
    resolver: zodResolver(meetSchema)
  });
  const router = useRouter()
  const client = useStreamVideoClient()
  const user = useSession()?.data?.user

  const [isCreating, setIsCreating] = useState(false)
  const handleSubmit = async (data: MeetData) => {
    try {
      if (!client || !user) return;
      setIsCreating(true)
      const callId = nanoid(6)
      const call = client.call("default", callId)
      const description = data.description
      await call.getOrCreate({
        data: {
          starts_at: data.date ? new Date(data.date).toISOString() : undefined,
          custom: {
            description
          }
        }
      })
      const res = await createMeeting(data, call.id)
      if (res?.error) {
        console.error("Error creating meeting:")
        return
      }
      if (activeTab === "instant") {
        onOpenChange(false)
        form.reset()
        setIsCreating(false)
        return router.push(`/meet/${call.id}`)
      }
      onOpenChange(false)
      setMeetingCreatedOpen(true)
      setMeetingId(call.id)
      setIsCreating(false)
      form.reset()
    } catch (err) {
      console.error("Error creating meeting:", err)
      toast.error("Failed to create meeting. Please try again.")
      onOpenChange(false)
    } finally {
      setIsCreating(false)
    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Start Meeting</DialogTitle>
            <DialogDescription>Create a new meeting</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="instant" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Instant
              </TabsTrigger>
              <TabsTrigger value="later" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </TabsTrigger>
            </TabsList>
            <Form {...form}>
              <form className="mt-4 flex flex-col gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="space-y-4 ">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Meeting Name *</FormLabel>
                        <FormControl>
                          <Input
                            id="instant-meeting-name"
                            placeholder="Enter meeting name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="instant-meeting-description">Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          id="instant-meeting-description"
                          placeholder="What's this meeting about?"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <TabsContent value="later" className="space-y-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="meeting-date" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date *
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="meeting-date"
                            type="datetime-local"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <DialogFooter>
                  <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (<div className="flex gap-2 justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span> Creating</span>
                    </div>) : activeTab === "instant" ? "Start Now" : "Schedule Meeting"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </Tabs>
        </DialogContent>
      </Dialog>
      <MeetingCreated open={meetingCreatedOpen} onOpenChange={setMeetingCreatedOpen} meetingId={meetingId} />
    </>
  )
}

interface JoinMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JoinMeetingDialog({ open, onOpenChange }: JoinMeetingDialogProps) {
  const [meetingId, setMeetingId] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()
  const handleJoin = async () => {
    if (!meetingId.trim()) return

    setIsJoining(true)
    try {
      const res = await joinMeeting(meetingId)
      setMeetingId("")
      onOpenChange(false)
      return router.push(`/meet/${res.meetingId}`)
    } catch (err) {
      console.error("Error joining meeting:", err)
      toast.error("Failed to join meeting. Please try again.")
      onOpenChange(false) 
    } finally {
      setIsJoining(false)
    }

  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Meeting</DialogTitle>
          <DialogDescription>Enter the meeting Link to join an existing meeting</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-id">Meeting Link *</Label>
            <Input
              id="meeting-id"
              placeholder="Enter meeting ID or Link"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              className="font-mono"
            />
            <p className="text-sm text-muted-foreground">Ask the meeting organizer for the meeting Link</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isJoining}>
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={!meetingId.trim() || isJoining}>
            {isJoining ? "Joining..." : "Join Meeting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
