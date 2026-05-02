'use client'

import { useState } from 'react'
import { IcoChev, IcoCheck, IcoCopy } from '@/components/partner/icons'

export default function SettingsPage() {
  const [tab, setTab] = useState('profile')
  return (
    <div className="p-page">
      <div className="p-page-head">
        <div>
          <h1>Настройки</h1>
          <div className="sub">Профиль, реквизиты и уведомления</div>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-nav">
          {[
            ['profile', 'Профиль'],
            ['legal', 'Реквизиты'],
            ['notifications', 'Уведомления'],
            ['api', 'API и интеграции'],
            ['danger', 'Безопасность'],
          ].map(([id, label]) => (
            <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
              {label}<IcoChev />
            </button>
          ))}
        </div>

        <div className="settings-content">
          {tab === 'profile' && <ProfileSection />}
          {tab === 'legal' && <LegalSection />}
          {tab === 'notifications' && <NotifSection />}
          {tab === 'api' && <ApiSection />}
          {tab === 'danger' && <DangerSection />}
        </div>
      </div>
    </div>
  )
}

function ProfileSection() {
  return (
    <div className="card">
      <div className="card-head"><h3>Личные данные</h3></div>
      <div className="card-body">
        <div className="field-row">
          <div className="field">
            <label>Имя</label>
            <input className="input" defaultValue="Бакыт" />
          </div>
          <div className="field">
            <label>Фамилия</label>
            <input className="input" defaultValue="Турдубаев" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Email</label>
            <input className="input" defaultValue="bakyt@example.kg" />
          </div>
          <div className="field">
            <label>Телефон</label>
            <input className="input" defaultValue="+996 555 123 456" />
          </div>
        </div>
        <div className="field">
          <label>Тип партнёра</label>
          <div className="chip-group">
            <button className="chip">Только реселлер</button>
            <button className="chip active">Реселлер + агент</button>
            <button className="chip">Только агент</button>
          </div>
          <span className="help">Реселлер сам ведёт клиента и поддерживает; агент только приводит лид</span>
        </div>
        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Сохранить</button>
      </div>
    </div>
  )
}

function LegalSection() {
  return (
    <div className="card">
      <div className="card-head"><h3>Реквизиты для выплат</h3></div>
      <div className="card-body">
        <div className="field">
          <label>Тип получателя</label>
          <div className="chip-group">
            <button className="chip active">Физлицо</button>
            <button className="chip">ИП</button>
            <button className="chip">ОсОО</button>
          </div>
        </div>
        <div className="field">
          <label>Банк</label>
          <input className="input" defaultValue="Optima Bank" />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Номер карты</label>
            <input className="input" defaultValue="•••• •••• •••• 4729" />
          </div>
          <div className="field">
            <label>ИНН</label>
            <input className="input" placeholder="14 цифр" />
          </div>
        </div>
        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Сохранить реквизиты</button>
      </div>
    </div>
  )
}

function NotifSection() {
  const items: [string, boolean][] = [
    ['Новый лид написал боту', true],
    ['Клиент перешёл к тестированию', true],
    ['Клиент подключился — комиссия начислена', true],
    ['Выплата на карту прошла', true],
    ['Дайджест по понедельникам', false],
    ['Маркетинговые материалы Ex-Machina', false],
  ]
  return (
    <div className="card">
      <div className="card-head"><h3>Уведомления</h3></div>
      <div className="card-body" style={{ padding: 0 }}>
        {items.map(([l, on], i) => (
          <Toggle key={i} label={l} on={on} />
        ))}
      </div>
    </div>
  )
}

function Toggle({ label, on }: { label: string; on: boolean }) {
  const [v, setV] = useState(on)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--p-line-soft)' }}>
      <span style={{ fontSize: 13.5 }}>{label}</span>
      <button onClick={() => setV(!v)} style={{
        width: 36, height: 20, borderRadius: 999,
        background: v ? 'var(--p-primary-bright)' : 'var(--p-line)',
        position: 'relative', transition: 'background 0.15s',
        border: 'none', cursor: 'pointer',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: v ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: 'white',
          transition: 'left 0.15s', boxShadow: '0 1px 3px oklch(0 0 0 / 0.2)',
        }} />
      </button>
    </div>
  )
}

function ApiSection() {
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h3>API ключ</h3>
          <div className="sub">Для интеграции с вашей CRM или лендингом</div>
        </div>
      </div>
      <div className="card-body">
        <div className="field">
          <label>API ключ</label>
          <div className="referral-link" style={{ background: 'var(--p-tint)', border: '1px solid var(--p-line)' }}>
            <span className="url" style={{ color: 'var(--p-ink)' }}>em_pk_partner001_••••••••••••3a7f</span>
            <button className="copy-btn" style={{ background: 'var(--p-ink)' }}>Показать</button>
          </div>
        </div>
        <div style={{ padding: 14, background: 'oklch(0.97 0.04 60)', borderRadius: 8, fontSize: 12.5, color: 'oklch(0.4 0.12 60)' }}>
          Никому не показывайте ключ — с ним можно создавать ботов от вашего имени и засчитывать вам лиды.
        </div>
      </div>
    </div>
  )
}

function DangerSection() {
  return (
    <div className="card">
      <div className="card-head"><h3>Безопасность</h3></div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>Сменить пароль</button>
        <button className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>Включить двухфакторку</button>
        <div style={{ borderTop: '1px solid var(--p-line)', paddingTop: 14, marginTop: 8 }}>
          <button style={{ color: 'var(--p-danger)', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Удалить партнёрский аккаунт</button>
        </div>
      </div>
    </div>
  )
}
