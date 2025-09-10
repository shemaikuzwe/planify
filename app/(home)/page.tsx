import React from 'react'
import { MessageSquare } from 'lucide-react'
import Header from '@/components/ui/header'

export default function page() {
  return (
    <div className='px-4 w-full h-full'>
      <Header title="Dashboard" icon={<MessageSquare className="h-5 w-5 " />} />
      Dashboard
    </div>
  )
}
