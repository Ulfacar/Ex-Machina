'use client'

const fmtUSD = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

const hotels = [
  { id: 1, name: 'Sary-Chelek Lodge', city: 'Джалал-Абад', since: '20 апр 2026', monthly: 700, channels: ['WhatsApp', 'Telegram'], chats: 142, automation: 87 },
  { id: 2, name: 'Issyk-Kul Resort', city: 'Чолпон-Ата', since: '5 апр 2026', monthly: 700, channels: ['WhatsApp', 'Сайт'], chats: 384, automation: 91 },
]

export default function HotelsPage() {
  return (
    <div className="p-page">
      <div className="p-page-head">
        <div>
          <h1>Мои отели</h1>
          <div className="sub">Подключённые клиенты — приносят вам комиссию каждый месяц</div>
        </div>
      </div>

      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kpi-card">
          <div className="v" style={{ color: 'var(--p-accent)' }}>{hotels.length}</div>
          <div className="l">Активных клиентов</div>
        </div>
        <div className="kpi-card">
          <div className="v" style={{ color: 'var(--p-primary-bright)' }}>{hotels.reduce((s, h) => s + h.chats, 0).toLocaleString('ru-RU')}</div>
          <div className="l">Чатов обработано</div>
        </div>
        <div className="kpi-card">
          <div className="v">{Math.round(hotels.reduce((s, h) => s + h.automation, 0) / hotels.length)}<span className="currency">%</span></div>
          <div className="l">Средняя автоматизация</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {hotels.map(h => (
          <div key={h.id} className="card">
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--p-line-soft)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 2, fontFamily: 'var(--p-font-display)' }}>{h.name}</h3>
                  <div style={{ fontSize: 12.5, color: 'var(--p-ink-muted)' }}>{h.city} · подключён {h.since}</div>
                </div>
                <span className="pill paid">Активен</span>
              </div>
            </div>
            <div style={{ padding: '14px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--p-ink-muted)', marginBottom: 2 }}>Тариф</div>
                  <div style={{ fontFamily: 'var(--p-font-display)', fontWeight: 600, fontSize: 18 }}>{fmtUSD(h.monthly)}<span style={{ fontSize: 12, color: 'var(--p-ink-muted)', fontWeight: 500 }}>/мес</span></div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--p-ink-muted)', marginBottom: 2 }}>Чатов / мес</div>
                  <div style={{ fontFamily: 'var(--p-font-display)', fontWeight: 600, fontSize: 18 }}>{h.chats}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--p-ink-muted)', marginBottom: 2 }}>Автоматизация</div>
                  <div style={{ fontFamily: 'var(--p-font-display)', fontWeight: 600, fontSize: 18, color: 'var(--p-accent)' }}>{h.automation}%</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {h.channels.map(c => <span key={c} className="chip compact">{c}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
