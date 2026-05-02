'use client'

import { useState } from 'react'
import { IcoSpark, IcoCheck, IcoChev, IcoCopy } from '@/components/partner/icons'

const STEPS = [
  { id: 0, title: 'Отель', sub: 'Название и контакты' },
  { id: 1, title: 'Каналы', sub: 'Где отвечает бот' },
  { id: 2, title: 'Цены и условия', sub: 'Тарифы и оплата' },
  { id: 3, title: 'Правила дома', sub: 'Заезд, питомцы, дети' },
  { id: 4, title: 'FAQ', sub: 'Что часто спрашивают' },
  { id: 5, title: 'Превью', sub: 'Запуск и ссылка' },
]

const DEMO_FILL = {
  name: 'Asia Mountains Hotel',
  contact: '+996 770 123 456',
  city: 'Бишкек, ул. Малдыбаева 1A',
  channels: ['whatsapp', 'telegram', 'site'] as string[],
  language: 'ru',
  priceStandard: '4500',
  priceLux: '7800',
  pricesIncl: 'завтрак',
  rules: 'Заезд с 14:00, выезд до 12:00. Можно с детьми. С животными нельзя. Курение запрещено.',
  faq: '— Есть ли парковка? Да, бесплатная.\n— Принимаете кешем? Да, и наличные, и карты.\n— Можно ли пораньше заехать? По возможности, уточните при бронировании.',
}

const EMPTY_DATA = {
  name: '', contact: '', city: '',
  channels: ['whatsapp'] as string[], language: 'ru',
  priceStandard: '', priceLux: '', pricesIncl: '',
  rules: '', faq: '',
}

type WizData = typeof EMPTY_DATA

export default function CreatePage() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizData>({ ...EMPTY_DATA })
  const set = (k: keyof WizData, v: any) => setData(d => ({ ...d, [k]: v }))
  const fillDemo = () => setData(DEMO_FILL)

  const stepDone = (i: number) => {
    if (i === 0) return !!(data.name && data.contact)
    if (i === 1) return data.channels.length > 0
    if (i === 2) return !!data.priceStandard
    if (i === 3) return data.rules.length > 10
    if (i === 4) return data.faq.length > 10
    return false
  }
  const progress = STEPS.filter((_, i) => stepDone(i)).length

  return (
    <div className="p-page">
      <div className="p-page-head">
        <div>
          <h1>Создать бота клиенту</h1>
          <div className="sub">Заполните 6 шагов или нажмите «Заполнить демо» — будет готово за минуту</div>
        </div>
        <div className="p-page-actions">
          <button className="btn btn-outline" onClick={fillDemo}><IcoSpark />Заполнить демо</button>
          <button className="btn btn-ghost" onClick={() => setData({ ...EMPTY_DATA })}>Очистить</button>
        </div>
      </div>

      <div className="wizard">
        <div className="wiz-steps">
          {STEPS.map((s, i) => {
            const done = i < step && stepDone(i)
            return (
              <div key={s.id} className={`wiz-step ${i === step ? 'active' : ''} ${done ? 'done' : ''}`} onClick={() => setStep(i)}>
                <div className="num">{done ? <IcoCheck /> : i + 1}</div>
                <div className="meta"><strong>{s.title}</strong><span>{s.sub}</span></div>
              </div>
            )
          })}
        </div>

        <div className="wiz-content">
          {step === 0 && <Step0 data={data} set={set} />}
          {step === 1 && <Step1 data={data} set={set} />}
          {step === 2 && <Step2 data={data} set={set} />}
          {step === 3 && <Step3 data={data} set={set} />}
          {step === 4 && <Step4 data={data} set={set} />}
          {step === 5 && <Step5 data={data} />}

          <div className="wiz-foot">
            <div className="progress">Шаг {step + 1} из {STEPS.length} · заполнено {progress}/6</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {step > 0 && <button className="btn btn-outline" onClick={() => setStep(step - 1)}>Назад</button>}
              {step < STEPS.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Далее<IcoChev /></button>
              ) : (
                <button className="btn btn-blue"><IcoSpark />Запустить бота</button>
              )}
            </div>
          </div>
        </div>

        <PreviewPane data={data} />
      </div>
    </div>
  )
}

function Step0({ data, set }: { data: WizData; set: (k: keyof WizData, v: any) => void }) {
  return (
    <>
      <h3>Отель и контакты</h3>
      <div className="sub">Эти данные бот покажет гостям</div>
      <div className="field">
        <label>Название отеля</label>
        <input className="input" value={data.name} onChange={e => set('name', e.target.value)} placeholder="Например, Asia Mountains Hotel" />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Контактный номер</label>
          <input className="input" value={data.contact} onChange={e => set('contact', e.target.value)} placeholder="+996 ..." />
        </div>
        <div className="field">
          <label>Город / адрес</label>
          <input className="input" value={data.city} onChange={e => set('city', e.target.value)} placeholder="Бишкек, ул. ..." />
        </div>
      </div>
      <div className="field">
        <label>Язык бота по умолчанию</label>
        <div className="chip-group">
          {([['ru', 'Русский'], ['ky', 'Кыргызча'], ['en', 'English']] as const).map(([v, l]) => (
            <button key={v} className={`chip ${data.language === v ? 'active' : ''}`} onClick={() => set('language', v)}>{l}</button>
          ))}
        </div>
        <span className="help">Бот всё равно понимает все три языка — это просто язык первого сообщения</span>
      </div>
    </>
  )
}

function Step1({ data, set }: { data: WizData; set: (k: keyof WizData, v: any) => void }) {
  const toggle = (c: string) => {
    const next = data.channels.includes(c)
      ? data.channels.filter(x => x !== c)
      : [...data.channels, c]
    set('channels', next)
  }
  const CH = [
    { id: 'whatsapp', label: 'WhatsApp', desc: 'Через WhatsApp Business API' },
    { id: 'telegram', label: 'Telegram', desc: 'Бот в Telegram' },
    { id: 'site', label: 'Виджет на сайте', desc: 'Чат-бабл на сайте отеля' },
    { id: 'instagram', label: 'Instagram DM', desc: 'Личные сообщения Instagram' },
  ]
  return (
    <>
      <h3>Каналы</h3>
      <div className="sub">Где бот будет отвечать гостям</div>
      <div style={{ display: 'grid', gap: 10 }}>
        {CH.map(c => {
          const on = data.channels.includes(c.id)
          return (
            <button key={c.id} onClick={() => toggle(c.id)}
              style={{
                textAlign: 'left', padding: '12px 14px',
                border: on ? '1px solid var(--p-primary-bright)' : '1px solid var(--p-line)',
                background: on ? 'oklch(0.97 0.02 264)' : 'var(--p-surface)',
                borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4,
                border: on ? '0' : '1.5px solid var(--p-ink-mute2)',
                background: on ? 'var(--p-primary-bright)' : 'transparent',
                color: 'white', display: 'grid', placeItems: 'center',
              }}>{on && <IcoCheck style={{ width: 12, height: 12 }} />}</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13.5 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: 'var(--p-ink-muted)' }}>{c.desc}</div>
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

function Step2({ data, set }: { data: WizData; set: (k: keyof WizData, v: any) => void }) {
  return (
    <>
      <h3>Цены и условия</h3>
      <div className="sub">Базовые тарифы — бот будет их называть гостям</div>
      <div className="field-row">
        <div className="field">
          <label>Стандарт за ночь, сом</label>
          <input className="input" value={data.priceStandard} onChange={e => set('priceStandard', e.target.value)} placeholder="4500" />
        </div>
        <div className="field">
          <label>Люкс за ночь, сом</label>
          <input className="input" value={data.priceLux} onChange={e => set('priceLux', e.target.value)} placeholder="7800" />
        </div>
      </div>
      <div className="field">
        <label>Что включено в цену</label>
        <input className="input" value={data.pricesIncl} onChange={e => set('pricesIncl', e.target.value)} placeholder="завтрак, парковка, Wi-Fi" />
      </div>
      <div style={{ padding: 12, background: 'var(--p-tint)', borderRadius: 8, fontSize: 12.5, color: 'var(--p-ink-muted)', marginTop: 8 }}>
        Можно добавить больше категорий и сезонные цены позже — здесь только базовая логика для демо.
      </div>
    </>
  )
}

function Step3({ data, set }: { data: WizData; set: (k: keyof WizData, v: any) => void }) {
  return (
    <>
      <h3>Правила дома</h3>
      <div className="sub">Что важно знать гостю — бот ответит на эти вопросы</div>
      <div className="field">
        <label>Правила свободным текстом</label>
        <textarea className="textarea" rows={6} value={data.rules} onChange={e => set('rules', e.target.value)}
          placeholder="Заезд с 14:00, выезд до 12:00. Можно с детьми. С животными нельзя..." />
        <span className="help">Заезд/выезд, питомцы, дети, курение, оплата — пиши как хочешь, бот разберётся</span>
      </div>
    </>
  )
}

function Step4({ data, set }: { data: WizData; set: (k: keyof WizData, v: any) => void }) {
  return (
    <>
      <h3>FAQ</h3>
      <div className="sub">Частые вопросы и ответы — повышают точность бота</div>
      <div className="field">
        <label>Вопросы и ответы</label>
        <textarea className="textarea" rows={8} value={data.faq} onChange={e => set('faq', e.target.value)}
          placeholder={'— Есть ли парковка? Да, бесплатная.\n— Принимаете кешем? Да...'} />
        <span className="help">По одному пункту в строке. Чем больше — тем лучше</span>
      </div>
    </>
  )
}

function Step5({ data }: { data: WizData }) {
  const [copied, setCopied] = useState(false)
  const link = `https://demo.ex-machina.kg/${(data.name || 'hotel').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
  const copy = () => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  const fmtSom = (n: number) => Math.round(n).toLocaleString('ru-RU') + ' сом'

  return (
    <>
      <h3>Готово!</h3>
      <div className="sub">Демо собрано. Отправьте ссылку клиенту — пусть пишет боту и убедится сам.</div>

      <div style={{
        background: 'linear-gradient(135deg, oklch(0.96 0.04 150), oklch(0.94 0.06 150))',
        padding: 16, borderRadius: 12, marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'var(--p-accent)', color: 'white',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}><IcoCheck /></div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Бот готов к запуску</div>
          <div style={{ fontSize: 12.5, color: 'oklch(0.4 0.1 150)' }}>Ваша комиссия при подключении: <strong>30 100 сом</strong> ($700 × 30%)</div>
        </div>
      </div>

      <div className="field">
        <label>Ссылка на демо</label>
        <div className="referral-link" style={{ background: 'var(--p-tint)', border: '1px solid var(--p-line)' }}>
          <span className="url" style={{ color: 'var(--p-ink)' }}>{link}</span>
          <button className={`copy-btn ${copied ? 'ok' : ''}`} onClick={copy}>
            {copied ? 'Скопировано' : <><IcoCopy style={{ width: 12, height: 12 }} />Копировать</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Отправить в WhatsApp</button>
        <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Отправить в Telegram</button>
      </div>

      <div style={{ padding: 14, background: 'var(--p-tint)', borderRadius: 10, fontSize: 12.5, marginTop: 14, lineHeight: 1.55, color: 'var(--p-ink-soft)' }}>
        <strong style={{ color: 'var(--p-ink)' }}>Что дальше:</strong><br />
        1. Клиент пишет боту — лид появится в разделе «Мои лиды».<br />
        2. Когда подпишется на $700/мес — комиссия 30% упадёт на счёт.<br />
        3. Выплата на следующий день после подтверждения оплаты.
      </div>
    </>
  )
}

function PreviewPane({ data }: { data: WizData }) {
  return (
    <div className="wiz-preview">
      <h4>Превью бота</h4>
      <div className="pv-name">{data.name || 'Имя отеля'}</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="pv-row"><span className="k">Контакт</span><span className="v">{data.contact || '—'}</span></div>
        <div className="pv-row"><span className="k">Каналы</span><span className="v">{data.channels.length ? data.channels.join(', ') : '—'}</span></div>
        <div className="pv-row"><span className="k">Цена ст.</span><span className="v">{data.priceStandard ? `${data.priceStandard} сом` : '—'}</span></div>
        <div className="pv-row"><span className="k">Язык</span><span className="v">{data.language?.toUpperCase()}</span></div>
      </div>
      <div className="stub-msgs">
        <div className="me">Привет! Сколько стоит номер?</div>
        <div className="bot">Стандарт — {data.priceStandard || '____'} сом/ночь, люкс — {data.priceLux || '____'} сом/ночь.{data.pricesIncl && ` В цену входит ${data.pricesIncl}.`}</div>
        <div className="me">А с собакой можно?</div>
        <div className="bot">{data.rules.includes('животн') || data.rules.includes('питом') ? 'По правилам отеля...' : 'Уточните в правилах отеля'}</div>
      </div>
    </div>
  )
}
