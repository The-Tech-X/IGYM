'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Message = { role: 'user' | 'assistant'; content: string }

export default function ChatWidget() {
  const [visible, setVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (!panelRef.current?.contains(target) && !fabRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  async function send(content: string) {
    if (!content.trim() || loading) return

    const userMsg: Message = { role: 'user', content: content.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok || !response.body) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'I apologise — something went wrong. Please try again.' }])
        return
      }

      // Add empty assistant message to update in place
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      outer: while (true) {
        const { done, value } = await reader.read()
        if (done) break outer
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') break outer
          try {
            const { text } = JSON.parse(data)
            if (text) {
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: updated[updated.length - 1].content + text,
                }
                return updated
              })
            }
          } catch {
            // skip malformed chunk
          }
        }
      }
    } catch {
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === 'assistant' && last.content === '') {
          return [...prev.slice(0, -1), { role: 'assistant', content: 'I apologise — something went wrong. Please try again.' }]
        }
        return [...prev, { role: 'assistant', content: 'I apologise — something went wrong. Please try again.' }]
      })
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Chat panel — shown when isOpen */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={panelRef}
                key="chat-panel"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-24 right-6 z-[999] w-[360px] max-w-[calc(100vw-3rem)] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
                style={{ maxHeight: 'min(600px, calc(100vh - 6rem))' }}
              >
                {/* Header */}
                <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C] flex-shrink-0" />
                  <span
                    className="text-white text-xs tracking-[0.2em] uppercase flex-1"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    IGYM Concierge
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-500 hover:text-white transition-colors text-lg leading-none"
                    aria-label="Close chat"
                  >
                    ×
                  </button>
                </div>

                {/* Messages */}
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {/* Welcome message — always shown */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%] bg-zinc-800 text-zinc-100 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 leading-relaxed">
                      Welcome to IGYM. How may I assist you today?
                    </div>
                  </div>

                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] text-sm px-4 py-2.5 leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-[#C9A84C] text-zinc-950 rounded-2xl rounded-tr-sm'
                            : 'bg-zinc-800 text-zinc-100 rounded-2xl rounded-tl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && messages[messages.length - 1]?.role === 'assistant' && messages[messages.length - 1]?.content === '' && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="border-t border-zinc-800 p-3 flex gap-2 flex-shrink-0">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => {
                      setInput(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    rows={1}
                    disabled={loading}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 px-3 py-2 resize-none focus:outline-none focus:border-[#C9A84C]/60 disabled:opacity-50 leading-relaxed [&::-webkit-scrollbar]:hidden"
                    style={{ minHeight: '2.5rem', maxHeight: '6rem', scrollbarWidth: 'none' }}
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={loading || !input.trim()}
                    className="bg-[#C9A84C] text-zinc-950 rounded-xl px-3 py-2 text-sm font-medium hover:bg-[#b8933d] transition-colors disabled:opacity-40 flex-shrink-0 self-end"
                    aria-label="Send message"
                  >
                    Send
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FAB button */}
          <motion.button
            ref={fabRef}
            key="chat-fab"
            onClick={() => setIsOpen(prev => !prev)}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isOpen
                ? 'bg-zinc-800 border border-[#C9A84C]/60'
                : 'bg-zinc-950 border border-zinc-700 hover:border-[#C9A84C]/40'
            }`}
            aria-label="Open IGYM chat"
          >
            {/* Chat bubble SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                fill={isOpen ? '#C9A84C' : 'white'}
              />
            </svg>
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}
