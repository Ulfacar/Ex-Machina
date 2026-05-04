'use client'

import { useState, useRef, useEffect } from 'react'
import { IcoSend } from '@/components/cabinet/icons'

const THREADS = [
  { id: 1, name: 'Артём Кузнецов', initials: 'АК', ch: 'wa' as const, t: '14:32', unread: 0,
    preview: 'Спасибо! Тогда бронирую делюкс на 14–17 марта',
    status: 'bot', phone: '+7 916 ••• 41 22', country: '🇷🇺 Москва', lang: 'RU',
    stay: { dates: '14–17 марта 2026', guests: '2 взр', room: 'Делюкс с видом', price: 25200 },
    msgs: [
      { from: 'guest', text: 'Здравствуйте! Хотел узнать про номера у вас на 14-17 марта', t: '14:21' },
      { from: 'bot', text: 'Здравствуйте, Артём! На 14–17 марта (3 ночи) у нас свободны:\n• Стандарт — 9 600 сом/ночь\n• Делюкс с видом — 12 400 сом/ночь\n• Сьют — 18 200 сом/ночь\n\nВ цену включён завтрак. Какой вариант рассмотрим?', t: '14:21' },
      { from: 'guest', text: 'А вид куда у Делюкса?', t: '14:24' },
      { from: 'bot', text: 'Прямо на озеро Иссык-Куль 🌊 Большие панорамные окна и балкон. Могу прислать фото из этого номера.', t: '14:24' },
      { from: 'guest', text: 'Да, скиньте фото пожалуйста', t: '14:25' },
      { from: 'bot', text: '[фото 1.jpg, 2.jpg, 3.jpg]\nВот этот номер — 25 м², кровать king-size, балкон с креслами.', t: '14:26' },
      { from: 'guest', text: 'Отлично. А парковка есть?', t: '14:30' },
      { from: 'bot', text: 'Да, бесплатная охраняемая парковка прямо у входа.', t: '14:30' },
      { from: 'guest', text: 'Спасибо! Тогда бронирую делюкс на 14–17 марта', t: '14:32' },
    ],
  },
  { id: 2, name: 'Ольга Морозова', initials: 'ОМ', ch: 'tg' as const, t: '13:54', unread: 2,
    preview: 'А скидка для постоянных клиентов есть? Я уже была у вас в августе',
    status: 'human', phone: '@olya_m', country: '🇰🇿 Алматы', lang: 'RU',
    stay: { dates: '20–23 марта 2026', guests: '2 взр + ребёнок', room: 'Сьют', price: 54600 },
    msgs: [
      { from: 'guest', text: 'Добрый день! Хотим вернуться к вам в марте, на 20-23. Есть Сьют?', t: '13:42' },
      { from: 'bot', text: 'Здравствуйте! Да, Сьют свободен на 20–23 марта. 18 200 сом/ночь, итого 54 600 за 3 ночи.', t: '13:42' },
      { from: 'guest', text: 'А скидка для постоянных клиентов есть? Я уже была у вас в августе', t: '13:54' },
    ],
  },
  { id: 3, name: 'Дмитрий Соколов', initials: 'ДС', ch: 'wa' as const, t: '13:41', unread: 0, preview: 'Понял, спасибо! Подумаю и напишу', status: 'bot', phone: '+7 925 ••• 88 04', country: '🇷🇺 СПб', lang: 'RU', stay: { dates: '—', guests: '—', room: '—', price: 0 }, msgs: [] },
  { id: 4, name: 'Talant Bekov', initials: 'ТБ', ch: 'tg' as const, t: '12:08', unread: 0, preview: 'Хорошо, до встречи завтра!', status: 'bot', phone: '@talantb', country: '🇰🇬 Бишкек', lang: 'RU', stay: { dates: '5–7 марта 2026', guests: '1 взр', room: 'Сьют', price: 36400 }, msgs: [] },
  { id: 5, name: 'Анна Петрова', initials: 'АП', ch: 'wa' as const, t: '11:24', unread: 0, preview: 'Отлично, бронирую!', status: 'bot', phone: '+7 903 ••• 12 56', country: '🇷🇺 Казань', lang: 'RU', stay: { dates: '12–14 марта', guests: '2 взр', room: 'Стандарт', price: 19200 }, msgs: [] },
  { id: 6, name: 'Maria Lopez', initials: 'ML', ch: 'wa' as const, t: 'Вчера', unread: 0, preview: 'Thank you, I\'ll think about it!', status: 'bot', phone: '+1 415 ••• 22 87', country: '🇺🇸 SF', lang: 'EN', stay: { dates: '—', guests: '—', room: '—', price: 0 }, msgs: [] },
  { id: 7, name: 'Erlan Tashiev', initials: 'ЕТ', ch: 'tg' as const, t: 'Вчера', unread: 0, preview: 'Спасибо, всё понятно', status: 'bot', phone: '@erlant', country: '🇰🇬 Каракол', lang: 'RU', stay: { dates: '—', guests: '—', room: '—', price: 0 }, msgs: [] },
]

function ChannelPill({ ch }: { ch: 'wa' | 'tg' }) {
  if (ch === 'wa') return <span className="ch-pill wa">● WhatsApp</span>
  return <span className="ch-pill tg">● Telegram</span>
}

export default function InboxPage() {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(THREADS[0].id)
  const [mode, setMode] = useState('manual')
  const [draft, setDraft] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  const filtered = THREADS.filter((t) => {
    if (filter === 'bot') return t.status === 'bot'
    if (filter === 'human') return t.status === 'human'
    if (filter === 'unread') return t.unread > 0
    return true
  })
  const t = THREADS.find((x) => x.id === active) || THREADS[0]

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [active])

  return (
    <div className="inbox-grid">
      <div className="inbox-list">
        <div className="inbox-filter">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Все<span className="ct">{THREADS.length}</span></button>
          <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Новые<span className="ct">{THREADS.filter(t => t.unread).length}</span></button>
          <button className={filter === 'human' ? 'active' : ''} onClick={() => setFilter('human')}>Эскал.<span className="ct">{THREADS.filter(t => t.status === 'human').length}</span></button>
          <button className={filter === 'bot' ? 'active' : ''} onClick={() => setFilter('bot')}>Бот</button>
        </div>
        {filtered.map((th) => (
          <div key={th.id} className={`inbox-row ${th.id === active ? 'active' : ''}`} onClick={() => setActive(th.id)}>
            <div className="av">{th.initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                <span className="who" style={{ flex: 1, minWidth: 0 }}>{th.name}</span>
              </div>
              <div className="preview">{th.preview}</div>
              <div style={{ marginTop: 4, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <ChannelPill ch={th.ch} />
                <span className={`c-status-pill ${th.status}`}>{th.status === 'bot' ? 'Бот' : 'Менеджер'}</span>
              </div>
            </div>
            <div className="right">
              <div className="t">{th.t}</div>
              {th.unread > 0 ? <div className="unread">{th.unread}</div> : <div style={{ width: 16 }} />}
            </div>
          </div>
        ))}
      </div>

      <div className="inbox-thread">
        <div className="thread-head">
          <div className="who">
            <div className="av">{t.initials}</div>
            <div>
              <h3>{t.name}</h3>
              <div className="meta">{t.country} · {t.phone} · <ChannelPill ch={t.ch} /></div>
            </div>
          </div>
          <div className="actions">
            <button className="c-btn c-btn-outline">Создать бронь</button>
            <button className="c-btn c-btn-ghost">Профиль гостя</button>
          </div>
        </div>

        <div className="thread-body" ref={bodyRef}>
          <div className="thread-day">Сегодня</div>
          {t.msgs.length === 0 ? (
            <div style={{ alignSelf: 'center', color: 'var(--c-ink-muted)', padding: 40, textAlign: 'center', fontSize: 13 }}>
              Выберите диалог слева
            </div>
          ) : t.msgs.map((m, i) => (
            <div key={i} className={`bubble ${m.from}`}>
              {m.from === 'bot' && <span className="by">EX MACHINE</span>}
              {m.from === 'human' && <span className="by">МЕНЕДЖЕР</span>}
              {m.from !== 'guest' && <br />}
              {m.text.split('\n').map((ln, j) => <div key={j}>{ln}</div>)}
              <span className="t">{m.t}</span>
            </div>
          ))}
        </div>

        <div className="thread-composer">
          <div className="composer-mode">
            <button className={mode === 'manual' ? 'active' : ''} onClick={() => setMode('manual')}>Ответить вручную</button>
            <button className={mode === 'suggest' ? 'active' : ''} onClick={() => setMode('suggest')}>Подсказка бота</button>
            <button className={mode === 'note' ? 'active' : ''} onClick={() => setMode('note')}>Заметка</button>
          </div>
          <div className="composer-input">
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder={mode === 'note' ? 'Внутренняя заметка (гость не увидит)' : 'Напишите ответ...'} />
            <button className="c-btn c-btn-primary"><IcoSend style={{ width: 14, height: 14 }} />Отправить</button>
          </div>
        </div>
      </div>

      <div className="thread-side">
        <div className="side-block">
          <h4>Текущий запрос</h4>
          <div className="side-row"><span className="k">Даты</span><span className="v">{t.stay.dates}</span></div>
          <div className="side-row"><span className="k">Гости</span><span className="v">{t.stay.guests}</span></div>
          <div className="side-row"><span className="k">Номер</span><span className="v">{t.stay.room}</span></div>
          <div className="side-row"><span className="k">Сумма</span><span className="v">{t.stay.price ? t.stay.price.toLocaleString('ru-RU') + ' сом' : '—'}</span></div>
        </div>
        <div className="side-block">
          <h4>Гость</h4>
          <div className="side-row"><span className="k">Язык</span><span className="v">{t.lang}</span></div>
          <div className="side-row"><span className="k">Откуда</span><span className="v">{t.country}</span></div>
          <div className="side-row"><span className="k">Прежние брони</span><span className="v">2</span></div>
          <div className="side-row"><span className="k">Канал</span><span className="v"><ChannelPill ch={t.ch} /></span></div>
        </div>
        <div className="side-actions">
          <button className="c-btn c-btn-primary">Подтвердить бронь</button>
          <button className="c-btn c-btn-outline">Передать менеджеру</button>
          <button className="c-btn c-btn-ghost">Закрыть диалог</button>
        </div>
      </div>
    </div>
  )
}
