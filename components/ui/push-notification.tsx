"use client"
import { useState } from "react"
import { sendNotification } from "@/lib/actions/push"
import { Switch } from "@/components/ui/switch"
import { Button } from "./button"
import { Input } from "./input"
import { useSubscriptions } from "@/hooks/use-sub"


export function PushNotificationManager() {
  const { isSupported, subscription, subscribeToPush, unsubscribeFromPush } = useSubscriptions()
  const [message, setMessage] = useState('')
  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message, "Test Notification", subscription)
      setMessage('')
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      await subscribeToPush()
    } else {
      await unsubscribeFromPush()
    }
  }

  const isSubscribed = Boolean(subscription)

  return (
    <div className="flex flex-col gap-3">
      <Switch
        id="pushNotifications"
        checked={isSubscribed}
        onCheckedChange={handleToggle}
      />

      {isSubscribed && (
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 rounded-md text-sm"
          />
          <div>
            <Button
              onClick={sendTestNotification}

            >
              Send Test
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}