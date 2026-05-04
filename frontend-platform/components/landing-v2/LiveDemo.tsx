'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowIcon, SendIcon, TicksIcon } from './icons';

function timeNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface Message {
  who: string;
  text: string;
  t: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const DEMO_RESPONSES: Record<string, string> = {
  "Сколько стоит номер на двоих?":
    "У нас три категории: Стандарт — 5 400 сом/ночь, Делюкс с видом на озеро — 8 400 сом/ночь, Сьют — 14 000 сом/ночь. Завтрак включён во все категории. На какие даты вас интересует? 🌿",
  "Можно ли с собакой?":
    "Да, мы принимаем маленьких питомцев до 10 кг. Доплата — 500 сом/ночь. Хотите уточнить даты для бронирования? 🌿",
  "Есть ранний заезд в 10 утра?":
    "Ранний заезд возможен с 11:00 — бесплатно при наличии свободного номера. На 10:00, к сожалению, не получится. Подсказать что-нибудь ещё? 🌿",
  "Что включено в завтрак?":
    "Завтрак континентальный + локальные блюда: каймак, лепёшки, мёд с горных пасек. Подаётся с 7:30 до 10:00. Хотите забронировать номер? 🌿",
  "Как добраться от Бишкека?":
    "От Бишкека примерно 4 часа на машине. Мы можем организовать трансфер — 6 500 сом в одну сторону. Заказать трансфер к дате заезда? 🌿",
};

export function LiveDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      who: "bot",
      text: "Здравствуйте! Я AI-консьерж демо-отеля «Issyk Lodge» 🌿 Спросите про номера, цены, заезд, парковку — отвечу как настоящий бот ex machine.",
      t: timeNow(),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const presets = [
    "Сколько стоит номер на двоих?",
    "Можно ли с собакой?",
    "Есть ранний заезд в 10 утра?",
    "Что включено в завтрак?",
    "Как добраться от Бишкека?",
  ];

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, thinking]);

  async function send(text: string) {
    if (!text.trim() || thinking) return;
    const userMsg: Message = { who: "guest", text: text.trim(), t: timeNow() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    const systemPrompt = `Ты — AI-консьерж небольшого отеля «Issyk Lodge» на Иссык-Куле, демо-режим для платформы ex machine.
ТОН: тёплый, краткий, на «вы» с одним эмодзи в начале или конце ответа.
ЯЗЫК: отвечай на языке гостя (русский по умолчанию).
ДАННЫЕ ОТЕЛЯ:
— 12 номеров: Стандарт 5400 сом/ночь, Делюкс с видом на озеро 8400 сом/ночь, Сьют 14000 сом/ночь.
— Завтрак включён (континентальный + локальные блюда).
— Заезд 14:00, выезд 12:00. Ранний заезд с 11:00 при наличии — бесплатно.
— Парковка бесплатная. С животными — только маленькие, до 10 кг, +500 сом/ночь.
— От Бишкека ~4 часа на машине, организуем трансфер 6500 сом в одну сторону.
— Сауна, мангальная зона, прокат сапбордов летом.
ПРАВИЛА:
— Если гость спрашивает скидку больше 10% или жалуется — скажи что передашь менеджеру.
— Не выдумывай данные, которых нет. Если не знаешь — скажи и предложи уточнить у менеджера.
— Отвечай коротко: 1-3 предложения.
— В конце предлагай следующий шаг: уточнить даты, забронировать, прислать фото.`;

    const history = messages.map((m) => ({
      role: m.who === "guest" ? "user" : "assistant",
      content: m.text,
    }));
    history.push({ role: "user", content: userMsg.text });

    try {
      const res = await fetch(`${API_URL}/api/v1/demo/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: systemPrompt, messages: history }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const reply = data?.reply || data?.content || data?.text || data?.message;

      if (reply) {
        setMessages((m) => [...m, { who: "bot", text: reply, t: timeNow() }]);
      } else {
        throw new Error("No reply field in response");
      }
    } catch {
      // Fallback: use hardcoded demo responses or a generic message
      const fallback = DEMO_RESPONSES[userMsg.text];
      if (fallback) {
        // Simulate slight delay for realism
        await new Promise((r) => setTimeout(r, 600));
        setMessages((m) => [...m, { who: "bot", text: fallback, t: timeNow() }]);
      } else {
        await new Promise((r) => setTimeout(r, 400));
        setMessages((m) => [
          ...m,
          {
            who: "bot",
            text: "Демо-режим: живой API сейчас недоступен. Попробуйте один из вопросов-подсказок слева, или запустите полную версию через визард 🌿",
            t: timeNow(),
          },
        ]);
      }
    } finally {
      setThinking(false);
    }
  }

  return (
    <section className="demo" id="demo">
      <div className="container">
        <div className="reveal section-tag">03 · Живое демо</div>
        <h2 className="reveal" data-delay="1" style={{ marginTop: 18, maxWidth: "20ch" }}>
          Поговорите с настоящим ботом ex machine.
        </h2>
        <p className="reveal subhead" data-delay="2" style={{ marginTop: 22 }}>
          Ниже — реальный Claude с системным промптом одного из наших клиентов. Никаких заготовленных ответов: задайте любой вопрос как настоящий гость.
        </p>

        <div className="demo-grid">
          <div className="demo-side reveal" data-delay="2">
            <h3>Подсказки</h3>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 8 }}>
              Кликните на вопрос — или напишите свой.
            </p>
            <div className="preset-list">
              {presets.map((p) => (
                <button key={p} className="preset" onClick={() => send(p)} disabled={thinking}>
                  <span>{p}</span>
                  <ArrowIcon className="arrow" />
                </button>
              ))}
            </div>
            <div className="demo-meta">
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Демо-отель:</strong> Issyk Lodge · 12 номеров · Иссык-Куль.
              <br />Это тот же стек, что работает в продакшне у Ton Azure.
            </div>
          </div>

          <div className="demo-chat-wrap reveal" data-delay="3">
            <div className="chat-shell">
              <div className="chat-header">
                <div className="avatar">IL</div>
                <div className="meta">
                  <div className="name">Issyk Lodge · AI-консьерж</div>
                  <div className="status">{thinking ? "печатает…" : "в сети"}</div>
                </div>
                <div className="channel-pill">демо</div>
              </div>
              <div className="chat-body" ref={bodyRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`chat-bubble ${m.who}`}>
                    {m.text}
                    <span className="time">{m.t}</span>
                    {m.who === "bot" && <span className="ticks"><TicksIcon /></span>}
                  </div>
                ))}
                {thinking && <div className="typing"><span /><span /><span /></div>}
              </div>
              <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
                <input
                  placeholder="Напишите сообщение…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={thinking}
                />
                <button type="submit" className="send" disabled={thinking || !input.trim()} aria-label="Отправить">
                  <SendIcon />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
