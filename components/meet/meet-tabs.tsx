"use client"
import React, { use } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import MeetPage from './meet-page'
import { Meeting } from '@/lib/drizzle'
import Recordings from './recordings'
import TeamsPage from './teams-page'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserTeam } from '@/lib/data/meet'
interface Props {
    teamsPromise: Promise<UserTeam[]>
    recentMeetingsPromise: Promise<Meeting[]>
}
export default function MeetTabs({ recentMeetingsPromise, teamsPromise }: Props) {
    const recentMeetings = use(recentMeetingsPromise)
    const router = useRouter()
    const searchParams = useSearchParams()
    const tab = searchParams.get('tab') || 'teams'
    const handleTabChange = (value: string) => {
        router.push(`/meet?tab=${value}`)
    }
    return (
        <div className="w-full">
            <Tabs defaultValue={tab} className="w-full" onValueChange={handleTabChange}>
                <TabsList className="w-full flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-flow-col">
                    <TabsTrigger className="flex-shrink-0" value="teams">Teams</TabsTrigger>
                    <TabsTrigger className="flex-shrink-0" value="meet">Meet</TabsTrigger>
                    <TabsTrigger className="flex-shrink-0" value="recordings">Recordings</TabsTrigger>
                    <TabsTrigger className="flex-shrink-0" value="recent-meetings">Recent Meetings</TabsTrigger>
                </TabsList>

                <TabsContent value="meet" className="w-full">
                    <MeetPage recentMeetings={recentMeetings} />
                </TabsContent>
                <TabsContent value="teams" className="w-full">
                    <TeamsPage teamsPromise={teamsPromise} />
                </TabsContent>
                <TabsContent value="recordings" className="w-full">
                    <Recordings />
                </TabsContent>
                <TabsContent value="recent-meetings" className="w-full">
                    {/* <RecentMeetings /> */}
                </TabsContent>
            </Tabs>
        </div>
    )
}
