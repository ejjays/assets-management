"use client"

import { memo } from "react"

interface MarkdownRendererProps {
  content: string
}

export const MarkdownRenderer = memo(({ content }: MarkdownRendererProps) => {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    return (
      text
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold text-gray-900 mt-4 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-gray-900 mt-4 mb-3">$1</h1>')

        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')

        // Italic text
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

        // Code blocks
        .replace(
          /```([\s\S]*?)```/g,
          '<pre class="bg-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2"><code>$1</code></pre>',
        )

        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

        // Lists
        .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
        .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
        .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 list-decimal">$2</li>')

        // Links
        .replace(
          /\[([^\]]+)\]$$([^)]+)$$/g,
          '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>',
        )

        // Line breaks
        .replace(/\n\n/g, '</p><p class="mb-2">')
        .replace(/\n/g, "<br>")

        // Wrap in paragraph if not already wrapped
        .replace(/^(?!<[h|p|l|d|u])/gm, '<p class="mb-2">')
        .replace(/(?<!>)$/gm, "</p>")

        // Clean up empty paragraphs
        .replace(/<p class="mb-2"><\/p>/g, "")
        .replace(/<p class="mb-2">(<[h|l|d|u])/g, "$1")
        .replace(/(<\/[h|l|d|u][^>]*>)<\/p>/g, "$1")
    )
  }

  return (
    <div
      className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: parseMarkdown(content),
      }}
    />
  )
})

MarkdownRenderer.displayName = "MarkdownRenderer"
