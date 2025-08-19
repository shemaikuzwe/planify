import Chat from '@/components/chat';
import Header from '@/components/ui/header';
import { getChatById } from '@/lib/ai/data';
import { UIMessage } from '@/lib/types/ai';
import { MessageSquare } from 'lucide-react';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const chat = await getChatById(id);
    if (!chat) notFound();

    return (
        <div className='px-4 w-full h-full'>
            <Header title={chat.title} icon={<MessageSquare className="h-5 w-5 " />} />
            <Chat id={chat.id} initialMessages={chat.messages as unknown as UIMessage[]} />
        </div>
    )
}
