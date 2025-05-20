"use client"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { Bold, Italic, List, ListOrdered, Link, ImageIcon, Code, CheckSquare } from "lucide-react"

interface Props{
  markdown: string| null
  onChange: (markdown: string) => void
}
export default function MarkdownEditor({ markdown, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
   
    onChange(e.target.value)
  }

  const insertFormat = (format: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = markdown?.substring(start, end)
    let formattedText = ""
    let cursorOffset = 0

    switch (format) {
      case "bold":
        formattedText = `**${selectedText || "bold text"}**`
        cursorOffset = selectedText ? 0 : 9
        break
      case "italic":
        formattedText = `*${selectedText || "italic text"}*`
        cursorOffset = selectedText ? 0 : 11
        break
      case "bullet-list":
        formattedText = selectedText
          ? selectedText
            .split("\n")
            .map((line) => `- ${line}`)
            .join("\n")
          : "- List item\n- Another item\n- And another"
        cursorOffset = selectedText ? 0 : 33
        break
      case "numbered-list":
        formattedText = selectedText
          ? selectedText
            .split("\n")
            .map((line, i) => `${i + 1}. ${line}`)
            .join("\n")
          : "1. List item\n2. Another item\n3. And another"
        cursorOffset = selectedText ? 0 : 37
        break
      case "link":
        formattedText = selectedText ? `[${selectedText}](url)` : "[link text](https://example.com)"
        cursorOffset = selectedText ? 1 + selectedText.length : 30
        break
      case "image":
        formattedText = `![${selectedText || "alt text"}](/placeholder.svg?height=200&width=400)`
        cursorOffset = selectedText ? 0 : 8
        break
      case "code":

        formattedText = `\`\`\`js\n${selectedText || "// Your code here"}\n\`\`\``

        cursorOffset = selectedText ? 0 : selectedText?.includes("\n") ? 13 : 11
        break
      case "checkbox":
        formattedText = selectedText
          ? selectedText
            .split("\n")
            .map((line) => `- [ ] ${line}`)
            .join("\n")
          : "- [ ] Task to do\n- [x] Completed task"
        cursorOffset = selectedText ? 0 : 30
        break
      default:
        return
    }

    const newText = markdown?.substring(0, start) + formattedText + markdown?.substring(end)
    onChange(newText)

    // Set cursor position after the operation is complete
    setTimeout(() => {
      textarea.focus()
      if (!selectedText) {
        const newPosition = start + formattedText.length - cursorOffset
        textarea.setSelectionRange(newPosition, newPosition)
      } else {
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
      }
    }, 0)
  }

  return (
    <div className="w-full mt-2">
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="editor">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="w-full">
          <div className="bg-slate-100 dark:bg-slate-800  p-1 rounded-t-md border border-b-0 flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => insertFormat("bold")} title="Bold" className="h-9 w-9">
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertFormat("italic")}
              title="Italic"
              className="h-9 w-9"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertFormat("bullet-list")}
              title="Bullet List"
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertFormat("numbered-list")}
              title="Numbered List"
              className="h-9 w-9"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => insertFormat("link")} title="Link" className="h-9 w-9">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => insertFormat("image")} title="Image" className="h-9 w-9">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => insertFormat("code")} title="Code" className="h-9 w-9">
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertFormat("checkbox")}
              title="Checkbox"
              className="h-9 w-9"
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            ref={textareaRef}
            value={markdown??undefined}
            onChange={handleChange}
            className="min-h-[200px]  p-4 rounded-t-none "
            placeholder="Write your description here..."
          />
        </TabsContent>

        <TabsContent value="preview" className="w-full">
          <div className="border rounded-md p-6 min-h-[200px] ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return match ? (
                    <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                a: ({ node, ...props }) => <a className="text-primary hover:text-primary/70 underline" {...props} />,
                ul: ({ node, className, children, ...props }) => {
                  if (className?.includes("contains-task-list")) {
                    return (
                      <ul className="pl-0 list-none space-y-1" {...props}>
                        {children}
                      </ul>
                    )
                  }
                  return <ul {...props}>{children}</ul>
                },
                li: ({ node, className, children, ...props }) => {
                  if (className?.includes("task-list-item")) {
                    return (
                      <li className="flex items-center my-1" style={{ listStyleType: "none" }} {...props}>
                        <div className="mr-2 flex-shrink-0">

                        </div>
                        <span >{children}</span>
                      </li>
                    )
                  }
                  return <li {...props}>{children}</li>
                },
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-bold" {...props} />,
              }}
            >
              {markdown?? "Write your description here..."}
            </ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
