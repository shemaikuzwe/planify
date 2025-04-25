"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

// Common emojis grouped by category
const emojiData = {
  "Smileys & Emotion": [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
  ],
  "People & Body": [
    "👋",
    "🤚",
    "✋",
    "🖖",
    "👌",
    "🤌",
    "🤏",
    "✌️",
    "🤞",
    "🫰",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👍",
    "👎",
  ],
  "Animals & Nature": [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
    "🐧",
  ],
  "Food & Drink": [
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
  ],
  Activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🥊", "🥋", "🎽", "🛹", "🛼"],
  "Travel & Places": [
    "🚗",
    "🚕",
    "🚙",
    "🚌",
    "🚎",
    "🏎️",
    "🚓",
    "🚑",
    "🚒",
    "🚐",
    "🛻",
    "🚚",
    "🚛",
    "🚜",
    "🛵",
    "🏍️",
    "🛺",
  ],
  Objects: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸"],
  Symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘"],
}

function EmojiPickerContent({ onEmojiSelect }: EmojiPickerProps & { onClose?: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("Smileys & Emotion")

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
  }

  const filteredEmojis = emojiData[activeCategory as keyof typeof emojiData]

  return (
    <div className="w-64 max-h-72 flex flex-col">
      <div className="flex overflow-x-auto mb-2 pb-1 scrollbar-thin">
        {Object.keys(emojiData).map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "ghost"}
            size="sm"
            className="text-xs whitespace-nowrap "
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 overflow-y-auto">
        {filteredEmojis.map((emoji, index) => (
          <button
            key={index}
            type="button" // Prevent form submission
            className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-md text-lg"
            onClick={(e) => {
              e.preventDefault() // Prevent any default behavior
              handleEmojiClick(emoji)
            }}
          >
            {emoji}
          </button>
        ))}
        {filteredEmojis.length === 0 && (
          <div className="col-span-7 py-4 text-center text-sm text-muted-foreground">No emojis found</div>
        )}
      </div>
    </div>
  )
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji)
  
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" type="button" className="h-10 w-10">
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 bg-background border border-input" side="top">
        <EmojiPickerContent onEmojiSelect={handleEmojiSelect} />
        <div className="flex justify-between mt-2 pt-2 border-t">
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-xs">
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
