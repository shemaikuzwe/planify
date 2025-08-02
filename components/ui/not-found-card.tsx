"use client"

import React from "react"
import Link from "next/link"
import { MessageSquare, Plus, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
interface Props{
    text: string,
    link: string,
    linkText?: string
}
export default function NotFoundCard({text, link, linkText}: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-4 w-80">
      <Card className="w-full max-w-md shadow-none border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center p-5 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
              <Palette className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-background border-2 flex items-center justify-center">
              <Plus className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {text}
            </h3>
          </div>
          
          <Button asChild className="w-full">
            <Link href={link}>
            <MessageSquare className="w-4 h-4 mr-2" />
             {linkText}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}