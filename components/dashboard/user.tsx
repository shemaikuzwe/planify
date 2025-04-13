"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'

export default function User() {
    const user = useSession()?.data?.user;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className='flex justify-center items-center gap-2'>
                <Avatar>
                    <AvatarImage src={user?.image ?? undefined} />
                    <AvatarFallback>{user?.name?.split(" ")[0][0]}</AvatarFallback>
                </Avatar>
                <h4>{user?.name}</h4>
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

