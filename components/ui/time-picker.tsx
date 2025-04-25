"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  className?: string
  value?: Date
  onChange?: (date: Date) => void
}

export function TimePicker({ className, value = new Date(), onChange }: TimePickerProps) {
  const [selectedHour, setSelectedHour] = React.useState<string>(formatHour(value.getHours()))
  const [selectedMinute, setSelectedMinute] = React.useState<string>(formatMinute(value.getMinutes()))
  const [selectedPeriod, setSelectedPeriod] = React.useState<"AM" | "PM">(value.getHours() >= 12 ? "PM" : "AM")

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1
    return hour.toString().padStart(2, "0")
  })

  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => {
    return i.toString().padStart(2, "0")
  })

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour)
    updateTime(hour, selectedMinute, selectedPeriod)
  }

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute)
    updateTime(selectedHour, minute, selectedPeriod)
  }

  const handlePeriodChange = (period: "AM" | "PM") => {
    setSelectedPeriod(period)
    updateTime(selectedHour, selectedMinute, period)
  }

  const updateTime = (hour: string, minute: string, period: "AM" | "PM") => {
    if (!onChange) return

    const newDate = new Date(value)
    let hours = Number.parseInt(hour, 10)

    // Convert to 24-hour format
    if (period === "PM" && hours < 12) {
      hours += 12
    } else if (period === "AM" && hours === 12) {
      hours = 0
    }

    newDate.setHours(hours)
    newDate.setMinutes(Number.parseInt(minute, 10))
    newDate.setSeconds(0)
    onChange(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", className)}>
          <Clock className="mr-2 h-4 w-4" />
          {formatTime(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex items-center space-x-2">
          <Select value={selectedHour} onValueChange={handleHourChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-center">:</span>
          <Select value={selectedMinute} onValueChange={handleMinuteChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={(value) => handlePeriodChange(value as "AM" | "PM")}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}


function formatHour(hour: number): string {

  const h = hour % 12 || 12
  return h.toString().padStart(2, "0")
}

function formatMinute(minute: number): string {
  return minute.toString().padStart(2, "0")
}

function formatTime(date: Date): string {
  const hours = formatHour(date.getHours())
  const minutes = formatMinute(date.getMinutes())
  const period = date.getHours() >= 12 ? "PM" : "AM"
  return `${hours}:${minutes} ${period}`
}
