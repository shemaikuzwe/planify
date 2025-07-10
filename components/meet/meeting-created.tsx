"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCheck, Copy } from "lucide-react"

interface MeetingCreatedProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meetingId?: string
  meetingName?: string
}

export default function MeetingCreated({
  open,
  onOpenChange,
  meetingId,
  meetingName,
}: MeetingCreatedProps) {
  const [copied, setCopied] = useState(false)   

  const handleCopyInvitation = async () => {
    const meetingText = `${process.env.NEXT_PUBLIC_BASE_URL}/meet/${meetingId}`

    try {
      await navigator.clipboard.writeText(meetingText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy invitation:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Card className="border-none shadow-none">
          <CardContent className="p-4 text-center space-y-4">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Star/Badge Background */}
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center relative">
                  {/* Star points */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCheck className="w-8 h-8 " />
                  </div>
        
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold mb-2">Meeting Created</h1>
              {/* <h2 className="text-xl font-bold mb-2">{meetingName}</h2> */}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 w-full">
              <Button
                onClick={handleCopyInvitation}
                className="w-full py-3 text-base font-medium"
                size="lg"
              >
                <Copy className="w-5 h-5 mr-2" />
                {copied ? "Copied!" : "Copy Meeting Link"}
              </Button>

              <Button
                onClick={() => onOpenChange(false)}
                variant="secondary"
                className="w-full py-3 text-base font-medium border-none"
                size="lg"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
