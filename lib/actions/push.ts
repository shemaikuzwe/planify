'use server'

import webpush from 'web-push'
import db from '../drizzle'
import { auth } from '@/auth'
import { subscription as subscriptionTable, teamMembers as teamMembersTable, team as teamTable } from '../drizzle/schema'
import { eq, inArray } from 'drizzle-orm'

webpush.setVapidDetails(
  process.env.NEXT_PUBLIC_BASE_URL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)


export async function subscribeUser(sub: PushSubscription) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("User not found")
  await db.insert(subscriptionTable).values({
    userId: userId,
    sub: sub,
  })
  return { success: true }
}

export async function unsubscribeUser() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("User not found")
  await db.delete(subscriptionTable).where(eq(subscriptionTable.userId, userId))
  return { success: true }
}

export async function sendNotification(message: string, title: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("User not found")
  const subscription = await db.query.subscription.findFirst({
    where: eq(subscriptionTable.userId, userId),
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
  const team = await db.query.team.findFirst({
      where: eq(teamTable.teamId, teamId),
    })
    if (!team) throw new Error("No team found")
  const teamMembers = await db.query.teamMembers.findMany({
    where: eq(teamMembersTable.teamId, team.id),
  })
  if (!teamMembers) throw new Error("No team members found")
  const subscriptions = await db.query.subscription.findMany({
    where: inArray(subscriptionTable.userId, teamMembers.map((member) => member.userId)),
  })
  if (!subscriptions)  return
 
  const tittle = `${team.name} new meeting`
  const message = `New meeting started, join now`
  console.log(subscriptions)
  for (const subscription of subscriptions) {
    await webpush.sendNotification(subscription.sub as any, JSON.stringify({
      title: tittle,
      body: message,
      icon: '/logo2.png',
      data: {
        type: "team",
        teamId: teamId,
        link: `/meet/${teamId}?room=true`,
      },
    }))
  }
}