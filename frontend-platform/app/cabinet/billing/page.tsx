'use client'

import { IcoCheck } from '@/components/cabinet/icons'

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU') + ' сом'

function UsageBar({ label, used, cap }: { label: string, used: number, cap: number }) {
  const p = Math.min(100, (used / cap) * 100)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
        <span>{label}</span>
        <span style={{ color: 'var(--c-ink-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{used} / {cap}</span>
      </div>
      <div style={{ height: 6, background: 'var(--c-line-soft)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: p + '%', background: p > 80 ? 'var(--c-warn)' : 'var(--c-primary-bright)', transition: 'width 0.6s' }} />
      </div>
    </div>
  )
}

export default function BillingPage() {
  const plans = [
    { name: 'Старт', price: 0, n: 'до 30 диалогов/мес', features: ['1 канал', 'Базовые сценарии', 'Email-поддержка'], current: false },
    { name: 'Бизнес', price: 4900, n: 'до 500 диалогов/мес', features: ['WhatsApp + Telegram', 'FAQ + цены + правила', 'Эскалации', 'Команда до 5 чел.'], current: true },
    { name: 'Сеть', price: 14900, n: 'безлимит', features: ['Все каналы и PMS', 'Несколько отелей', 'API-доступ', 'Менеджер аккаунта'], current: false },
  ]

  return (
    <div className="cab-page">
      <div className="cab-page-head">
        <div>
          <h1>Биллинг</h1>
          <div className="sub">Тариф «Бизнес» · следующее списание 1 апреля 2026</div>
        </div>
        <div className="cab-page-actions">
          <button className="c-btn c-btn-outline">Скачать счёт</button>
          <button className="c-btn c-btn-outline">История платежей</button>
        </div>
      </div>

      <div className="cab-cols-2" style={{ marginBottom: 16 }}>
        <div className="c-card">
          <div className="c-card-head"><h3>Текущее использование</h3><div className="sub">Март 2026</div></div>
          <div className="c-card-body">
            <UsageBar label="Диалогов" used={143} cap={500} />
            <UsageBar label="Активных каналов" used={2} cap={2} />
            <UsageBar label="Сотрудников" used={4} cap={5} />
          </div>
        </div>
        <div className="c-card">
          <div className="c-card-head"><h3>Способ оплаты</h3></div>
          <div className="c-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '1px solid var(--c-line)', borderRadius: 10 }}>
              <div style={{ width: 44, height: 30, borderRadius: 4, background: 'linear-gradient(135deg, oklch(0.4 0.18 264), oklch(0.3 0.16 264))', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em' }}>VISA</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontFamily: 'var(--font-mono)' }}>•••• 4824</div>
                <div className="meta" style={{ color: 'var(--c-ink-muted)', fontSize: 11.5 }}>Истекает 09/27</div>
              </div>
              <button className="c-btn c-btn-ghost">Изменить</button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--c-ink-muted)' }}>
              Оплата в сомах через Mbank. ИП «Кадырова А.Б.»
            </div>
          </div>
        </div>
      </div>

      <div className="c-card">
        <div className="c-card-head"><h3>Тарифы</h3><div className="sub">Можно сменить в любой момент, разница перерасчитывается</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: 16 }}>
          {plans.map((p, i) => (
            <div key={i} style={{
              padding: 18, border: '1px solid ' + (p.current ? 'var(--c-ink)' : 'var(--c-line)'),
              borderRadius: 12, background: p.current ? 'oklch(0.97 0.02 264)' : 'var(--c-surface)', position: 'relative',
            }}>
              {p.current && <div style={{ position: 'absolute', top: -8, left: 16, background: 'var(--c-ink)', color: 'white', fontSize: 10, padding: '2px 8px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Текущий</div>}
              <div style={{ fontWeight: 600, fontSize: 16 }}>{p.name}</div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, letterSpacing: '-0.025em' }}>{p.price === 0 ? 'Бесплатно' : fmt(p.price)}</span>
                {p.price > 0 && <span style={{ color: 'var(--c-ink-muted)', fontSize: 12 }}>/мес</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-ink-muted)', marginTop: 4 }}>{p.n}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <IcoCheck style={{ width: 14, height: 14, color: 'var(--c-accent)', flexShrink: 0, marginTop: 2 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`c-btn ${p.current ? 'c-btn-outline' : 'c-btn-primary'}`} style={{ width: '100%', justifyContent: 'center', marginTop: 18 }}>
                {p.current ? 'Текущий тариф' : 'Перейти'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
