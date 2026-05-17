import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Send, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
}

type ChatbotProps = {
  isOpen: boolean
  onClose: () => void
  onAssistantReply?: () => void
}

const WELCOME_MESSAGE =
  'Halo, aku EcoSort Assistant. Tanya apa saja seputar jenis sampah, cara memilah, dan tips daur ulang.'

const Chatbot = ({ isOpen, onClose, onAssistantReply }: ChatbotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: WELCOME_MESSAGE }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      const data = await res.json()
      const answer =
        data?.status === 'success'
          ? data?.data?.answer
          : 'Maaf, respons belum tersedia. Coba ulangi pertanyaanmu.'

      setMessages((prev) => [...prev, { role: 'assistant', text: answer || 'Maaf, terjadi kesalahan.' }])
      onAssistantReply?.()
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Koneksi bermasalah. Coba lagi beberapa saat.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-24 right-6 z-50 w-[22rem] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <div>
              <p className="text-sm font-bold">EcoSort Assistant</p>
              <p className="text-[11px] opacity-90">Edukasi Sampah</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Tutup chatbot">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-3 space-y-3 bg-background">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-xs text-muted-foreground">EcoSort sedang mengetik...</div>}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-border flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya soal sampah..."
              className="flex-1 h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-10 w-10 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 inline-flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Chatbot
