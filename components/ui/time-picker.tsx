"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { TimePickerInput } from "./time-picker-input"
import { Button } from "@/components/ui/button"

interface Props {
  setTime: (date: Date | undefined) => void
}

export default function TimePicker({ setTime }: Props) {
  const [date, setDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    setTime(date)
  }, [date, setTime])

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-end gap-2">
        <div className="grid gap-1 text-center">
          <Label htmlFor="hours" className="text-xs">
            Hours
          </Label>
          <TimePickerInput picker="hours" date={date} setDate={setDate} id="hours" className="w-16" />
        </div>
        <div className="grid gap-1 text-center">
          <Label htmlFor="minutes" className="text-xs">
            Minutes
          </Label>
          <TimePickerInput picker="minutes" date={date} setDate={setDate} id="minutes" className="w-16" />
        </div>
        <div className="grid gap-1 text-center">
          <Label htmlFor="ampm" className="text-xs">
            AM/PM
          </Label>
          <TimePickerInput picker="ampm" date={date} setDate={setDate} id="ampm" className="w-16" />
        </div>
        <div className="flex h-10 items-center">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => {
              const now = new Date()
              setDate(now)
            }}
          >
            <Clock className="h-4 w-4" />
            <span className="sr-only">Set to current time</span>
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (date) {
              setTime(date)
            }
          }}
        >
          Select
        </Button>
      </div>
    </div>
  )
}
