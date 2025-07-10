"use client"

import type React from "react"
import { useState, type KeyboardEvent, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Mail } from "lucide-react"

interface EmailInputPillsProps {
  value: string[]
  onChange: (emails: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const EmailsInput = forwardRef<HTMLDivElement, EmailInputPillsProps>(
  ({ value = [], onChange, placeholder = "Enter email address...", className = "", disabled = false }, ref) => {
    const [inputValue, setInputValue] = useState("")

    const isValidEmail = (email: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    }

    const addEmail = () => {
      const email = inputValue.trim()
      if (email && isValidEmail(email) && !value.includes(email)) {
        onChange([...value, email])
        setInputValue("")
      }
    }

    const removeEmail = (emailToRemove: string) => {
      onChange(value.filter((email) => email !== emailToRemove))
    }

    const editEmail = (emailToEdit: string) => {
      setInputValue(emailToEdit)
      onChange(value.filter((email) => email !== emailToEdit))
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addEmail()
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    }

    return (
      <div ref={ref} className={`space-y-3 ${className}`}>
        {/* Selected Emails Pills */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((email, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-2 py-2 px-3 border-0 rounded-full cursor-pointer transition-colors"
                onClick={() => editEmail(email)}
              >
                <span className="text-sm font-medium">{email}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeEmail(email)
                  }}
                  aria-label={`Remove ${email}`}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Email Input Field */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="email"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="pl-10  rounded-lg"
            />
          </div>
          <Button
            type="button"
            onClick={addEmail}
            disabled={disabled || !inputValue.trim() || !isValidEmail(inputValue) || value.includes(inputValue.trim())}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
      </div>
    )
  },
)

