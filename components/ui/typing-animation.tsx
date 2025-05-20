import { useEffect, useState } from "react"

export default function TypingAnimation({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    const word = words[currentWordIndex]

    const timer = setTimeout(() => {
      // If deleting, remove the last character
      if (isDeleting) {
        setCurrentText((prev) => prev.substring(0, prev.length - 1))
        setTypingSpeed(80) // Faster when deleting

        // When fully deleted, move to the next word
        if (currentText === "") {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
          setTypingSpeed(150)
        }
      }
      // If typing, add the next character
      else {
        setCurrentText(word.substring(0, currentText.length + 1))
        setTypingSpeed(150) // Normal typing speed

        // When fully typed, pause then start deleting
        if (currentText === word) {
          setTypingSpeed(1500) // Pause at the end of the word
          setIsDeleting(true)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [currentText, currentWordIndex, isDeleting, typingSpeed, words])

  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">
        <span className="text-blue-200 inline-block min-w-40">{currentText}</span>
        <span className="text-blue-200 animate-blink">|</span>
      </h1>
    </div>
  )
}
