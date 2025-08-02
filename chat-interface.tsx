"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { useAssetStore } from "@/lib/asset-store"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface ChatInterfaceProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

interface Message {
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function ChatInterface({ isOpen, setIsOpen }: ChatInterfaceProps) {
  const { assets } = useAssetStore()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content: `# Welcome to Asset AI Assistant! 🤖

I'm your **AI Asset Assistant** powered by Gemini with access to your **live asset database**.

## What I can help you with:
- 📊 **Real-time queries** about your ${assets.length} assets
- 🔍 **Search and filter** specific items
- 📈 **Analytics and insights** 
- 💡 **Management recommendations**

*Try asking me about specific assets, categories, or get insights about your inventory!*`,
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const quickReplies = ["Show all assets", "Find an asset", "Check low stock"]

  const callGeminiAPI = async (userMessage: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          assets: assets,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return `## ⚠️ Connection Error

I apologize, but I'm having trouble connecting to my AI services right now. 

**Please try again in a moment.**

*If the problem persists, check your internet connection or contact support.*`
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const newMessage: Message = {
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")
    setIsLoading(true)

    const aiResponse = await callGeminiAPI(message)

    const botResponse: Message = {
      type: "bot",
      content: aiResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botResponse])
    setIsLoading(false)
  }

  const handleQuickReply = async (reply: string) => {
    if (isLoading) return

    const newMessage: Message = {
      type: "user",
      content: reply,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setIsLoading(true)

    const aiResponse = await callGeminiAPI(reply)

    const botResponse: Message = {
      type: "bot",
      content: aiResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botResponse])
    setIsLoading(false)
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <MessageCircle className="text-white" size={20} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`
          fixed z-50 bg-white rounded-2xl shadow-xl flex flex-col border border-gray-200
          bottom-4 right-4 w-[calc(100vw-2rem)] h-[calc(100vh-8rem)]
          sm:bottom-6 sm:right-6 sm:w-80 sm:h-96
          lg:w-96 lg:h-[500px]
        `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t-2xl bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">G</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-semibold text-sm">Asset AI Assistant</span>
                <span className="text-xs text-green-600 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Live Data ({assets.length} assets)
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-2xl ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white p-3"
                      : "bg-gray-50 text-gray-900 p-4 border border-gray-200"
                  }`}
                >
                  {msg.type === "user" ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 text-gray-900 p-4 rounded-2xl flex items-center space-x-3 border border-gray-200">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">AI is analyzing your live data...</p>
                    <p className="text-xs text-gray-500 mt-1">Processing {assets.length} assets</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Reply Buttons */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="w-full p-3 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all text-left flex items-center justify-between group"
                  >
                    <span>{reply}</span>
                    <Send size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Ask about your live assets..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
