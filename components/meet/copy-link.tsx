
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Copy } from 'lucide-react'

interface Props {
    link: string
}
export default  function CopyLink({ link }: Props) {
    const [copied, setCopied] = useState(false)
    const handleCopyInvitation = async () => {
    const text = `${process.env.NEXT_PUBLIC_BASE_URL}${link}`
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (err) {
          console.error("Failed to copy invitation:", err)
        }
      }

return (
    <Button variant="outline" size={"sm"} onClick={handleCopyInvitation} >
        <Copy className="h-4 w-4" />
        {copied ? "Copied!" : "Copy Link"}
    </Button>
)
}


