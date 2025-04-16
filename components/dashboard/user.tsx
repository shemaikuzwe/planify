"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'
import { useSidebar } from '../ui/sidebar'
import { cn } from '@/lib/utils'

export default function User() {
    const user = useSession()?.data?.user;
    const { state } = useSidebar()
    const collapsed = state === "collapsed"
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className='flex justify-center items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={user?.image ?? undefined} />
                        <AvatarFallback>{user?.name?.split(" ")[0][0]}</AvatarFallback>
                    </Avatar>
                    <h4 className={cn({
                        "sr-only": collapsed
                    })}>{user?.name}</h4>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

