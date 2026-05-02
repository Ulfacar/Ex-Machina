'use client'

import Link from 'next/link'
import { IcoSpark, IcoArrow, IcoUp } from '@/components/partner/icons'

const fmtSom = (n: number) => Math.round(n).toLocaleString('ru-RU') + ' сом'
const fmtUSD = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

const DEMO_LEADS = [
  { id: 1, hotel: 'Asia Mountains', city: 'Бишкек', status: 'new', commission: 21000, source: 'tg-link', days: 0 },
  { id: 2, hotel: 'Plaza Hotel Karakol', city: 'Каракол', status: 'demo', commission: 21000, source: 'wa-direct', days: 1 },
  { id: 3, hotel: 'Karagat Resort', city: 'Чолпон-Ата', status: 'testing', commission: 21000, source: 'tg-link', days: 3 },
  { id: 4, hotel: 'Damir Hotel', city: 'Бишкек', status: 'testing', commission: 21000, source: 'referral', days: 5 },
  { id: 5, hotel: 'Sary-Chelek Lodge', city: 'Джалал-Абад', status: 'paid', commission: 21000, source: 'tg-link', days: 12, paidAt: '20 апр' },
]

const STATUS_LABELS: Record<string, string> = {
  new: 'Новый', demo: 'Демо отправлено', testing: 'Тестирует', paid: 'Подключён', lost: 'Отказ',
}

function Kpi({ v, l, delta, up, tone = 'primary' }: { v: number; l: string; delta: string; up?: boolean; tone?: string }) {
  const colorMap: Record<string, string> = {
    primary: 'var(--p-primary-bright)',
    warn: 'var(--p-warn)',
    green: 'var(--p-accent)',
  }
  return (
    <div className="kpi-card">
      <div className="v" style={{ color: colorMap[tone] }}>{v}</div>
      <div className="l">{l}</div>
      {delta && <div className={`d ${up ? 'up' : ''}`}>{up && <IcoUp style={{ width: 10, height: 10 }} />}{delta}</div>}
    </div>
  )
}

export default function PartnerHome() {
  const total = DEMO_LEADS.length
  const newC = DEMO_LEADS.filter(l => l.status === 'new').length
  const active = DEMO_LEADS.filter(l => ['demo', 'testing'].includes(l.status)).length
  const paid = DEMO_LEADS.filter(l => l.status === 'paid').length
  const recent = DEMO_LEADS.slice(0, 5)

  return (
    <div className="p-page">
      <div className="p-page-head">
        <div>
          <h1>Привет, Partner</h1>
          <div className="sub">Покажите клиенту живое демо за 30 секунд — и получите 30% с подключения.</div>
        </div>
      </div>

      <Link href="/partner/create" className="hero-card">
        <div>
          <div className="hero-eyebrow"><IcoSpark style={{ width: 12, height: 12 }} />Новая демонстрация</div>
          <h2>Создать бота клиенту</h2>
          <p>Можно заполнить демо-данными отеля одной кнопкой — покажете бота меньше чем за минуту. Сразу получите ссылку для отправки в WhatsApp или Telegram.</p>
        </div>
        <div className="go-btn"><IcoArrow /></div>
      </Link>

      <div className="kpi-row">
        <Kpi v={total} l="Всего лидов" delta="+2 за неделю" up tone="primary" />
        <Kpi v={newC} l="Ожидают" delta="требуют внимания" tone="warn" />
        <Kpi v={active} l="Активных" delta="на демо/тесте" up tone="primary" />
        <Kpi v={paid} l="Подключённых" delta={fmtUSD(paid * 700)} up tone="green" />
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h3>Последние лиды</h3>
            <div className="sub">Отели, которым вы создали демо за последние 30 дней</div>
          </div>
          <Link href="/partner/leads" className="btn btn-ghost">Все<IcoArrow style={{ width: 12, height: 12 }} /></Link>
        </div>
        <table className="tbl">
          <thead><tr>
            <th>Отель</th><th>Источник</th><th>Возраст</th><th>Комиссия</th><th>Статус</th>
          </tr></thead>
          <tbody>
            {recent.map(l => (
              <tr key={l.id} style={{ cursor: 'pointer' }}>
                <td>
                  <div className="guest-name">{l.hotel}</div>
                  <div className="meta">{l.city}</div>
                </td>
                <td><span className="num">{l.source}</span></td>
                <td>{l.days === 0 ? 'сегодня' : `${l.days} дн назад`}</td>
                <td className="num">
                  {l.status === 'paid' ? fmtSom(l.commission) : (
                    <span style={{ color: 'var(--p-ink-muted)' }}>{fmtSom(l.commission)} ожидаемая</span>
                  )}
                </td>
                <td><span className={`pill ${l.status}`}>{STATUS_LABELS[l.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
