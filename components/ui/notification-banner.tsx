import React, { useState } from 'react'
import { Button } from './button'
import { Alert, AlertDescription } from './alert'
import { Bell, X } from 'lucide-react'
import { Switch } from './switch'
import { useSubscriptions } from '@/hooks/use-sub'


export default function NotificationBanner() {
    const [show, setShow] = useState(true)
    const { subscription, subscribeToPush, unsubscribeFromPush } = useSubscriptions()
    return (
        <>
            {show && (
                <Alert className='bg-primary/10'>
                    <AlertDescription className="flex items-center justify-between gap-4">
                        <Bell className="h-4 w-4 " />
                        <div className="flex-1">
                            <span className="font-medium">Stay updated!</span>
                            <span className=" ml-1">
                                Enable push notifications to receive important updates and messages.
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                            <Switch
                                checked={Boolean(subscription)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        subscribeToPush()
                                        setShow(false)
                                    } else {
                                        unsubscribeFromPush()
                                        setShow(false)
                                    }
                                }}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShow(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
        </>
    )
}
