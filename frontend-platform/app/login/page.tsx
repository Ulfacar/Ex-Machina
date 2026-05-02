'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Zap, Shield, Hotel, Users } from 'lucide-react'
import api from '@/lib/api'

function getRedirectByRole(role: string) {
  switch (role) {
    case 'admin': return '/dashboard'
    case 'sales': return '/sales'
    case 'client': return '/cabinet'
    default: return '/cabinet'
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const doLogin = async (loginEmail: string, loginPassword: string) => {
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/auth/login', { email: loginEmail, password: loginPassword })
      localStorage.setItem('token', response.data.access_token)
      const me = await api.get('/auth/me').catch(() => null)
      router.push(getRedirectByRole(me?.data?.role))
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка входа')
    } finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await doLogin(email, password)
  }

  const quickLogin = async (role: string) => {
    const creds: Record<string, [string, string]> = {
      admin: ['admin@exmachine.ai', 'admin123'],
      sales: ['partner@exmachine.ai', 'partner123'],
      client: ['demo@asystem.com', 'demo123'],
    }
    const [e, p] = creds[role]
    setEmail(e)
    setPassword(p)
    await doLogin(e, p)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-[#3B82F6]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 text-lg font-medium tracking-tighter mb-2 text-[#FAFAFA]">
            <div className="w-8 h-8 bg-[#FAFAFA] rounded-lg flex items-center justify-center text-[#0A0A0A] text-xs font-semibold tracking-tighter">
              EM
            </div>
            Ex<span className="text-[#3B82F6]">-Machina</span>
          </div>
          <p className="text-[#737373] text-sm">AI-боты для отелей</p>
        </div>

        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Вход</CardTitle>
            <CardDescription>Введите email и пароль</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2.5 rounded-md text-sm animate-scale-in">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
              </Button>

              <div className="pt-2 border-t border-[#1F1F1F]">
                <p className="text-[#737373] text-xs text-center mb-3">Быстрый вход (демо)</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button type="button" variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-2.5 text-[10px]" onClick={() => quickLogin('admin')} disabled={loading}>
                    <Shield size={14} />
                    Админ
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-2.5 text-[10px]" onClick={() => quickLogin('sales')} disabled={loading}>
                    <Users size={14} />
                    Партнёр
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-2.5 text-[10px]" onClick={() => quickLogin('client')} disabled={loading}>
                    <Hotel size={14} />
                    Отельер
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-[#737373]">
                Нет аккаунта?{' '}
                <Link href="/register" className="text-[#3B82F6] font-medium hover:underline">Регистрация</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
