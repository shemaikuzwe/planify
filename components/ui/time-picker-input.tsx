"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import React from "react"

interface TimePickerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: "hours" | "minutes" | "ampm"
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function TimePickerInput({ className, picker, date, setDate, ...props }: TimePickerInputProps) {
  const [value, setValue] = React.useState<string>(() => {
    if (!date) return ""

    if (picker === "hours") {
      return String(date.getHours() % 12 || 12).padStart(2, "0")
    }

    if (picker === "minutes") {
      return String(date.getMinutes()).padStart(2, "0")
    }

    if (picker === "ampm") {
      return date.getHours() >= 12 ? "PM" : "AM"
    }

    return ""
  })

  React.useEffect(() => {
    if (!date) {
      setValue("")
      return
    }

    if (picker === "hours") {
      setValue(String(date.getHours() % 12 || 12).padStart(2, "0"))
    }

    if (picker === "minutes") {
      setValue(String(date.getMinutes()).padStart(2, "0"))
    }

    if (picker === "ampm") {
      setValue(date.getHours() >= 12 ? "PM" : "AM")
    }
  }, [date, picker])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    const newDate = date ? new Date(date) : new Date()
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)

    if (picker === "hours") {
      const isAM = date ? date.getHours() < 12 : newDate.getHours() < 12
      const hours = Number(newValue)

      if (isNaN(hours)) {
        setValue("")
        return
      }

      if (hours > 12) {
        newValue = "12"
      }

      if (hours < 1) {
        newValue = "01"
      }

      setValue(newValue)

      const newHours = Number(newValue) % 12
      newDate.setHours(isAM ? newHours : newHours + 12)
      setDate(newDate)
    }

    if (picker === "minutes") {
      const minutes = Number(newValue)

      if (isNaN(minutes)) {
        setValue("")
        return
      }

      if (minutes > 59) {
        newValue = "59"
      }

      if (minutes < 0) {
        newValue = "00"
      }

      setValue(newValue)
      newDate.setMinutes(Number(newValue))
      setDate(newDate)
    }

    if (picker === "ampm") {
      const currentValue = value.toUpperCase()
      const hours = date ? date.getHours() : newDate.getHours()
      const isCurrentAM = hours < 12

      if (newValue.toUpperCase() === "A" || newValue.toUpperCase() === "AM") {
        newValue = "AM"
      } else if (newValue.toUpperCase() === "P" || newValue.toUpperCase() === "PM") {
        newValue = "PM"
      } else {
        newValue = currentValue
      }

      setValue(newValue)

      if ((newValue === "AM" && !isCurrentAM) || (newValue === "PM" && isCurrentAM)) {
        const currentHours = hours % 12
        newDate.setHours(newValue === "AM" ? currentHours : currentHours + 12)
        setDate(newDate)
      }
    }
  }

  return (
    <Input
      {...props}
      className={cn("w-[48px] text-center", className)}
      value={value}
      onChange={handleChange}
      placeholder={picker === "ampm" ? "AM" : "00"}
    />
  )
}
