import React from 'react'
import { Button } from '../ui/button'
import { Meeting } from '@/lib/drizzle'
import MeetCard from './meet-card'


export default function RecentMeetings({ recentMeetings }: { recentMeetings: Meeting[] }) {
    return (
        <div className="rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Meetings</h3>
            </div>

            <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentMeetings.map((meeting) => (
                    <MeetCard key={meeting.id} meeting={meeting} />
                ))}
            </div>

            <div className="mt-4 pt-4 ">
                <Button variant="ghost">
                    View All Meetings
                </Button>
            </div>
        </div>
    )
}
