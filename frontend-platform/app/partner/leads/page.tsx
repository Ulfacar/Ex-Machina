'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IcoPlus } from '@/components/partner/icons'

const fmtSom = (n: number) => Math.round(n).toLocaleString('ru-RU') + ' сом'

const DEMO_LEADS = [
  { id: 1, hotel: 'Asia Mountains', city: 'Бишкек', status: 'new', commission: 21000, source: 'tg-link', days: 0 },
  { id: 2, hotel: 'Plaza Hotel Karakol', city: 'Каракол', status: 'demo', commission: 21000, source: 'wa-direct', days: 1 },
  { id: 3, hotel: 'Karagat Resort', city: 'Чолпон-Ата', status: 'testing', commission: 21000, source: 'tg-link', days: 3 },
  { id: 4, hotel: 'Damir Hotel', city: 'Бишкек', status: 'testing', commission: 21000, source: 'referral', days: 5 },
  { id: 5, hotel: 'Sary-Chelek Lodge', city: 'Джалал-Абад', status: 'paid', commission: 21000, source: 'tg-link', days: 12, paidAt: '20 апр' },
  { id: 6, hotel: 'Issyk-Kul Resort', city: 'Чолпон-Ата', status: 'paid', commission: 21000, source: 'wa-direct', days: 28, paidAt: '5 апр' },
  { id: 7, hotel: 'Discovery Hotel', city: 'Ош', status: 'lost', commission: 0, source: 'tg-link', days: 18, lostReason: 'Уже работают с конкурентом' },
]

const STATUS_LABELS: Record<string, string> = {
  new: 'Новый', demo: 'Демо отправлено', testing: 'Тестирует', paid: 'Подключён', lost: 'Отказ',
}

export default function LeadsPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const cols = ['new', 'demo', 'testing', 'paid', 'lost']

  return (
    <div className="p-page">
      <div className="p-page-head">
        <div>
          <h1>Мои лиды</h1>
          <div className="sub">Воронка от первого касания до подключения</div>
        </div>
        <div className="p-page-actions">
          <div className="chip-group">
            <button className={`chip ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>Воронка</button>
            <button className={`chip ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>Список</button>
          </div>
          <Link href="/partner/create" className="btn btn-primary"><IcoPlus />Новый лид</Link>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="kanban">
          {cols.map(c => {
            const list = DEMO_LEADS.filter(l => l.status === c)
            return (
              <div key={c} className="kanban-col">
                <div className="kanban-head">
                  <span>{STATUS_LABELS[c]}</span>
                  <span className="ct">{list.length}</span>
                </div>
                {list.map(l => (
                  <div key={l.id} className="lead-card">
                    <div className="h-name">{l.hotel}</div>
                    <div className="h-meta">{l.city} · {l.days === 0 ? 'сегодня' : `${l.days} дн`}</div>
                    <div className="h-foot">
                      <span className="src">{l.source}</span>
                      {l.status === 'paid' ? <span className="com">+{fmtSom(l.commission)}</span> :
                       l.status === 'lost' ? <span style={{ fontSize: 11, color: 'var(--p-ink-mute2)' }}>—</span> :
                       <span style={{ fontSize: 11, color: 'var(--p-ink-muted)' }}>{fmtSom(l.commission)}</span>}
                    </div>
                  </div>
                ))}
                {list.length === 0 && <div style={{ textAlign: 'center', color: 'var(--p-ink-mute2)', fontSize: 11.5, padding: '20px 0' }}>Пусто</div>}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead><tr>
              <th>Отель</th><th>Город</th><th>Источник</th><th>Возраст</th><th>Комиссия</th><th>Статус</th>
            </tr></thead>
            <tbody>
              {DEMO_LEADS.map(l => (
                <tr key={l.id}>
                  <td className="guest-name">{l.hotel}</td>
                  <td>{l.city}</td>
                  <td className="num">{l.source}</td>
                  <td>{l.days === 0 ? 'сегодня' : `${l.days} дн`}</td>
                  <td className="num">
                    {l.status === 'paid' ? fmtSom(l.commission) : l.status === 'lost' ? '—' :
                     <span style={{ color: 'var(--p-ink-muted)' }}>{fmtSom(l.commission)}</span>}
                  </td>
                  <td><span className={`pill ${l.status}`}>{STATUS_LABELS[l.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
