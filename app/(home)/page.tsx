import Chat from '@/components/chat'
import React from 'react'
import { MessageSquare } from 'lucide-react'
import Header from '@/components/ui/header'
import { generateId } from 'ai';

export default function page() {
  const chatId = generateId();
  return (
    <div className='px-4 w-full h-full'>
      <Header title="Chat" icon={<MessageSquare className="h-5 w-5 " />} />
      <Chat id={chatId} />
    </div>
  )
}
