"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Merge, Plus } from "lucide-react"
import { StartMeetingDialog, JoinMeetingDialog } from "./meet-form"
import MeetingCreated from "./meeting-created"
import RecentMeetings from "./recent-meetings"
import { Meeting } from "@/lib/drizzle"

export default function MeetPage({ recentMeetings }: { recentMeetings: Meeting[] }) {
  const [startMeetingOpen, setStartMeetingOpen] = useState(false)
  const [joinMeetingOpen, setJoinMeetingOpen] = useState(false)
  const [meetingCreatedOpen, setMeetingCreatedOpen] = useState(false)

  const handleCreateMeeting = (id:string,name: string) => {
    setMeetingCreatedOpen(true)
  }


  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8">
        
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Start or Join a Meeting</h1>
                <p className="text-foreground">Connect with your team instantly or schedule for later</p>
              </div>

              {/* Meeting Options - Horizontal Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Start Meeting</h3>
                    <p className="text-foreground/60 text-sm mb-4">Create an instant or scheduled meeting</p>
                    <Button onClick={() => setStartMeetingOpen(true)} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Merge className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Join Meeting</h3>
                    <p className="text-foreground/60 text-sm mb-4">Enter a meeting ID to join</p>
                    <Button
                      onClick={() => setJoinMeetingOpen(true)}
                      variant="secondary"
                      className="w-full"
                    >
                      <Merge className="w-4 h-4 mr-2" />
                      Join
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <RecentMeetings recentMeetings={recentMeetings}/>
            </div>
        
        </div>
      </div>

      <StartMeetingDialog
        open={startMeetingOpen}
        onOpenChange={setStartMeetingOpen}
        onCreateMeeting={handleCreateMeeting}
      />
      <MeetingCreated open={meetingCreatedOpen} onOpenChange={setMeetingCreatedOpen} />
      <JoinMeetingDialog open={joinMeetingOpen} onOpenChange={setJoinMeetingOpen} />
    </div>
  )
}
