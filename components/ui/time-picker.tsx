"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  className?: string
  value?: string
  onChange?: (time: string) => void
}

export function TimePicker({ className, value, onChange }: TimePickerProps) {
  // Parse the input string to get hours, minutes, and period
  const parseTimeString = (timeString?: string) => {
    if (!timeString) {
      return { hour: "12", minute: "00", period: "AM" as const }
    }

    try {
      // Expected format: "HH:MM AM/PM"
      const [timePart, periodPart] = timeString.split(" ")
      const [hourPart, minutePart] = timePart.split(":")

      const hour = hourPart.padStart(2, "0")
      const minute = minutePart.padStart(2, "0")
      const period = (periodPart === "PM" ? "PM" : "AM") as "AM" | "PM"

      return { hour, minute, period }
    } catch (error) {
      // Return default values if parsing fails
      return { hour: "12", minute: "00", period: "AM" as const }
    }
  }

  const { hour, minute, period } = parseTimeString(value)

  const [selectedHour, setSelectedHour] = React.useState<string>(hour)
  const [selectedMinute, setSelectedMinute] = React.useState<string>(minute)
  const [selectedPeriod, setSelectedPeriod] = React.useState<"AM" | "PM">(period)

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

    // Format the time as a string: "HH:MM AM/PM"
    const formattedTime = `${hour}:${minute} ${period}`
    onChange(formattedTime)
  }

  // Format the display time
  const formatDisplayTime = (timeString?: string) => {
    if (!timeString) return "Select time"

    try {
      const { hour, minute, period } = parseTimeString(timeString)
      return `${hour}:${minute} ${period}`
    } catch (error) {
      return "Select time"
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", className)}>
          <Clock className="mr-2 h-4 w-4" />
          {value ? formatDisplayTime(value) : "Select time"}
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
