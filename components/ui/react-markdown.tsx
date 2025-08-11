import React from 'react'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function ReactMd({ markdown }: { markdown: string }) {
    return (
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
            {markdown ?? "Write your description here..."}
        </ReactMarkdown>
    )
}
