'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import type { HotelFormData } from '@/lib/types'

interface BotPreviewProps {
  formData: Partial<HotelFormData>
  hotelId?: number // If set: call /preview-chat/simulate against saved hotel. Else: /preview-chat with formData.
  fullscreen?: boolean
}

interface Message {
  role: 'user' | 'bot'
  content: string
}

const sampleQuestions = [
  'Сколько стоит номер?',
  'Какой адрес отеля?',
  'Какие услуги доступны?',
  'Время заезда?',
]

export function BotPreview({ formData, hotelId, fullscreen }: BotPreviewProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Здравствуйте! Чем могу помочь?' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendToBackend = async (question: string, history: Message[]): Promise<string> => {
    // Convert UI history → backend role names (bot → assistant), skip the static greeting.
    const apiHistory = history
      .slice(1)
      .map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content,
      }))

    if (hotelId) {
      const res = await api.post('/preview-chat/simulate', {
        hotel_id: hotelId,
        message: question,
        history: apiHistory,
        use_staging: false,
      })
      if (res.data?.error) throw new Error(res.data.error)
      return res.data.reply
    }

    // Wizard mode — hotel not saved yet. Build hotel_data from in-flight formData.
    const hotelData = {
      name: formData.name || '',
      description: formData.description || '',
      address: formData.address || '',
      phone: formData.phone || '',
      email: formData.email || '',
      website: formData.website || '',
      rooms: formData.rooms || [],
      rules: formData.rules || {},
      amenities: formData.amenities || {},
      communication_style: formData.communicationStyle || 'friendly',
      ai_model: formData.aiModel || 'anthropic/claude-3.5-haiku',
      languages: formData.languages || ['ru', 'en'],
    }
    const res = await api.post('/preview-chat', {
      message: question,
      hotel_data: hotelData,
      history: apiHistory,
    })
    return res.data.reply
  }

  const sendMessage = async (question: string) => {
    if (!question.trim() || isTyping) return

    const userMsg: Message = { role: 'user', content: question }
    const nextHistory = [...messages, userMsg]
    setMessages(nextHistory)
    setInput('')
    setIsTyping(true)

    try {
      const reply = await sendToBackend(question, nextHistory)
      setMessages([...nextHistory, { role: 'bot', content: reply }])
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        (err as Error)?.message ||
        'Ошибка соединения. Попробуйте ещё раз.'
      setMessages([...nextHistory, { role: 'bot', content: `⚠️ ${detail}` }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSend = () => {
    void sendMessage(input)
  }

  const handleQuickQuestion = (question: string) => {
    void sendMessage(question)
  }

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A]">
      <div className="p-4 border-b border-[#262626] bg-[#141414]">
        <h3 className="font-medium text-[#FAFAFA] flex items-center gap-2">
          <span>📱</span> Предпросмотр бота
        </h3>
        <p className="text-xs text-[#A3A3A3] mt-1">
          Обновляется в реальном времени
        </p>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#1A1A1A] text-[#FAFAFA] border border-[#262626]'
                  : 'bg-[#3B82F6] text-white'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#3B82F6] text-white px-4 py-2.5 rounded-2xl text-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions */}
      <div className="px-4 py-2 border-t border-[#262626] bg-[#141414]">
        <div className="text-xs text-[#A3A3A3] mb-2">Быстрые вопросы:</div>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleQuickQuestion(q)}
              disabled={isTyping}
              className="text-xs px-3 py-1.5 rounded-full border border-[#262626] text-[#A3A3A3] hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#262626] bg-[#141414]">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите вопрос..."
            disabled={isTyping}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} size="sm" disabled={isTyping || !input.trim()}>
            →
          </Button>
        </div>
      </div>
    </div>
  )
}
