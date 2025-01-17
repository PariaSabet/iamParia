import { useState, useEffect, useRef } from 'react'
import OpenAI from 'openai'

export function Chatbot() {
  const openaiRef = useRef(
    new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  )
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchInitialResponse = async () => {
      const response11 = await openaiRef.current.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-4o-mini',
      })
      console.log(response11)
    }

    fetchInitialResponse()
  }, [])

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = `User: ${input}`
      setMessages([...messages, userMessage])
      setInput('')
      setLoading(true)

      try {
        const response = await fetch('http://localhost:3000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: input }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch AI response')
        }

        const data = await response.json()
        const aiMessage = `AI: ${data.response}`

        setMessages((prevMessages) => [...prevMessages, aiMessage])
      } catch (error) {
        console.error('Error fetching AI response:', error)
        setMessages((prevMessages) => [
          ...prevMessages,
          'AI: Sorry, something went wrong.',
        ])
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="chatbot-container border p-4 rounded shadow-lg">
      <div className="messages overflow-y-auto h-64 mb-2">
        {messages.map((msg, index) => (
          <div key={index} className="message mb-1">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-area flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border p-2 rounded"
          placeholder="Type a message..."
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
