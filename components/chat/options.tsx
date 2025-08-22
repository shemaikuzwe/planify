"use client"

import React from 'react'
import { Pin, PinOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DeleteDialog from '../ui/delete-dialog'
import { pinChat } from '@/lib/actions/chat'
import { useRouter } from 'next/navigation' 

interface ChatOptionsProps {
    chat: { id: string, title: string, pinned: boolean },
}

export default function ChatOptions({ chat }: ChatOptionsProps) {
    const router = useRouter()

    return (
        <div className="flex items-center gap-1 z-10">
            <Button size="sm" variant="ghost" onClick={async () =>{
                 await pinChat(chat.id, !chat.pinned)
                 router.refresh()
            }}>
                {chat.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
            </Button>
            <DeleteDialog id={chat.id} type="chat" text={chat.title} >
                <Button size="sm" variant="destructive" className="w-7 h-7">
                    <X className="h-3 w-3" />
                </Button>
            </DeleteDialog>
        </div>
    )
}
