"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { UserTeam } from "@/lib/data/meet"
import { Button } from "../ui/button"
import { EditIcon, Play, TrashIcon } from "lucide-react"
import Link from "next/link"
import CopyLink from "./copy-link"
import { useSession } from "next-auth/react"
import { getInitials } from "@/lib/utils/utils"
import { useCall } from "@/hooks/use-call"

interface TeamCardProps {
    team: UserTeam,
    onClick?: () => void
    className?: string
}
export function TeamCard({
    team,
    onClick,
    className = "",
}: TeamCardProps) {

    const displayMembers = team.teamMembers?.slice(0, 4)
    const totalAdditional = Math.max(0, (team.teamMembers?.length || 0) - 4)
    const user = useSession()
    const isCreator = user.data?.user.id === team.createdBy
    // const call=useCall(team.teamId)
    return (
        <Card
            className={`cursor-pointer hover:shadow-lg ${className}`}
            onClick={onClick}
        >
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{team.name}</h2>
                    {isCreator && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon">
                                <EditIcon className="w-4 h-4" />
                                <span className="sr-only">Edit Team</span>
                            </Button>
                            <Button variant="destructive" size="icon">
                                <TrashIcon className="w-4 h-4" />
                                <span className="sr-only">Delete Team</span>
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex justify-center gap-2 flex-col">
                    <p className="text-sm text-muted-foreground">{team.slogan}</p>
                    <p className="text-sm text-muted-foreground">{team.creator.name}</p>
                    <div className="flex items-center gap-2">
                        <Button size={"sm"} asChild>
                            <Link href={`/meet/${team.teamId}?room=true`}>
                                <Play className="h-4 w-4" />
                                Start
                            </Link>
                        </Button>
                        <CopyLink link={`/meet/${team.teamId}?room=true`} />
                    </div>
                </div>

                {/* Team Members */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex -space-x-2">
                            {displayMembers && displayMembers.map((member, index) => (
                                <Avatar
                                    key={index}
                                    className="w-8 h-8 border-2 ring-1"
                                    style={{ zIndex: displayMembers.length - index }}
                                >
                                    <AvatarImage src={member.user.image || "/placeholder.svg"} alt={member.user.name || ""} />
                                    <AvatarFallback className="text-xs font-medium">
                                        {getInitials(member.user.name || "")}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </div>

                        {totalAdditional > 0 && (
                            <div className="ml-2 w-8 h-8 rounded-full flex items-center justify-center border-2">
                                <span className="text-xs font-medium">+{totalAdditional}</span>
                            </div>
                        )}
                    </div>
                    <div className="text-xs ">
                        {team.teamMembers.length} member{team.teamMembers.length !== 1 ? "s" : ""}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
