"use client"
import { useState, useEffect, useCallback } from "react"
import { subscribeUser, unsubscribeUser, sendNotification } from "@/lib/actions/push"
import { Switch } from "@/components/ui/switch"
import { Button } from "./button"
import { Input } from "./input"

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  const subscribeToPush = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }, [])

  const unsubscribeFromPush = useCallback(async () => {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }, [subscription])

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message,"Test Notification")
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