import React from 'react'
import { Input } from './input'

interface Props {
    value: string
    onChange: (value: string) => void
}
export default function InlineInput({ value, onChange }: Props) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(value)
    const handleSave = () => {
        onChange(inputValue)
        setIsEditing(false)
        setInputValue(value)
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
                    className="text-sm w-55 font-medium"
                    autoFocus
                />
            ) : (<h3 className="text-lg font-medium" onDoubleClick={() => {
                setIsEditing(true)
            }}>{value}</h3>)}
        </div>
    )
}
