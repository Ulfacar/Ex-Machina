'use client'

import { IcoCheck, IcoPlus } from '@/components/cabinet/icons'

export default function IntegrationsPage() {
  const groups = [
    { title: 'Каналы', items: [
      { name: 'WhatsApp Business API', desc: 'Основной канал для гостей', on: true, hue: 150 },
      { name: 'Telegram Bot API', desc: 'Второй по популярности', on: true, hue: 240 },
      { name: 'Instagram DM', desc: 'Через Meta Business', on: false, hue: 330 },
    ]},
    { title: 'PMS / системы управления', items: [
      { name: 'Bnovo', desc: 'Двусторонняя синхронизация номеров и броней', on: true, hue: 264 },
      { name: 'TravelLine', desc: 'Синхронизация прайсов', on: false, hue: 30 },
      { name: 'Frontdesk24', desc: 'PMS для небольших отелей', on: false, hue: 200 },
    ]},
    { title: 'OTA-агрегаторы', items: [
      { name: 'Booking.com', desc: 'Импорт календаря, запрет двойных броней', on: true, hue: 220 },
      { name: 'Ostrovok.ru', desc: 'Импорт календаря', on: false, hue: 10 },
      { name: 'Airbnb', desc: 'Импорт календаря', on: false, hue: 350 },
    ]},
  ]

  return (
    <div className="cab-page">
      <div className="cab-page-head">
        <div>
          <h1>Интеграции</h1>
          <div className="sub">Подключите системы, которыми вы уже пользуетесь — бот будет работать с ними напрямую</div>
        </div>
      </div>

      {groups.map((g, gi) => (
        <div key={gi} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-ink-muted)', margin: '0 0 10px', fontWeight: 500 }}>{g.title}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {g.items.map((it, i) => (
              <div key={i} className="c-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `oklch(0.95 0.04 ${it.hue})`, color: `oklch(0.45 0.16 ${it.hue})`, display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                    {it.name.split(/[\s.]+/).slice(0, 2).map(p => p[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--c-ink-muted)', marginTop: 2 }}>{it.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--c-line-soft)' }}>
                  <span className={`c-status-pill ${it.on ? 'confirmed' : 'human'}`}>{it.on ? 'Подключено' : 'Не подключено'}</span>
                  <button className={it.on ? 'c-btn c-btn-ghost' : 'c-btn c-btn-outline'}>{it.on ? 'Настроить' : 'Подключить'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
