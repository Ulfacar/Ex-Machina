'use client'

import { useState } from 'react'
import { IcoCopy, IcoCheck, IcoDownload } from '@/components/partner/icons'

export default function PromoPage() {
  const [copied, setCopied] = useState(false)
  const [utm, setUtm] = useState({ source: 'telegram', medium: 'post', campaign: '' })
  const link = `https://ex-machina.kg/?ref=partner-001${utm.source ? `&utm_source=${utm.source}` : ''}${utm.medium ? `&utm_medium=${utm.medium}` : ''}${utm.campaign ? `&utm_campaign=${utm.campaign}` : ''}`
  const copy = () => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  return (
    <div className="p-page">
      <div className="p-page-head">
        <div>
          <h1>Промо-материалы</h1>
          <div className="sub">Реферальная ссылка, баннеры и тексты для рассылки клиентам</div>
        </div>
      </div>

      <div className="referral-box" style={{ marginBottom: 16 }}>
        <div className="label">Ваша реферальная ссылка</div>
        <div className="referral-link">
          <span className="url">{link}</span>
          <button className={`copy-btn ${copied ? 'ok' : ''}`} onClick={copy}>
            {copied ? 'Скопировано' : <><IcoCopy style={{ width: 12, height: 12 }} />Копировать</>}
          </button>
        </div>
        <div className="utm-grid">
          <UtmField label="utm_source" v={utm.source} onChange={v => setUtm({ ...utm, source: v })} options={['telegram', 'instagram', 'whatsapp', 'email', 'direct']} />
          <UtmField label="utm_medium" v={utm.medium} onChange={v => setUtm({ ...utm, medium: v })} options={['post', 'story', 'dm', 'ads']} />
        </div>
        <div style={{ marginTop: 10 }}>
          <UtmField label="utm_campaign" v={utm.campaign} onChange={v => setUtm({ ...utm, campaign: v })} freeText placeholder="например, weekend-promo" />
        </div>
      </div>

      <div className="promo-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Баннеры</h3>
              <div className="sub">Готовые картинки для постов и сторис</div>
            </div>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { t: '1080×1080', l: 'Instagram пост', c: 'linear-gradient(135deg, oklch(0.45 0.18 264), oklch(0.3 0.16 264))' },
              { t: '1080×1920', l: 'Stories вертикаль', c: 'linear-gradient(160deg, oklch(0.5 0.16 280), oklch(0.32 0.14 264))' },
              { t: '1200×630', l: 'Telegram превью', c: 'linear-gradient(110deg, oklch(0.55 0.14 220), oklch(0.35 0.16 264))' },
              { t: 'PDF', l: 'Презентация для встречи', c: 'linear-gradient(135deg, oklch(0.55 0.14 150), oklch(0.4 0.12 200))' },
            ].map((b, i) => (
              <div key={i} className="material-card">
                <div className="material-thumb" style={{ background: b.c, color: 'oklch(1 0 0 / 0.6)' }}>
                  <span>EM</span>
                </div>
                <div className="material-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>{b.l}</h4>
                    <p>{b.t}</p>
                  </div>
                  <button className="btn btn-ghost" style={{ padding: '4px 8px' }}><IcoDownload /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Готовые тексты</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { t: 'Холодное сообщение в WhatsApp', body: 'Здравствуйте! Я партнёр Ex-Machina — мы делаем AI-ботов для отелей, которые отвечают гостям 24/7 в WhatsApp и Telegram. Хочу за минуту показать вам, как ваш бот мог бы выглядеть. Можно?' },
              { t: 'Пост в Telegram-канале', body: 'Отельерам Кыргызстана: ваш ресепшн больше не должен ночью отвечать на «есть ли свободные номера на завтра?» Покажу демо за 30 секунд.' },
              { t: 'Email follow-up', body: 'Спасибо за уделённое время! Прикладываю ссылку на демо вашего бота. Он уже умеет отвечать про ваши номера, цены и правила. Если откликается — давайте подключим за 1 день.' },
            ].map((tpl, i) => (
              <CopyableText key={i} title={tpl.t} body={tpl.body} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function UtmField({ label, v, onChange, options, freeText, placeholder }: {
  label: string; v: string; onChange: (v: string) => void;
  options?: string[]; freeText?: boolean; placeholder?: string
}) {
  return (
    <div className="field" style={{ marginBottom: 0 }}>
      <label style={{ color: 'oklch(0.85 0.03 264)', fontFamily: 'var(--p-font-mono)', fontSize: 11 }}>{label}</label>
      {freeText ? (
        <input
          className="input"
          value={v}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ background: 'oklch(1 0 0 / 0.08)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'white' }}
        />
      ) : (
        <div className="chip-group">
          {options?.map(o => (
            <button key={o} className={`chip compact ${v === o ? 'active' : ''}`}
              style={v === o
                ? { background: 'var(--p-primary-bright)', border: '1px solid var(--p-primary-bright)', color: 'white' }
                : { background: 'oklch(1 0 0 / 0.08)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.9 0.02 264)' }}
              onClick={() => onChange(o)}>{o}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function CopyableText({ title, body }: { title: string; body: string }) {
  const [c, setC] = useState(false)
  const copy = () => { navigator.clipboard?.writeText(body); setC(true); setTimeout(() => setC(false), 1200) }
  return (
    <div style={{ border: '1px solid var(--p-line)', borderRadius: 10, padding: '12px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <strong style={{ fontSize: 12.5, fontWeight: 600 }}>{title}</strong>
        <button className="btn btn-ghost" onClick={copy} style={{ padding: '4px 8px', fontSize: 11.5, color: c ? 'var(--p-accent)' : '' }}>
          {c ? <><IcoCheck style={{ width: 12, height: 12 }} />Скопировано</> : <><IcoCopy style={{ width: 12, height: 12 }} />Копировать</>}
        </button>
      </div>
      <p style={{ margin: 0, fontSize: 12.5, color: 'var(--p-ink-soft)', lineHeight: 1.55 }}>{body}</p>
    </div>
  )
}
