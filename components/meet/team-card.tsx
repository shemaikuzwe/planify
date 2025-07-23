"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button"
import { EditIcon, Play, TrashIcon } from "lucide-react"
import CopyLink from "./copy-link"
import { useSession } from "next-auth/react"
import { getInitials } from "@/lib/utils/utils"
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"
import { sendTeamNotification } from "@/lib/actions/push"
import { useCallById } from "@/hooks/use-callById"
import { ButtonSkeleton } from "../ui/skelton/button"
import { UserTeam } from "@/lib/types"

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

    const displayMembers = team.members?.slice(0, 4)
    const totalAdditional = Math.max(0, (team.members?.length || 0) - 4)
    const user = useSession()
    const isCreator = user.data?.user.id === team.createdBy.id
    const { call, loading } = useCallById(team.teamId ?? "")
    const client = useStreamVideoClient()
    const router = useRouter()
    const handleStart = async () => {
        if (start) {
            const newCall = client?.call("default", team.teamId ?? "")
            await newCall?.getOrCreate({
                data: {
                    starts_at: new Date().toISOString(),
                }
            })
        }
        sendTeamNotification(team.teamId ?? "").then(() => {
            console.log("Notifications sent")
        })
        router.push(`/meet/${team.teamId}`)
    }
    const start = !call?.state

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
                    <p className="text-sm text-muted-foreground">{team.createdBy.name}</p>
                    <div className="flex items-center gap-2">
                        {loading ? <ButtonSkeleton className="w-20" /> : <Button size={"sm"} onClick={handleStart}>
                            <Play className="h-4 w-4" />
                            {start ? "Start" : "Join"}
                        </Button>}
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
                                    <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name || ""} />
                                    <AvatarFallback className="text-xs font-medium">
                                        {getInitials(member.name || "")}
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
                        {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
