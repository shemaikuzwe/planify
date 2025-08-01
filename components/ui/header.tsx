"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button'
import { Share } from 'lucide-react'
import { useSubscriptions } from '@/hooks/use-sub'
import NotificationBanner from './notification-banner';
interface Props {
    title: string;
    icon: React.ReactNode;
    description?: string;
}
export default function Header({ title, icon, description }: Props) {
    const { subscription, isSupported,loading } = useSubscriptions()
    return (
        <div className='flex flex-col gap-2 mt-4 mx-2 max-w-250 '>
            {isSupported && !subscription && !loading && <NotificationBanner />}
            <header className="flex items-center justify-between p-2 border-b">
                <div className="flex gap-2 justify-between items-center">
                    {icon}
                    <div className='flex flex-col'>
                        <h1 className="text-sm font-medium">{title}</h1>
                        <p className='text-foreground-muted'>{description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 px-2 py-1 border border-neutral-700 rounded">Private</span>
                    <Button variant="ghost" size="sm" >
                        <Share className="h-4 w-4 mr-1" />
                        Share
                    </Button>
                </div>
            </header>
        </div>

    )
}
