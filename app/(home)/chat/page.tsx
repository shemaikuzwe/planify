import React from 'react'
import ChatHistory from '@/components/chat/chat-history'
import { getChats } from '@/lib/data/chat'


export default function page() {
    const chatsPromise = getChats()
  return (
    <ChatHistory chatsPromise={chatsPromise} />
  )
}
