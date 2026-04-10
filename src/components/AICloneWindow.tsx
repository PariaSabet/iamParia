import { useState, useRef, useEffect } from 'react'
import { WindowModal } from './WindowModal'
import aiCloneIcon from '../assets/icons/ai.png'

interface Message {
  sender: 'user' | 'ai'
  text: string
  timestamp: Date
}

interface AICloneWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  isMinimized?: boolean
  minimizeTargetRect?: DOMRect | null
}

const WELCOME_MESSAGE =
  "Hey! I'm Paria's AI clone. Ask me anything about her projects, skills, or interests!"

const SUGGESTION_CHIPS = [
  'What projects have you worked on?',
  'Tell me about yourself',
  "What's your tech stack?",
  'What are your hobbies?',
]

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function AiAvatar({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 'w-8 h-8' : 'w-6 h-6'
  const iconDim = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-[#4A90D9] to-[#1B3E8F] flex items-center justify-center shrink-0 shadow-sm`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`${iconDim} text-white`}
        fill="currentColor"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mt-3">
      <AiAvatar />
      <div className="bg-[#D6E6F6] border border-[#B7CBE4] rounded-xl rounded-bl-sm px-3 py-2 shadow-sm">
        <div className="flex gap-1 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#5A7FA8]"
              style={{
                animation: 'typingBounce 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MsnToolbar() {
  const buttons = [
    {
      label: 'Font',
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
          <path d="M2 13h2l1.5-4h5L12 13h2L9.5 3h-3L2 13zm4.5-6L8 3.5 9.5 7h-3z" />
        </svg>
      ),
    },
    {
      label: 'Emoticons',
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5A5.5 5.5 0 1113.5 8 5.51 5.51 0 018 13.5zM6.25 6.5a1 1 0 11-2 0 1 1 0 012 0zm5.5 0a1 1 0 11-2 0 1 1 0 012 0zM8 11.5c-1.84 0-3.15-1.1-3.36-2.5h6.72c-.21 1.4-1.52 2.5-3.36 2.5z" />
        </svg>
      ),
    },
    {
      label: 'Nudge',
      icon: (
        <svg
          viewBox="0 0 16 16"
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        >
          <path d="M3 8h2l1.5-3 2 6 1.5-3H13" />
        </svg>
      ),
    },
    {
      label: 'Webcam',
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
          <path d="M2 4a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1V9.5l3 2V4.5l-3 2V5a1 1 0 00-1-1H2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="shrink-0 bg-[#F1EFE2] border-t border-[#ACA899] border-b border-b-[#D4D0C8] px-2 py-0.5 flex items-center gap-0.5">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          title={btn.label}
          className="flex items-center justify-center w-7 h-6 text-[#555] rounded-sm border border-transparent hover:border-[#C0C0C0] hover:bg-gradient-to-b hover:from-[#FAFAFA] hover:to-[#E8E8E8] active:bg-[#D8D8D8] active:border-[#999] transition-colors"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  )
}

function SignInScreen({
  onAuthenticated,
}: {
  onAuthenticated: () => void
}) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (passcode === '1234') {
      onAuthenticated()
    } else {
      setError('The passcode you entered is incorrect. Please try again.')
      setPasscode('')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#D3E5FA] to-[#B9D1EA]">
      <div className="bg-gradient-to-r from-[#1B3E8F] via-[#2D62B3] to-[#4A90D9] px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-white"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <span className="text-white text-lg font-bold tracking-wide">
            Paria's Messenger
          </span>
        </div>
        <p className="text-blue-100 text-xs">Sign in to chat with AI Paria</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md border border-[#A0B8D0] w-full max-w-xs p-5">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4A90D9] to-[#1B3E8F] flex items-center justify-center mb-2 shadow-md">
              <svg
                viewBox="0 0 24 24"
                className="w-9 h-9 text-white"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[#333]">
              Paria (AI Clone)
            </span>
            <span className="text-xs text-[#666]">Online</span>
          </div>

          <label className="block text-xs text-[#333] mb-1 font-semibold">
            Passcode:
          </label>
          <input
            ref={inputRef}
            type="password"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
            maxLength={9}
            className="w-full px-2 py-1.5 text-sm border border-[#7F9DB9] rounded-sm bg-white text-[#333] outline-none focus:border-[#3C7FB1] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"
            placeholder="Enter passcode"
          />

          {error && (
            <div className="mt-2 bg-[#FFF4CE] border border-[#E5C100] rounded px-2 py-1.5 flex items-start gap-1.5">
              <svg
                viewBox="0 0 16 16"
                className="w-4 h-4 text-[#C09200] shrink-0 mt-0.5"
                fill="currentColor"
              >
                <path d="M8 1L1 14h14L8 1zm0 3.5l4.5 8h-9L8 4.5zM7.25 7v3h1.5V7h-1.5zm0 4v1.5h1.5V11h-1.5z" />
              </svg>
              <span className="text-xs text-[#333]">{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="mt-4 w-full py-1.5 text-sm font-semibold text-[#333] bg-gradient-to-b from-[#F5F5F5] to-[#DCDCDC] border border-[#999] rounded-sm shadow-sm hover:from-[#E8E8E8] hover:to-[#D0D0D0] active:from-[#D0D0D0] active:to-[#C0C0C0] active:shadow-inner"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

function MessengerChat({
  onMessageCountChange,
}: {
  onMessageCountChange: (count: number) => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: WELCOME_MESSAGE, timestamp: new Date() },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showChips, setShowChips] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    onMessageCountChange(messages.length)
  }, [messages.length, onMessageCountChange])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setShowChips(false)

    const userMsg: Message = {
      sender: 'user',
      text: trimmed,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))

      const response = await fetch(
        'https://aicloneofparia.netlify.app/.netlify/functions/api',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: trimmed, history }),
        }
      )

      if (!response.ok) throw new Error('Failed to fetch AI response')

      const data = await response.json()
      const aiMsg: Message = {
        sender: 'ai',
        text: data.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      console.error('Error fetching AI response:', error)
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "Sorry, I couldn't respond right now. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleSend = () => sendMessage(input)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 80) + 'px'
  }

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8]">
      {/* Contact bar */}
      <div className="shrink-0 bg-gradient-to-r from-[#D6E6F6] to-[#B7D3EE] border-b border-[#8CADD6] px-3 py-1.5 flex items-center gap-2">
        <AiAvatar size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[#1B3E8F] truncate">
              Paria (AI Clone)
            </span>
            <span className="w-2 h-2 rounded-full bg-[#5CB85C] shrink-0" />
          </div>
          <span className="text-[10px] text-[#555] block">Online</span>
        </div>
      </div>

      {/* Chat history */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-white border-x border-[#ACA899]">
        <div className="p-3 space-y-0.5">
          {messages.map((msg, i) => {
            const isUser = msg.sender === 'user'
            const isLastInGroup =
              i === messages.length - 1 || messages[i + 1].sender !== msg.sender

            return (
              <div key={i}>
                {isUser ? (
                  <div className="flex justify-end mt-2">
                    <div className="max-w-[80%]">
                      <div className="bg-[#DCF8C6] border border-[#C5E1A5] rounded-xl rounded-br-sm px-3 py-2 shadow-sm">
                        <p className="text-sm text-[#333] whitespace-pre-wrap break-words leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                      {isLastInGroup && (
                        <p className="text-[10px] text-[#999] mt-0.5 text-right pr-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end gap-2 mt-2">
                    <AiAvatar />
                    <div className="max-w-[80%]">
                      <div className="bg-[#D6E6F6] border border-[#B7CBE4] rounded-xl rounded-bl-sm px-3 py-2 shadow-sm">
                        <p className="text-sm text-[#333] whitespace-pre-wrap break-words leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                      {isLastInGroup && (
                        <p className="text-[10px] text-[#999] mt-0.5 pl-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Suggestion chips */}
          {showChips && !loading && (
            <div className="flex flex-wrap gap-1.5 mt-3 pl-8">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-3 py-1.5 text-xs font-medium text-[#1B3E8F] bg-[#EAF1FA] border border-[#B7CBE4] rounded-full shadow-sm hover:bg-[#D6E6F6] hover:border-[#8CADD6] active:bg-[#C4D9F0] transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {loading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* MSN-style toolbar */}
      <MsnToolbar />

      {/* Input area */}
      <div className="shrink-0 bg-[#ECE9D8] border-t border-[#ACA899] p-2">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={handleTextareaInput}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
            className="flex-1 px-2 py-1.5 text-sm border border-[#7F9DB9] rounded-sm bg-white text-[#333] outline-none focus:border-[#3C7FB1] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] resize-none overflow-hidden"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="shrink-0 px-4 py-1.5 text-sm font-semibold text-[#333] bg-gradient-to-b from-[#F5F5F5] to-[#DCDCDC] border border-[#999] rounded-sm shadow-sm hover:from-[#E8E8E8] hover:to-[#D0D0D0] active:from-[#D0D0D0] active:to-[#C0C0C0] active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <div className="text-[10px] text-[#999] mt-1 px-0.5">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}

export function AICloneWindow({
  isOpen,
  onClose,
  onMinimize,
  isMinimized = false,
  minimizeTargetRect = null,
}: AICloneWindowProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [messageCount, setMessageCount] = useState(0)

  const statusText = isAuthenticated
    ? messageCount === 1
      ? '1 message'
      : `${messageCount} messages`
    : 'Not signed in'

  return (
    <WindowModal
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      isMinimized={isMinimized}
      minimizeTargetRect={minimizeTargetRect}
      title="Paria's Messenger"
      icon={aiCloneIcon}
      statusText={statusText}
      showExplorerChrome={false}
    >
      <div className="flex flex-col h-full min-h-0">
        {isAuthenticated ? (
          <MessengerChat onMessageCountChange={setMessageCount} />
        ) : (
          <SignInScreen onAuthenticated={() => setIsAuthenticated(true)} />
        )}
      </div>
    </WindowModal>
  )
}
