'use client'

import { useMemo } from 'react'
import { IcoInbox, IcoBook, IcoStar, IcoBot, IcoUp, IcoCheck, IcoBell, IcoTeam, IcoChev, IcoDownload, IcoPlus } from '@/components/cabinet/icons'
import Sparkline from '@/components/cabinet/Sparkline'

function useCount(to: number, dur = 1200) {
  // Simple static render for now — animation can be added later
  return to
}

function ActivityRow({ ico, Icon, body, meta, t }: { ico: string, Icon: React.FC<any>, body: React.ReactNode, meta: string, t: string }) {
  return (
    <div className="c-activity-row">
      <div className={`ico ${ico}`}><Icon style={{ width: 14, height: 14 }} /></div>
      <div className="body">{body}<div className="meta">{meta}</div></div>
      <div className="time">{t}</div>
    </div>
  )
}

function DialogChart() {
  const data = useMemo(() => {
    const arr = []
    for (let h = 0; h < 24; h++) {
      const dayBoost = h >= 9 && h <= 21 ? 1 : 0.4
      const eveBoost = h >= 19 || h <= 2 ? 1.5 : 1
      const bot = Math.round((3 + 2) * dayBoost * eveBoost)
      const hum = h >= 10 && h <= 19 ? Math.round(1) : 0
      arr.push({ h, bot, hum })
    }
    return arr
  }, [])
  const max = Math.max(...data.map(d => d.bot + d.hum))
  const w = 660, ch = 180
  const bw = w / 24 - 4

  return (
    <svg viewBox={`0 0 ${w} ${ch + 22}`} preserveAspectRatio="none" style={{ width: '100%', height: 200 }}>
      {[0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1="0" x2={w} y1={ch - ch * p} y2={ch - ch * p}
              stroke="var(--c-line-soft)" strokeDasharray={p === 1 ? '0' : '2 4'} />
      ))}
      {data.map((d, i) => {
        const x = i * (w / 24) + 2
        const botH = (d.bot / max) * ch
        const humH = (d.hum / max) * ch
        return (
          <g key={i}>
            <rect x={x} y={ch - botH} width={bw} height={botH} rx="2" fill="oklch(0.58 0.18 264)" />
            <rect x={x} y={ch - botH - humH} width={bw} height={humH} rx="2" fill="oklch(0.62 0.16 150)" />
          </g>
        )
      })}
      {[0, 6, 12, 18, 23].map((h) => (
        <text key={h} x={h * (w / 24) + bw / 2} y={ch + 14}
              fontSize="10" fill="var(--c-ink-muted)" fontFamily="JetBrains Mono"
              textAnchor="middle">
          {String(h).padStart(2, '0')}:00
        </text>
      ))}
    </svg>
  )
}

function TopQuestions() {
  const items = [
    { q: 'Есть ли свободные номера на дату X?', n: 38, p: 100 },
    { q: 'Сколько стоит ночь?', n: 31, p: 82 },
    { q: 'Можно ли с животными?', n: 22, p: 58 },
    { q: 'Как добраться от Бишкека?', n: 18, p: 47 },
    { q: 'Включён ли завтрак?', n: 14, p: 37 },
    { q: 'Есть ли парковка?', n: 9, p: 24 },
  ]
  return (
    <div style={{ padding: '8px 0' }}>
      {items.map((it, i) => (
        <div key={i} style={{ padding: '10px 18px', borderBottom: '1px solid var(--c-line-soft)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
            <span>{it.q}</span>
            <span style={{ color: 'var(--c-ink-muted)', fontFamily: 'JetBrains Mono', fontSize: 11.5 }}>{it.n}</span>
          </div>
          <div style={{ height: 4, background: 'var(--c-line-soft)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: it.p + '%', background: 'linear-gradient(90deg, oklch(0.58 0.18 264), oklch(0.62 0.16 150))' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU') + ' сом'

export default function CabinetDashboard() {
  const sparkA = [12, 14, 11, 16, 18, 15, 22, 20, 26, 24, 28, 31]
  const sparkB = [3, 4, 5, 4, 6, 8, 7, 9, 11, 10, 13, 14]
  const sparkC = [180, 220, 200, 260, 240, 300, 320, 280, 340, 360, 330, 410]
  const sparkD = [8, 9, 10, 12, 11, 13, 14, 13, 15, 14, 15, 14.7]

  return (
    <div className="cab-page">
      <div className="cab-page-head">
        <div>
          <h1>Дашборд</h1>
          <div className="sub">Сводка за последние 30 дней. Сравнение с предыдущим периодом.</div>
        </div>
        <div className="cab-page-actions">
          <button className="c-btn c-btn-outline"><IcoDownload style={{ width: 14, height: 14 }} />Экспорт</button>
          <button className="c-btn c-btn-primary"><IcoPlus style={{ width: 14, height: 14 }} />Новый диалог</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-label"><IcoInbox style={{ width: 14, height: 14 }} />Диалогов</div>
          <div className="kpi-value">143</div>
          <div className="kpi-delta up"><IcoUp style={{ width: 12, height: 12 }} />+18% к прошлому месяцу</div>
          <div className="kpi-spark"><Sparkline data={sparkA} color="oklch(0.58 0.18 264)" /></div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><IcoBook style={{ width: 14, height: 14 }} />Бронирований</div>
          <div className="kpi-value">21</div>
          <div className="kpi-delta up"><IcoUp style={{ width: 12, height: 12 }} />+5 vs прошлый месяц</div>
          <div className="kpi-spark"><Sparkline data={sparkB} color="oklch(0.62 0.16 150)" /></div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><IcoStar style={{ width: 14, height: 14 }} />Выручка</div>
          <div className="kpi-value">{fmt(248400)}</div>
          <div className="kpi-delta up"><IcoUp style={{ width: 12, height: 12 }} />+24% к прошлому месяцу</div>
          <div className="kpi-spark"><Sparkline data={sparkC} color="oklch(0.62 0.16 150)" /></div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><IcoBot style={{ width: 14, height: 14 }} />Конверсия</div>
          <div className="kpi-value">14.7<span className="unit">%</span></div>
          <div className="kpi-delta up"><IcoUp style={{ width: 12, height: 12 }} />+1.2 пп</div>
          <div className="kpi-spark"><Sparkline data={sparkD} color="oklch(0.58 0.18 264)" /></div>
        </div>
      </div>

      <div className="cab-cols-2" style={{ marginBottom: 16 }}>
        <div className="c-card" style={{ padding: 0 }}>
          <div className="c-card-head">
            <div>
              <h3>Диалоги по часам</h3>
              <div className="sub">Когда гости пишут вам — сегодня</div>
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 11.5, color: 'var(--c-ink-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: 'oklch(0.58 0.18 264)' }} />Бот
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--c-accent)' }} />Менеджер
              </span>
            </div>
          </div>
          <div style={{ padding: '20px 18px 16px' }}>
            <DialogChart />
          </div>
        </div>
        <div className="c-card">
          <div className="c-card-head">
            <div><h3>Топ-вопросы недели</h3><div className="sub">Что чаще всего спрашивают</div></div>
          </div>
          <div className="c-card-body" style={{ padding: 0 }}>
            <TopQuestions />
          </div>
        </div>
      </div>

      <div className="c-card">
        <div className="c-card-head">
          <div><h3>Лента активности</h3><div className="sub">Последние действия бота и команды</div></div>
          <a href="/cabinet/inbox" className="c-btn c-btn-ghost">Все события <IcoChev style={{ width: 12, height: 12 }} /></a>
        </div>
        <div className="c-activity">
          <ActivityRow ico="bot" Icon={IcoBot} t="14:32" body={<><strong>Бот ответил</strong> Артёму К. — уточнил наличие Делюкса на 14–17 марта</>} meta="WhatsApp · 1.4с" />
          <ActivityRow ico="book" Icon={IcoCheck} t="14:18" body={<><strong>Новая бронь A-2841</strong> — Делюкс с видом, 3 ночи</>} meta={`Ольга М. · ${fmt(25200)}`} />
          <ActivityRow ico="alert" Icon={IcoBell} t="13:54" body={<><strong>Эскалация менеджеру</strong> — гость просит скидку 15%</>} meta="Ожидает ответа · 28 мин" />
          <ActivityRow ico="bot" Icon={IcoBot} t="13:41" body={<><strong>Бот ответил</strong> Дмитрию С. — отправил фото номеров и цены</>} meta="Telegram · 2.1с" />
          <ActivityRow ico="guest" Icon={IcoTeam} t="13:22" body={<><strong>Гость заехал</strong> — Талант Б., бронь A-2839</>} meta="Сьют · до 7 марта" />
          <ActivityRow ico="book" Icon={IcoCheck} t="12:47" body={<><strong>Бронь подтверждена</strong> A-2840 — Стандарт</>} meta={`Анна П. · ${fmt(10800)}`} />
        </div>
      </div>
    </div>
  )
}
