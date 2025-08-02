"use client"

import React from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(text)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-white mb-3 pb-2 border-b border-gray-600">{children}</h1>
          ),
          h2: ({ children }) => <h2 className="text-base font-semibold text-white mb-2 mt-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-medium text-gray-200 mb-2 mt-3">{children}</h3>,

          // Paragraphs
          p: ({ children }) => <p className="text-gray-300 mb-3 leading-relaxed text-sm">{children}</p>,

          // Lists
          ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1 text-sm"
            >
              {children}
              <ExternalLink size={12} />
            </a>
          ),

          // Emphasis
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-200">{children}</em>,

          // Inline code
          code: ({ children, ...props }) => {
            return (
              <code className="bg-gray-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                {children}
              </code>
            )
          },

          // Block code (pre tag)
          pre: ({ children, ...props }) => {
            // children will typically be a single <code> element
            const codeElement = React.Children.toArray(children)[0] as React.ReactElement
            const codeString = String(codeElement.props.children).replace(/\n$/, "")
            const className = codeElement.props.className || ""
            const match = /language-(\w+)/.exec(className)

            return (
              <div className="relative group mb-4">
                <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-600">
                  <span className="text-xs text-gray-400 font-medium uppercase">{match ? match[1] : "code"}</span>
                  <button
                    onClick={() => copyToClipboard(codeString)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedCode === codeString ? (
                      <>
                        <Check size={12} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre
                  className="bg-gray-900 text-gray-300 p-4 rounded-b-lg overflow-x-auto text-xs font-mono leading-relaxed"
                  {...props}
                >
                  {children} {/* This will render the <code> element */}
                </pre>
              </div>
            )
          },

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-600 rounded-lg overflow-hidden">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-800">{children}</thead>,
          tbody: ({ children }) => <tbody className="bg-gray-900">{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-gray-600 last:border-b-0">{children}</tr>,
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-xs font-semibold text-white border-r border-gray-600 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-xs text-gray-300 border-r border-gray-600 last:border-r-0">{children}</td>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-800/50 rounded-r-lg mb-4 italic text-gray-300">
              {children}
            </blockquote>
          ),

          // Horizontal rule
          hr: () => <hr className="border-gray-600 my-4" />,

          // Task lists (GitHub Flavored Markdown)
          input: ({ type, checked, ...props }) => {
            if (type === "checkbox") {
              return <input type="checkbox" checked={checked} readOnly className="mr-2 accent-blue-500" {...props} />
            }
            return <input type={type} {...props} />
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
