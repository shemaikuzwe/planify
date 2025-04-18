"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("Smileys & Emotion")

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
  }

  const filteredEmojis = searchQuery
    ? Object.values(emojiData)
        .flat()
        .filter((emoji) => emoji.includes(searchQuery))
    : emojiData[activeCategory as keyof typeof emojiData]

  return (
    <div className="w-64 max-h-72 flex flex-col">
      <div className="relative mb-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search emoji"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-9"
        />
      </div>

      {!searchQuery && (
        <div className="flex overflow-x-auto mb-2 pb-1 scrollbar-thin">
          {Object.keys(emojiData).map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "ghost"}
              size="sm"
              className="text-xs whitespace-nowrap mr-1"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 overflow-y-auto">
        {filteredEmojis.map((emoji, index) => (
          <button
            key={index}
            className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-md text-lg"
            onClick={() => handleEmojiClick(emoji)}
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
