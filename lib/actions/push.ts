'use server'

import webpush, { PushSubscription } from 'web-push'
import { auth } from '@/auth'
import { db } from "../prisma"

webpush.setVapidDetails(
  process.env.NEXT_PUBLIC_BASE_URL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)


export async function subscribeUser(sub: PushSubscription) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("User not found")
  await db.subscription.create({
    data: {
      endpoint: sub.endpoint,
      userId: userId,
      sub: sub,
    }
  })
  return { success: true }
}

export async function unsubscribeUser(sub: PushSubscription) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("User not found")
  await db.subscription.delete({
    where: { endpoint: sub.endpoint },
  })
  return { success: true }
}

export async function sendNotification(message: string, title: string, sub: PushSubscription) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("User not found")
  const subscription = await db.subscription.findFirst({
    where: { endpoint: sub.endpoint },
  })
  if (!subscription) throw new Error("No subscription available")
  try {
    await webpush.sendNotification(
      subscription.sub as any,
      JSON.stringify({
        title: title,
        body: message,
        icon: '/logo2.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}

export async function sendTeamNotification(teamId: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("User not found")
  const team = await db.team.findFirst({
    where: { teamId },
  })
  if (!team) throw new Error("No team.ts found")
  const teamMembers = await db.user.findMany({
    where: { teamId: team.id },
  })
  if (!teamMembers) throw new Error("No team.ts members found")
  const filteredMembers = teamMembers.filter(member => member.id != userId)
  const subscriptions = await db.subscription.findMany({
    where: {
      userId: {
        in: filteredMembers.map((member) => member.id)
      }
    },
  })
  if (!subscriptions) return

  const tittle = `${team.name} new meeting`
  const message = `New meeting started, join now`
  for (const subscription of subscriptions) {
    if (!subscription.sub) continue
    webpush.sendNotification(subscription.sub, JSON.stringify({
      title: tittle,
      body: message,
      icon: '/logo2.png',
      data: {
        type: "team",
        teamId: teamId,
        link: `${process.env.NEXT_PUBLIC_BASE_URL}/meet/${teamId}?room=true`,
      },
    }))
  }
}