import React from 'react'
import { Button } from '../ui/button'
import { Meeting } from '@/lib/drizzle'
import MeetCard from './meet-card'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'


export default function RecentMeetings({ recentMeetings }: { recentMeetings: Meeting[] }) {
    return (
        <div className="rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Meetings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentMeetings.map((meeting) => (
                    <MeetCard key={meeting.id} meeting={meeting} />
                ))}
            </div>

            <div className="mt-4 pt-4 ">
                <Button variant="outline" asChild>
                    <Link href="/meet?tab=recent-meetings">
                        View All Meetings
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
