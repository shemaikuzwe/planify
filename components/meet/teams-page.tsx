import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import CreateTeam from './create-team'
import { PlusIcon } from 'lucide-react'
import { UserTeam } from '@/lib/data/meet'
import { TeamCard } from './team-card'
import { use } from 'react'

interface Props {
    teamsPromise: Promise<UserTeam[]>
}
export default function TeamsPage({ teamsPromise }: Props) {
    const teams = use(teamsPromise)
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-end'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><PlusIcon className='w-4 h-4' /> Create Team</Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[450px]'>
                        <DialogHeader>
                            <DialogTitle>Create Team</DialogTitle>
                            <DialogDescription>Create a new team</DialogDescription>
                        </DialogHeader>
                        <CreateTeam />
                    </DialogContent>
                </Dialog>
            </div>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {teams.length ? teams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                )) : <div className='flex justify-center items-center h-full'>
                    <p className='text-sm text-muted-foreground'>No teams found</p>
                </div>}
            </div>
        </div>
    )
}
