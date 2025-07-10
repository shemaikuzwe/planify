"use client"
import React, { use } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import MeetPage from './meet-page'
import { Meeting } from '@/lib/drizzle'
import Recordings from './recordings'
import TeamsPage from './teams-page'
import { useSearchParams } from 'next/navigation'
import { UserTeam } from '@/lib/data/meet'
interface Props {
    teamsPromise: Promise<UserTeam[]>
    recentMeetingsPromise: Promise<Meeting[]>
}
export default function MeetTabs({ recentMeetingsPromise, teamsPromise }: Props) {
    const recentMeetings = use(recentMeetingsPromise)
    const searchParams = useSearchParams()
    const tab = searchParams.get('tab') || 'meet'
    return (
        <Tabs defaultValue={tab} className='w-full space-y-2 space-x-2 p-4'>
            <TabsList className='grid grid-cols-4 w-full'>
                <TabsTrigger value="meet">Meet</TabsTrigger>
                <TabsTrigger value="room">Room</TabsTrigger>
                <TabsTrigger value="recordings">Recordings</TabsTrigger>
                <TabsTrigger value="recent-meetings">Recent Meetings</TabsTrigger>
            </TabsList>
            <TabsContent value="meet">
                <MeetPage recentMeetings={recentMeetings} />
            </TabsContent>
            <TabsContent value="room">
                <TeamsPage teamsPromise={teamsPromise} />
            </TabsContent>
            <TabsContent value="recordings">
                <Recordings />
            </TabsContent>
            <TabsContent value="recent-meetings">
                {/* <RecentMeetings /> */}  
            </TabsContent>
        </Tabs>
    )
}
