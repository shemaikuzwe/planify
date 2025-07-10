import React, { useEffect, useState } from 'react'
import RecordingCard from './recording.card'
import { useGetCalls } from '@/hooks/use-get-calls'
import { CallRecording } from '@stream-io/video-react-sdk'
import { Loader2 } from 'lucide-react'

export default function Recordings() {
    const [recordings, setRecordings] = useState<CallRecording[]>([])
    const { callRecordings, isLoading } = useGetCalls()
    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                console.log("isLoading", isLoading)
                if (isLoading) return
                const callData = await Promise.all(
                    callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
                );

                const recordings = callData
                    .filter((call) => call.recordings.length > 0)
                    .flatMap((call) => call.recordings);
                console.log("recordings", recordings, isLoading)
                setRecordings(recordings);
            }
            catch (err) {
                console.log(err);
                // TODO: add toat 
            }
        }
        fetchRecordings()

    }, [isLoading]);
    if (isLoading) return <div className='flex justify-center items-center h-full'><Loader2 className='w-4 h-4 animate-spin' /></div>

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4'>
                {!isLoading && recordings.length > 0 && recordings.map((recording, index) => (
                    <RecordingCard key={index} recording={recording} />
                )) }
            </div>
        </div>
    )   
}
