import { subscribeUser, unsubscribeUser } from "@/lib/actions/push"
import { urlBase64ToUint8Array } from "@/lib/utils/utils"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export function useSubscriptions() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
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
    subscribeUser(serializedSub).catch(() => {
      toast.error("Failed to subscribe to push notifications")
    })
  }, [])

  const unsubscribeFromPush = useCallback(async () => {
    if (subscription) {
      await subscription?.unsubscribe()
      setSubscription(null)
      unsubscribeUser(subscription).catch(() => {
        toast.error("Failed to unsubscribe from push notifications")
      })
    }

  }, [subscription])
  return {
    isSupported,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
  }
}