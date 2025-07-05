"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Copy } from "lucide-react"
import { Meeting, User } from "@/lib/drizzle"
import { formatDate } from "@/lib/utils/utils"

interface MeetingCardProps {
  meeting: Meeting,
  additionalParticipants?: number
  onStart?: () => void
  onCopyInvitation?: () => void
  className?: string
}

export default function MeetingCard({
  meeting,
  additionalParticipants = 0,
  onStart,
  onCopyInvitation, 
  className = "",
}: MeetingCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyInvitation = async () => {
    if (onCopyInvitation) {
      onCopyInvitation()
    }

    // Default copy behavior
    const invitationText = `${process.env.NEXT_PUBLIC_BASE_URL}/meet/${meeting.meetingId}`

    try {
      await navigator.clipboard.writeText(invitationText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy invitation:", err)
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {/* Header with Calendar Icon */}
        <div className="flex items-start justify-between mb-4">
          <Calendar className="w-4 h-4" />
        </div>

        {/* Meeting Title */}
        <h3 className="text-xl font-bold mb-3 leading-tight">{meeting.name}</h3>
        <p className="text-sm mb-6">{formatDate(meeting.startTime)}</p>

        {/* Participants and Actions */}
        <div className="flex items-center justify-between">
          {/* Participant Avatars */}
          {/* <div className="flex items-center">
            <div className="flex -space-x-2">
              {meeting.participants && meeting.participants.slice(0, 4).map((participant) => (
                <Avatar key={participant.id} className="w-12 h-12 border-2 border-slate-800 ring-2 ring-slate-600">
                  <AvatarImage src={participant.image || "/placeholder.svg"} alt={participant.name ?? ""} />
                  <AvatarFallback className="bg-slate-600 text-white text-sm font-medium">
                    {participant.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>

            {additionalParticipants > 0 && (
              <div className="ml-2 w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-600">
                <span className="text-white font-medium text-sm">+{additionalParticipants}</span>
              </div>
            )}
          </div> */}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button onClick={onStart} className="py-2 font-medium">
              Start
            </Button>

            <Button
              onClick={handleCopyInvitation}
              variant="secondary"
              className="border-none px-4 py-2"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
