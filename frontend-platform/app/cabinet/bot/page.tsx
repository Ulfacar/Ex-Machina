'use client'

import { useState } from 'react'
import { IcoCheck, IcoChev, IcoPlus, IcoBot } from '@/components/cabinet/icons'

const TABS = [
  { id: 'persona', label: 'Персона и тон' },
  { id: 'prompt', label: 'Системный промпт' },
  { id: 'faq', label: 'FAQ-сценарии' },
  { id: 'prices', label: 'Цены и номера' },
  { id: 'rules', label: 'Правила и эскалация' },
  { id: 'channels', label: 'Каналы и часы' },
]

function PreviewBlock({ persona }: { persona: { name: string, role: string, tone: string } }) {
  const greeting = persona.tone === 'concierge'
    ? `Добрый день! Меня зовут ${persona.name}, я ${persona.role}. Чем могу быть полезна?`
    : persona.tone === 'neutral'
      ? `Здравствуйте! Я ${persona.name}, ${persona.role}. Как могу помочь?`
      : `Привет! Я ${persona.name}. Чем помочь?`
  return (
    <div className="c-card" style={{ padding: 0 }}>
      <div className="c-card-head"><h3>Превью</h3><div className="sub">Как бот ответит гостю прямо сейчас</div></div>
      <div className="preview-pane">
        <div className="pv-bubble guest">Здравствуйте, у вас есть свободные номера?</div>
        <div className="pv-bubble">{greeting}</div>
        <div className="pv-bubble">Есть свободные номера. На какие даты планируете и сколько вас будет?</div>
      </div>
    </div>
  )
}

function PersonaTab({ v, on }: { v: any, on: (v: any) => void }) {
  return (
    <>
      <div className="c-card">
        <div className="c-card-head"><h3>Персона</h3></div>
        <div className="c-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field-row">
            <div className="field">
              <label>Имя бота</label>
              <input className="c-input" value={v.name} onChange={(e) => on({ ...v, name: e.target.value })} />
              <div className="help">Гостям пишется в подписи и при первом приветствии</div>
            </div>
            <div className="field">
              <label>Роль</label>
              <input className="c-input" value={v.role} onChange={(e) => on({ ...v, role: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Тон общения</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                ['warm', 'Тёплый', 'Дружелюбный, на «ты», личное обращение'],
                ['neutral', 'Нейтральный', 'На «вы», деловой и точный'],
                ['concierge', 'Консьерж', 'Подчёркнуто вежливо, как в премиум-отеле'],
              ].map(([k, l, h]) => (
                <button key={k} onClick={() => on({ ...v, tone: k })} style={{
                  padding: '10px 14px', borderRadius: 10,
                  border: '1px solid ' + (v.tone === k ? 'var(--c-ink)' : 'var(--c-line)'),
                  background: v.tone === k ? 'var(--c-ink)' : 'var(--c-surface)',
                  color: v.tone === k ? 'white' : 'var(--c-ink)',
                  textAlign: 'left' as const, flex: '1 1 200px', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{l}</div>
                  <div style={{ fontSize: 11.5, opacity: 0.7, marginTop: 2 }}>{h}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Языки</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['RU', 'EN', 'KG', 'TR', 'ZH'].map((l) => {
                const isOn = v.languages.includes(l)
                return (
                  <button key={l} onClick={() => on({ ...v, languages: isOn ? v.languages.filter((x: string) => x !== l) : [...v.languages, l] })}
                    className={`filter-chip ${isOn ? 'active' : ''}`}>{l}</button>
                )
              })}
            </div>
            <div className="help">Бот определяет язык гостя автоматически и отвечает на нём же</div>
          </div>
        </div>
      </div>
      <PreviewBlock persona={v} />
    </>
  )
}

function PromptTab({ draft, setDraft, prompt, setPrompt }: { draft: string, setDraft: (s: string) => void, prompt: string, setPrompt: (s: string) => void }) {
  return (
    <>
      <div className="c-card">
        <div className="c-card-head">
          <div><h3>Системный промпт</h3><div className="sub">Главные инструкции для бота. Действует в каждом диалоге.</div></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-ink-muted)' }}>{draft.length} / 4000</div>
        </div>
        <div className="c-card-body">
          <textarea className="c-input" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, minHeight: 280, width: '100%' }}
            value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
            <button className="c-btn c-btn-ghost" onClick={() => setDraft(prompt)}>Отменить</button>
            <button className="c-btn c-btn-primary" onClick={() => setPrompt(draft)}><IcoCheck style={{ width: 14, height: 14 }} />Применить</button>
          </div>
        </div>
      </div>
      <div className="c-card">
        <div className="c-card-head"><div><h3>История версий</h3><div className="sub">Можно откатиться к прошлой версии</div></div></div>
        <div className="c-activity">
          {[['Текущая', 'Айгуль К.', 'сегодня 14:02'], ['v.7', 'Айгуль К.', '1 марта 09:12'], ['v.6', 'Бакыт А.', '27 февраля 18:40'], ['v.5', 'Айгуль К.', '20 февраля 11:08']].map(([v, who, t], i) => (
            <div key={i} className="c-activity-row">
              <div className="ico bot"><IcoBot style={{ width: 14, height: 14 }} /></div>
              <div className="body"><strong>{v}</strong><div className="meta">{who} · {t}</div></div>
              <div className="time">{i === 0 ? <span className="c-status-pill bot">актуальная</span> : <button className="c-btn c-btn-ghost" style={{ padding: '4px 8px' }}>Откатить</button>}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function FaqTab() {
  const items = [
    ['Можно ли с животными?', 'Да, мелкие питомцы (до 10 кг) — бесплатно. Крупные — доплата 1 000 сом/ночь.', '342'],
    ['Включён ли завтрак?', 'Завтрак включён во все тарифы. Подаётся 8:00–11:00.', '298'],
    ['Как добраться от Бишкека?', '4–5 часов на машине. Можем организовать трансфер за 6 500 сом.', '187'],
    ['Есть ли парковка?', 'Да, бесплатная охраняемая парковка прямо у входа.', '164'],
    ['До скольки можно заехать?', 'Заезд с 14:00, выезд до 12:00. Поздний выезд по согласованию.', '121'],
    ['Принимаете карты?', 'Да, Visa/Mastercard, ЭлКарт, Mbank, перевод. Предоплата 30%.', '98'],
  ]
  return (
    <div className="c-card">
      <div className="c-card-head"><div><h3>FAQ-сценарии</h3><div className="sub">Готовые ответы на популярные вопросы</div></div><button className="c-btn c-btn-primary"><IcoPlus style={{ width: 14, height: 14 }} />Добавить</button></div>
      <div className="faq-list">
        <div className="faq-row" style={{ background: 'var(--c-tint)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--c-ink-muted)', fontWeight: 500 }}>
          <div>Вопрос</div><div>Ответ бота</div><div>Срабат.</div>
        </div>
        {items.map(([q, a, n], i) => (
          <div key={i} className="faq-row">
            <div className="q">{q}</div>
            <div className="a">{a}</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'flex-end' }}>
              <span className="num" style={{ color: 'var(--c-ink-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{n}</span>
              <button className="c-btn c-btn-ghost" style={{ padding: '4px 6px' }}><IcoChev style={{ width: 14, height: 14 }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PricesTab() {
  const rooms = [
    { name: 'Стандарт', area: '18 м²', cap: '1–2', low: 9600, mid: 11200, high: 14400, count: 6 },
    { name: 'Делюкс с видом', area: '25 м²', cap: '2', low: 12400, mid: 14800, high: 19600, count: 4 },
    { name: 'Сьют', area: '42 м²', cap: '2 + ребёнок', low: 18200, mid: 22400, high: 28000, count: 2 },
  ]
  return (
    <div className="c-card">
      <div className="c-card-head"><div><h3>Цены и номера</h3><div className="sub">Бот использует эти цены при ответах гостям</div></div><button className="c-btn c-btn-primary"><IcoPlus style={{ width: 14, height: 14 }} />Добавить номер</button></div>
      <table className="c-table">
        <thead><tr><th>Номер</th><th>Площадь / гости</th><th>Кол-во</th><th>Низкий сезон</th><th>Средний</th><th>Высокий</th><th></th></tr></thead>
        <tbody>
          {rooms.map((r, i) => (
            <tr key={i}>
              <td><div style={{ fontWeight: 500 }}>{r.name}</div><div className="meta">за ночь, с завтраком</div></td>
              <td><div>{r.area}</div><div className="meta">{r.cap}</div></td>
              <td className="num">{r.count}</td>
              <td className="num">{r.low.toLocaleString('ru-RU')}</td>
              <td className="num">{r.mid.toLocaleString('ru-RU')}</td>
              <td className="num" style={{ fontWeight: 500 }}>{r.high.toLocaleString('ru-RU')}</td>
              <td><button className="c-btn c-btn-ghost" style={{ padding: '4px 8px' }}><IcoChev style={{ width: 14, height: 14 }} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: 16, borderTop: '1px solid var(--c-line-soft)', fontSize: 12, color: 'var(--c-ink-muted)' }}>
        Сезоны: <strong>Высокий</strong> — июнь–август, <strong>Средний</strong> — май, сентябрь, январские каникулы. Остальное — низкий.
      </div>
    </div>
  )
}

function RulesTab() {
  const [v, on] = useState({ discount: true, group: true, complaint: true, afterHours: false, custom: 'просьба о позднем заезде после 23:00' })
  const checks: [string, string, string][] = [
    ['discount', 'Запрос скидки > 10%', 'Бот не торгуется и зовёт менеджера'],
    ['group', 'Группа > 4 человек', 'Передаёт менеджеру для индивидуальных условий'],
    ['complaint', 'Жалоба или негатив', 'Сразу уведомляет менеджера, без авто-ответа'],
    ['afterHours', 'Сообщения после 23:00', 'Отвечает только утром (если выключено — отвечает 24/7)'],
  ]
  return (
    <>
      <div className="c-card">
        <div className="c-card-head"><h3>Когда передавать менеджеру</h3></div>
        <div className="c-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {checks.map(([k, label, desc]) => (
            <label key={k} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 12, border: '1px solid var(--c-line)', borderRadius: 10, cursor: 'pointer', background: (v as any)[k] ? 'oklch(0.97 0.02 264)' : 'var(--c-surface)' }}>
              <input type="checkbox" checked={(v as any)[k]} onChange={() => on({ ...v, [k]: !(v as any)[k] })} style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 500, fontSize: 13.5 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--c-ink-muted)', marginTop: 2 }}>{desc}</div>
              </div>
            </label>
          ))}
          <div className="field">
            <label>Свои триггеры (через запятую)</label>
            <input className="c-input" value={v.custom} onChange={(e) => on({ ...v, custom: e.target.value })} />
            <div className="help">Например: «корпоратив», «свадьба», «скидка для постоянных»</div>
          </div>
        </div>
      </div>
      <div className="c-card">
        <div className="c-card-head"><h3>Кому уведомлять</h3></div>
        <div className="c-activity">
          {[['Айгуль К.', 'Владелец', 'Все эскалации'], ['Бакыт А.', 'Менеджер', 'Все, кроме после 23:00'], ['Чынар О.', 'Ресепшн', 'Только заезды/выезды']].map(([n, r, w], i) => (
            <div key={i} className="c-activity-row">
              <div className="ico guest" style={{ background: 'linear-gradient(155deg, var(--c-primary-bright), var(--c-primary-deep))', color: 'white' }}>{(n as string).split(' ').map(p => p[0]).join('')}</div>
              <div className="body"><strong>{n}</strong> <span style={{ color: 'var(--c-ink-muted)', fontWeight: 400 }}>· {r}</span><div className="meta">{w}</div></div>
              <button className="c-btn c-btn-ghost" style={{ padding: '4px 8px' }}>Изменить</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function ChannelsTab() {
  return (
    <div className="c-card">
      <div className="c-card-head"><h3>Подключённые каналы</h3></div>
      <div className="c-activity">
        {[
          { ch: 'WhatsApp Business', n: '+996 555 12 34 56', st: 'Активен', on: true },
          { ch: 'Telegram', n: '@issyklodge_bot', st: 'Активен', on: true },
          { ch: 'Instagram DM', n: 'не подключён', st: 'Подключить', on: false },
          { ch: 'Booking.com сообщения', n: 'не подключён', st: 'Подключить', on: false },
        ].map((it, i) => (
          <div key={i} className="c-activity-row">
            <div className={`ico ${it.on ? 'book' : 'guest'}`}>{it.on ? <IcoCheck style={{ width: 14, height: 14 }} /> : <IcoPlus style={{ width: 14, height: 14 }} />}</div>
            <div className="body"><strong>{it.ch}</strong><div className="meta">{it.n}</div></div>
            <button className={it.on ? 'c-btn c-btn-ghost' : 'c-btn c-btn-outline'}>{it.st}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BotSettingsPage() {
  const [tab, setTab] = useState('persona')
  const [persona, setPersona] = useState({ name: 'Айнура', role: 'Администратор Issyk Lodge', tone: 'warm', languages: ['RU', 'EN', 'KG'], sign: true })
  const defaultPrompt = `Ты — администратор отеля Issyk Lodge на Иссык-Куле.
Твоя задача: помогать гостям выбрать номер, ответить на вопросы и довести до брони.

Правила:
- Отвечай тепло, но по делу. Не используй смайлы кроме 🌊 (озеро).
- Если гость спрашивает про скидки больше 10% — передай менеджеру.
- Если запрос на групповое размещение (>4 человек) — передай менеджеру.
- Никогда не подтверждай бронь без оплаты предоплаты 30%.

Стиль: короткие сообщения, как в чате, не как письма.`
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [draft, setDraft] = useState(defaultPrompt)

  return (
    <div className="cab-page">
      <div className="cab-page-head">
        <div>
          <h1>Настройки бота</h1>
          <div className="sub">Настройте поведение Айнуры — вашего AI-администратора. Изменения вступают в силу сразу.</div>
        </div>
        <div className="cab-page-actions">
          <button className="c-btn c-btn-outline">Тестовый чат</button>
          <button className="c-btn c-btn-primary"><IcoCheck style={{ width: 14, height: 14 }} />Сохранить</button>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-nav">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
              {t.label}
              {tab === t.id ? <IcoChev style={{ width: 14, height: 14 }} /> : null}
            </button>
          ))}
        </div>
        <div className="settings-content">
          {tab === 'persona' && <PersonaTab v={persona} on={setPersona} />}
          {tab === 'prompt' && <PromptTab draft={draft} setDraft={setDraft} prompt={prompt} setPrompt={setPrompt} />}
          {tab === 'faq' && <FaqTab />}
          {tab === 'prices' && <PricesTab />}
          {tab === 'rules' && <RulesTab />}
          {tab === 'channels' && <ChannelsTab />}
        </div>
      </div>
    </div>
  )
}
