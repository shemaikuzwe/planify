import React from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface Props {
    value: string
    onChange: (value: string) => void
    className?: string
    options?: {
        slice?: number,
    }
}
export default function InlineInput({ value, onChange, options, className }: Props) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(value)
    const handleSave = () => {
        if (!inputValue || inputValue === value || inputValue.trim() === "") return
        onChange(inputValue)
        setIsEditing(false)
    }
    const handleCancel = () => {
        setInputValue(value)
        setIsEditing(false)
    }
    return (
        <div>
            {isEditing ? (
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave()
                        if (e.key === "Escape") handleCancel()
                    }}
                    className={cn("text-sm font-medium", className)}
                    autoFocus
                />
            ) : (<h3 className="text-lg font-medium" onDoubleClick={() => {
                setIsEditing(true)
            }}>{options?.slice ? value.length > options.slice ? value.slice(0, options.slice) + "..." : value : value}</h3>)}
        </div>
    )
}
