"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Copy, Play } from "lucide-react"
import { Meeting } from "@/lib/drizzle"
import { formatDate } from "@/lib/utils/utils"
import { useRouter } from "next/navigation"
import CopyLink from "./copy-link"

interface MeetingCardProps {
  meeting: Meeting,
  onCopyInvitation?: () => void
  className?: string
}

export default function MeetingCard({
  meeting,
  onCopyInvitation,
  className = "",
}: MeetingCardProps) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()

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
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header with Calendar Icon */}
        <div className="flex items-start justify-between mb-4">
          <Calendar className="w-4 h-4" />
        </div>

        {/* Meeting Title */}
        <div className="flex flex-col gap-1 flex-grow">
          <h3 className="text-xl font-bold leading-tight">{meeting.name}</h3>
          <p className="text-sm">{meeting.description}</p>
          <p className="text-sm">{formatDate(meeting.startTime)}</p>
        </div>

        {/* Action Buttons */}
        {meeting.status === "ACTIVE" && (
          <div className="flex gap-3 mt-4">
            <Button onClick={() => router.push(`/meet/${meeting.meetingId}`)} className="py-2 font-medium">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>

            <CopyLink link={`/meet/${meeting.meetingId}`} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
