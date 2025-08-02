"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2 } from "lucide-react"
import { useAssetStore } from "@/lib/asset-store"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatInterfaceProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function ChatInterface({ isOpen, setIsOpen }: ChatInterfaceProps) {
  const { assets } = useAssetStore()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: `# Welcome to Asset AI Assistant! 🤖

I'm your **AI Asset Assistant** with access to your **live asset database**.

## What I can help you with:
- 📊 **Real-time queries** about your ${assets.length} assets
- 🔍 **Search and filter** specific items
- 📈 **Analytics and insights** 
- 💡 **Management recommendations**
- 🔧 **Maintenance scheduling**
- 📋 **Inventory tracking**

## Quick Commands:
- *"Show all assets"* - View complete inventory
- *"Find laptops"* - Search specific items  
- *"Check low stock"* - Review inventory levels
- *"What needs maintenance?"* - View service schedule

**Try asking me about specific assets, categories, or get insights about your inventory!**`,
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  const quickReplies = [
    { text: "Show all assets", icon: "📊" },
    { text: "Find laptops", icon: "💻" },
    { text: "Check low stock", icon: "⚠️" },
    { text: "What needs maintenance?", icon: "🔧" },
  ]

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    const currentMessage = message.trim()
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          assets: assets,
        }),
      })

      const data = await response.json()
      console.log("API Response:", data) // Debug log

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          data.message ||
          data.response ||
          data.error ||
          "I apologize, but I couldn't process your request at the moment.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error calling chat API:", error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `# Connection Error 🔌

I'm having trouble connecting to my AI services right now. 

## What you can do:
- **Try again** in a moment
- **Check your internet connection**
- **Use the main dashboard** for asset management
- **Refresh the page** if the problem persists

## Quick Asset Actions Available:
- View assets in the main table
- Add new assets using the "+" button  
- Generate QR codes for existing assets
- Export asset data

I'll be back online shortly! 🤖`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (reply: string) => {
    if (isLoading) return
    setMessage(reply)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          size="icon"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`
          fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col
          transition-all duration-300 ease-in-out
          ${
            isMinimized
              ? "bottom-4 right-4 w-80 h-14"
              : "bottom-4 right-4 w-[calc(100vw-2rem)] h-[calc(100vh-8rem)] sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] lg:w-[420px] lg:h-[700px]"
          }
        `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">Asset AI Assistant</span>
                <span className="text-xs text-white/80 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                  Live Data ({assets.length} assets)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-2 w-8 h-8"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages - Hidden when minimized */}
          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-3 sm:p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] sm:max-w-[90%] rounded-2xl ${
                          msg.type === "user"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3"
                            : "bg-gray-50 text-gray-900 p-3 sm:p-4 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              msg.type === "user" ? "bg-white/20" : "bg-blue-100"
                            }`}
                          >
                            {msg.type === "user" ? (
                              <User className="w-3 h-3 text-white" />
                            ) : (
                              <Bot className="w-3 h-3 text-blue-600" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            {msg.type === "user" ? (
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                            ) : (
                              <div className="prose prose-sm max-w-none">
                                <MarkdownRenderer content={msg.content} />
                              </div>
                            )}
                            <p className={`text-xs mt-2 ${msg.type === "user" ? "text-white/70" : "text-gray-500"}`}>
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-50 text-gray-900 p-4 rounded-2xl flex items-center space-x-3 border border-gray-200 max-w-[85%]">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">AI is analyzing your data...</p>
                            <p className="text-xs text-gray-500">Processing {assets.length} assets</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Reply Buttons */}
                  {messages.length === 1 && !isLoading && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 font-medium">Quick actions:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleQuickReply(reply.text)}
                            className="justify-start text-left h-auto p-3 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                          >
                            <span className="mr-2 text-base">{reply.icon}</span>
                            <span className="text-sm">{reply.text}</span>
                            <Send className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50/50">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your assets..."
                    disabled={isLoading}
                    className="flex-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                    size="sm"
                    className="px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  AI responses are generated and may not always be accurate
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
