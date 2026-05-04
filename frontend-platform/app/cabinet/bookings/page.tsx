'use client'

import { useState } from 'react'
import { IcoDownload, IcoPlus, IcoChev, IcoSearch } from '@/components/cabinet/icons'

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU') + ' сом'

const BOOKINGS = [
  { id: 'A-2841', guest: 'Ольга Морозова', initials: 'ОМ', room: 'Делюкс с видом', in: '14 мар', out: '17 мар', n: 3, price: 25200, ch: 'wa', status: 'confirmed', source: 'Бот' },
  { id: 'A-2840', guest: 'Анна Петрова', initials: 'АП', room: 'Стандарт', in: '12 мар', out: '14 мар', n: 2, price: 19200, ch: 'wa', status: 'confirmed', source: 'Бот' },
  { id: 'A-2839', guest: 'Talant Bekov', initials: 'ТБ', room: 'Сьют', in: '5 мар', out: '7 мар', n: 2, price: 36400, ch: 'tg', status: 'confirmed', source: 'Бот' },
  { id: 'A-2838', guest: 'Дмитрий Соколов', initials: 'ДС', room: 'Делюкс', in: '20 мар', out: '23 мар', n: 3, price: 37200, ch: 'wa', status: 'pending', source: 'Бот' },
  { id: 'A-2837', guest: 'Maria Lopez', initials: 'ML', room: 'Сьют', in: '1 апр', out: '5 апр', n: 4, price: 72800, ch: 'wa', status: 'pending', source: 'Менеджер' },
  { id: 'A-2836', guest: 'Erlan Tashiev', initials: 'ЕТ', room: 'Стандарт', in: '8 мар', out: '10 мар', n: 2, price: 19200, ch: 'tg', status: 'confirmed', source: 'Бот' },
  { id: 'A-2835', guest: 'Артём Кузнецов', initials: 'АК', room: 'Делюкс с видом', in: '14 мар', out: '17 мар', n: 3, price: 37200, ch: 'wa', status: 'confirmed', source: 'Бот' },
  { id: 'A-2834', guest: 'Айнура Жумабекова', initials: 'АЖ', room: 'Стандарт', in: '10 мар', out: '11 мар', n: 1, price: 9600, ch: 'tg', status: 'cancelled', source: 'Бот' },
  { id: 'A-2833', guest: 'Сергей Иванов', initials: 'СИ', room: 'Сьют', in: '25 мар', out: '29 мар', n: 4, price: 72800, ch: 'wa', status: 'confirmed', source: 'Менеджер' },
  { id: 'A-2832', guest: 'Yulia Park', initials: 'YP', room: 'Делюкс', in: '15 мар', out: '18 мар', n: 3, price: 37200, ch: 'tg', status: 'confirmed', source: 'Бот' },
  { id: 'A-2831', guest: 'Бекжан Алиев', initials: 'БА', room: 'Стандарт', in: '9 мар', out: '10 мар', n: 1, price: 9600, ch: 'wa', status: 'confirmed', source: 'Бот' },
]

export default function BookingsPage() {
  const [filter, setFilter] = useState('all')
  const list = BOOKINGS.filter((b) => filter === 'all' ? true : b.status === filter)
  const total = list.reduce((s, b) => s + (b.status !== 'cancelled' ? b.price : 0), 0)

  return (
    <div className="cab-page">
      <div className="cab-page-head">
        <div>
          <h1>Брони</h1>
          <div className="sub">{list.length} бронирований · {fmt(total)} оборота</div>
        </div>
        <div className="cab-page-actions">
          <button className="c-btn c-btn-outline"><IcoDownload style={{ width: 14, height: 14 }} />Экспорт CSV</button>
          <button className="c-btn c-btn-primary"><IcoPlus style={{ width: 14, height: 14 }} />Новая бронь</button>
        </div>
      </div>

      <div className="c-card">
        <div className="filter-bar">
          {[
            ['all', 'Все', BOOKINGS.length],
            ['confirmed', 'Подтверждённые', BOOKINGS.filter(b => b.status === 'confirmed').length],
            ['pending', 'Ожидают', BOOKINGS.filter(b => b.status === 'pending').length],
            ['cancelled', 'Отменённые', BOOKINGS.filter(b => b.status === 'cancelled').length],
          ].map(([k, label, n]) => (
            <button key={k as string} className={`filter-chip ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k as string)}>
              {label as string} <span style={{ opacity: 0.6, marginLeft: 4 }}>{n as number}</span>
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--c-ink-muted)', fontSize: 12 }}>
            <IcoSearch style={{ width: 14, height: 14 }} />
            <input className="c-input" placeholder="Поиск по номеру брони, гостю..." style={{ padding: '5px 10px', fontSize: 12, width: 220 }} />
          </div>
        </div>
        <table className="c-table">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Гость</th>
              <th>Номер / даты</th>
              <th>Источник</th>
              <th>Статус</th>
              <th style={{ textAlign: 'right' }}>Сумма</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id}>
                <td className="num">{b.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(155deg, var(--c-primary-bright), var(--c-primary-deep))', color: 'white', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>{b.initials}</div>
                    <div>
                      <div className="guest-name">{b.guest}</div>
                      <div className="meta"><span className={`ch-pill ${b.ch}`}>● {b.ch === 'wa' ? 'WhatsApp' : 'Telegram'}</span></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{b.room}</div>
                  <div className="meta">{b.in} → {b.out} · {b.n} ноч.</div>
                </td>
                <td><span style={{ fontSize: 12, color: 'var(--c-ink-soft)' }}>{b.source}</span></td>
                <td><span className={`c-status-pill ${b.status}`}>{b.status === 'confirmed' ? 'Подтверждена' : b.status === 'pending' ? 'Ожидает' : 'Отменена'}</span></td>
                <td className="num" style={{ textAlign: 'right', fontWeight: 500 }}>{fmt(b.price)}</td>
                <td><button className="c-btn c-btn-ghost" style={{ padding: '4px 8px' }}><IcoChev style={{ width: 14, height: 14 }} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
