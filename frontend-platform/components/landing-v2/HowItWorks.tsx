'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  WhatsappIcon,
  TelegramIcon,
  TicksIcon,
  ChatIcon,
  BellIcon,
  CheckIcon,
} from './icons';

/* ---- Sub-components ---- */

export function WizardMini() {
  return (
    <div className="wizard-mock">
      <div className="head">
        <div className="dots"><span /><span /><span /></div>
        <div className="url">app.exmachine.kg/setup</div>
      </div>
      <div className="body">
        <div className="step-label">Шаг 2 из 5</div>
        <div className="step-title">Расскажите об отеле</div>
        <div className="field">
          <label>Название</label>
          <input defaultValue="Ton Azure Resort" />
        </div>
        <div className="field">
          <label>Тип объекта</label>
          <div className="toggles">
            <button className="pill-toggle on">Курорт</button>
            <button className="pill-toggle">Отель</button>
            <button className="pill-toggle">Гостевой дом</button>
            <button className="pill-toggle">Хостел</button>
          </div>
        </div>
        <div className="field">
          <label>Количество номеров</label>
          <input defaultValue="14" />
        </div>
        <div className="footer-row">
          <span className="progress">{"█████████░░░░░"}  60%</span>
          <span className="next">Далее →</span>
        </div>
      </div>
    </div>
  );
}

export function PromptCard() {
  return (
    <div className="prompt-card">
      <div className="head">
        <span>SYSTEM_PROMPT.MD</span>
        <span className="badge">PRODUCTION · v3</span>
      </div>
      <span className="line"><span className="comment"># Идентичность</span></span>
      <span className="line"><span className="key">role</span>: <span className="val">&quot;AI-консьерж Ton Azure Resort&quot;</span></span>
      <span className="line"><span className="key">tone</span>: <span className="val">&quot;тёплый, кратко, на ты с эмодзи 🌿&quot;</span></span>
      <span className="line"><span className="key">language</span>: <span className="val">&quot;ru, en, ky&quot;</span></span>
      <br />
      <span className="line"><span className="comment"># Знание</span></span>
      <span className="line"><span className="key">rooms</span>: <span className="val">[Стандарт 5400 сом, Делюкс 8400 сом, Сьют 14000 сом]</span></span>
      <span className="line"><span className="key">checkin</span>: <span className="val">&quot;14:00&quot;</span> · <span className="key">checkout</span>: <span className="val">&quot;12:00&quot;</span></span>
      <span className="line"><span className="key">amenities</span>: <span className="val">[&quot;парковка&quot;, &quot;завтрак&quot;, &quot;сауна&quot;]</span></span>
      <br />
      <span className="line"><span className="comment"># Эскалация</span></span>
      <span className="line"><span className="key">escalate_on</span>: <span className="val">[&quot;скидка{'>'}10%&quot;, &quot;жалоба&quot;, &quot;групп&quot;]</span></span>
    </div>
  );
}

export function ChannelsStack() {
  return (
    <div className="channels-stack">
      <div className="chat-shell">
        <div className="chat-header">
          <div className="avatar" style={{ background: "var(--whatsapp)" }}><WhatsappIcon /></div>
          <div className="meta">
            <div className="name">+996 312 ··· · WhatsApp</div>
            <div className="status">подключено</div>
          </div>
        </div>
        <div className="chat-body" style={{ minHeight: 120 }}>
          <div className="chat-bubble guest">Можно у вас на 3 ночи в апреле?</div>
          <div className="chat-bubble bot">Конечно! С какого по какое число и сколько гостей?<span className="ticks"><TicksIcon /></span></div>
        </div>
      </div>
      <div className="chat-shell">
        <div className="chat-header tg">
          <div className="avatar" style={{ background: "var(--tg)" }}><TelegramIcon /></div>
          <div className="meta">
            <div className="name">@tonazure_bot · Telegram</div>
            <div className="status">подключено</div>
          </div>
        </div>
        <div className="chat-body" style={{ minHeight: 120 }}>
          <div className="chat-bubble guest">Привет! Цены на новогодние праздники?</div>
        </div>
      </div>
    </div>
  );
}

export function EscalationFlow() {
  return (
    <div className="escalation-flow">
      <div className="step-row">
        <div className="icn"><ChatIcon /></div>
        <div>
          <div style={{ fontWeight: 600 }}>Гость: «Хочу скидку 25% — я постоянный клиент»</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: 2 }}>Бот распознал: запрос вне политики</div>
        </div>
      </div>
      <div className="arrow-down">↓</div>
      <div className="step-row alert">
        <div className="icn"><BellIcon /></div>
        <div>
          <div style={{ fontWeight: 600 }}>Эскалация → менеджер Айгуль</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: 2 }}>Push-уведомление + ссылка на диалог · 23:51</div>
        </div>
      </div>
      <div className="arrow-down">↓</div>
      <div className="step-row">
        <div className="icn" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}><CheckIcon /></div>
        <div>
          <div style={{ fontWeight: 600 }}>Менеджер берёт чат, скидка согласована</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: 2 }}>Бот молча возвращается к остальным гостям</div>
        </div>
      </div>
    </div>
  );
}

export function DashMini() {
  return (
    <div className="dashboard-mock">
      <div className="head">
        <div className="title">Ton Azure · Март 2026</div>
        <div className="date">live · обновлено 2 мин назад</div>
      </div>
      <div className="kpis">
        <div className="kpi">
          <div className="lbl">Диалогов</div>
          <div className="val">147</div>
          <div className="delta">+34% к фев</div>
        </div>
        <div className="kpi">
          <div className="lbl">Подтверждено броней</div>
          <div className="val">42</div>
          <div className="delta">конв. 28.6%</div>
        </div>
        <div className="kpi">
          <div className="lbl">ROI</div>
          <div className="val">×46</div>
          <div className="delta">$4.20 → $194</div>
        </div>
      </div>
      <div className="chart">
        <svg viewBox="0 0 580 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.62 0.16 150)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="oklch(0.62 0.16 150)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d="M0,140 C40,130 80,120 120,110 C160,100 200,95 240,80 C280,65 320,70 360,55 C400,40 440,45 480,30 C520,18 560,22 580,18 L580,180 L0,180 Z" fill="url(#dgrad)" />
          <path d="M0,140 C40,130 80,120 120,110 C160,100 200,95 240,80 C280,65 320,70 360,55 C400,40 440,45 480,30 C520,18 560,22 580,18" fill="none" stroke="oklch(0.62 0.16 150)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

/* ---- Main component ---- */

interface Panel {
  num: string;
  title: string;
  body: string;
  visual: React.ReactNode;
}

export function HowItWorks() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  // Hide arrow hint after first scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollLeft > 30) setShowHint(false);
      // Track active panel
      const panelW = el.scrollWidth / 5;
      const idx = Math.round(el.scrollLeft / panelW);
      setActiveIdx(Math.min(4, Math.max(0, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const panels: Panel[] = [
    {
      num: "01 / Шаг",
      title: "Заполнить визард",
      body: "Имя отеля, типы номеров, цены, правила, контакты менеджера. Без кода. Без интеграторов. 4–6 минут.",
      visual: <WizardMini />,
    },
    {
      num: "02 / Шаг",
      title: "AI-промпт собирается сам",
      body: "Система превращает ваши данные в системный промпт для Claude 3.5 Haiku — с тоном, политикой, эскалацией.",
      visual: <PromptCard />,
    },
    {
      num: "03 / Шаг",
      title: "Подключить каналы",
      body: "WhatsApp через wappi.pro, Telegram через Bot API. Один QR — и бот уже отвечает в ваших чатах.",
      visual: <ChannelsStack />,
    },
    {
      num: "04 / Шаг",
      title: "Эскалация на менеджера",
      body: "Бот сам определяет — спор о цене, жалоба, нестандартный запрос — и переводит на оператора с уведомлением.",
      visual: <EscalationFlow />,
    },
    {
      num: "05 / Шаг",
      title: "Аналитика и ROI",
      body: "Видите количество диалогов, подтверждённых броней, расход на AI и возвращённую выручку. В одном дашборде.",
      visual: <DashMini />,
    },
  ];

  const segs = panels.length;

  return (
    <section className="how" id="how">
      <div className="container how-intro">
        <div className="reveal section-tag">02 · Как это работает</div>
        <h2 className="reveal" data-delay="1" style={{ marginTop: 18, maxWidth: "20ch" }}>
          От пустого аккаунта до <span className="accent">живого AI-консьержа</span> — за 5 минут.
        </h2>
        <p className="reveal subhead" data-delay="2" style={{ marginTop: 22 }}>
          Пять шагов. Без разработчиков. Без интеграторов. Листайте вправо.
        </p>
      </div>

      <div className="how-carousel-wrap">
        <div className="how-progress-rail">
          <div className="steps">
            {panels.map((_, i) => (
              <div key={i} className={`step-dot ${i < activeIdx ? "done" : i === activeIdx ? "active" : ""}`}
                style={{ "--p": i === activeIdx ? 1 : 0 } as React.CSSProperties} />
            ))}
          </div>
          <div className="label">
            {(activeIdx + 1).toString().padStart(2, "0")} / {segs.toString().padStart(2, "0")}
          </div>
        </div>

        <div ref={scrollRef} className="how-scroll" data-lenis-prevent>
          {panels.map((p, i) => (
            <div key={i} className="how-card">
              <div className="copy">
                <span className="num">{p.num}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
              <div className="visual">{p.visual}</div>
            </div>
          ))}
        </div>

        {showHint && (
          <div className="how-scroll-hint">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            <span>Листайте</span>
          </div>
        )}
      </div>
    </section>
  );
}
