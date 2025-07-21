

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Copy, Play } from "lucide-react"
import { formatDate } from "@/lib/utils/utils"
import { useRouter } from "next/navigation"
import { CallRecording } from "@stream-io/video-react-sdk"

interface RecordingCardProps {
 recording: CallRecording,
  onCopyInvitation?: () => void
  className?: string
}   

export default function RecordingCard({
  recording,
  onCopyInvitation,
  className = "",
}: RecordingCardProps) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleCopyInvitation = async () => {
    if (onCopyInvitation) {
      onCopyInvitation()
    }

    // Default copy behavior
    const invitationText = `${recording.url}`

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
          <h3 className="text-xl font-bold leading-tight">{recording.filename.split(".")[0].slice(0,30)}</h3>
          <p className="text-sm">{formatDate(recording.start_time)}</p>
        </div>

        {/* Action Buttons */}
        {recording.url && (
          <div className="flex gap-3 mt-4">
            <Button onClick={() => router.push(`${recording.url}`)} className="py-2 font-medium">
              <Play className="w-4 h-4 mr-2" />
              Play
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
        )}
      </CardContent>
    </Card>
  )
}
