'use client';

import { useState } from 'react';
import {
  ArrowIcon,
  CheckIcon,
  BoltIcon,
  ChatIcon,
  ShieldIcon,
  BellIcon,
  ClockIcon,
  WalletIcon,
  BarIcon,
  BranchIcon,
} from './icons';

/* ====== ROI Calculator ====== */

export function ROICalculator() {
  const [rooms, setRooms] = useState(12);
  const [adr, setAdr] = useState(7500);
  const [msgs, setMsgs] = useState(40);
  const [missed, setMissed] = useState(35);

  const recoveredBookings = Math.round((msgs * (missed / 100)) * 0.28 * 30 / 12);
  const avgStay = 2.4;
  const recoveredRevenue = recoveredBookings * adr * avgStay;
  const monthlyRev = Math.round(recoveredRevenue / 12);
  const monthlyCost = 20 + Math.min(40, msgs * 0.04 * 30);
  const roiX = monthlyCost > 0 ? Math.round((monthlyRev / 90) / monthlyCost) : 0;

  return (
    <section className="roi" id="roi">
      <div className="container">
        <div className="reveal section-tag">05 · Калькулятор ROI</div>
        <h2 className="reveal" data-delay="1" style={{ marginTop: 18, maxWidth: "20ch" }}>
          Сколько <span style={{ color: "oklch(0.85 0.14 150)" }}>денег</span> вы возвращаете в кассу?
        </h2>
        <p className="reveal subhead" data-delay="2" style={{ marginTop: 22, color: "oklch(0.85 0.02 264)" }}>
          Двигайте ползунки. Расчёт основан на средних данных пилотных отелей: 28% диалогов в чатах превращаются в подтверждённые брони, средний стэй 2.4 ночи.
        </p>

        <div className="roi-grid">
          <div className="roi-controls reveal" data-delay="2">
            <div className="control">
              <label>Номеров в отеле <span className="v">{rooms}</span></label>
              <input type="range" min="3" max="50" value={rooms} onChange={(e) => setRooms(+e.target.value)} />
            </div>
            <div className="control">
              <label>Средняя цена за ночь, сом <span className="v">{adr.toLocaleString("ru-RU")}</span></label>
              <input type="range" min="2500" max="25000" step="100" value={adr} onChange={(e) => setAdr(+e.target.value)} />
            </div>
            <div className="control">
              <label>Сообщений в WhatsApp/TG / день <span className="v">{msgs}</span></label>
              <input type="range" min="5" max="150" value={msgs} onChange={(e) => setMsgs(+e.target.value)} />
            </div>
            <div className="control">
              <label>% сейчас остаётся без ответа <span className="v">{missed}%</span></label>
              <input type="range" min="5" max="80" value={missed} onChange={(e) => setMissed(+e.target.value)} />
            </div>
          </div>

          <div className="roi-readout reveal" data-delay="3">
            <div className="row">
              <span>Доп. броней / месяц</span>
              <span className="v">+{recoveredBookings}</span>
            </div>
            <div className="row">
              <span>Возвращённая выручка</span>
              <span className="v">{Math.round(monthlyRev).toLocaleString("ru-RU")} сом/мес</span>
            </div>
            <div className="row">
              <span>Стоимость ex machine</span>
              <span className="v">${Math.round(monthlyCost)}/мес</span>
            </div>
            <div className="big-row">
              <div className="lbl">ROI</div>
              <div className="v">×{Math.max(1, roiX)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== Features ====== */

export function Features() {
  const items = [
    { icon: <BoltIcon />, t: "Визард без кода", d: "Владелец заполняет данные → система сама генерирует системный промпт." },
    { icon: <ChatIcon />, t: "WhatsApp + Telegram", d: "Мультиканальность через wappi.pro и Telegram Bot API." },
    { icon: <ShieldIcon />, t: "Умная пост-обработка", d: "Удаление тегов, навязчивых вопросов, детект «сломанных» ответов с авто-ретраем." },
    { icon: <BellIcon />, t: "Эскалация на менеджера", d: "Бот сам определяет, когда нужен человек, и уведомляет оператора." },
    { icon: <ClockIcon />, t: "Автофоллоапы", d: "Напоминания через 10 и 15 минут, если гость замолчал." },
    { icon: <WalletIcon />, t: "Бюджет-контроль", d: "Лимит расходов на AI для каждого отеля — от $5 до $40/мес." },
    { icon: <BarIcon />, t: "ROI-аналитика", d: "Дашборд: диалоги, подтверждённые брони, возврат инвестиций." },
    { icon: <BranchIcon />, t: "Версионирование промптов", d: "Staging → production с возможностью отката одним кликом." },
  ];

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="features-head">
          <div>
            <div className="reveal section-tag">06 · Что внутри</div>
            <h2 className="reveal" data-delay="1" style={{ marginTop: 18 }}>
              Восемь вещей, которые делают бот <span className="accent" style={{
                background: "linear-gradient(120deg, var(--primary-bright), var(--accent))",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent"
              }}>надёжным</span>.
            </h2>
          </div>
          <p className="reveal subhead" data-delay="2">
            Не «AI-магия». Каждая фича — ответ на боль, которую мы поймали в живых диалогах с гостями за два месяца пилота.
          </p>
        </div>

        <div className="features-grid">
          {items.map((f, i) => (
            <div key={i} className="feature reveal" data-delay={(i % 4) + 1}>
              <div className="icn">{f.icon}</div>
              <h4>{f.t}</h4>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ====== Case Study ====== */

export function CaseStudy() {
  return (
    <section className="case" id="case">
      <div className="container">
        <div className="reveal section-tag">07 · Кейс</div>
        <div className="case-grid" style={{ marginTop: 56 }}>
          <div>
            <h2 className="reveal" data-delay="1" style={{ marginBottom: 28 }}>
              Ton Azure · Иссык-Куль
            </h2>
            <p className="case-quote reveal" data-delay="2">
              «За два месяца бот ответил на 312 ночных сообщений. Без него мы бы потеряли половину — гости просто шли в соседние отели. Теперь утром у меня список подтверждённых броней, а не пропущенных вызовов.»
            </p>
            <div className="case-attr reveal" data-delay="3">
              <div className="ava">АТ</div>
              <div>
                <div className="who">Айгуль Темирова</div>
                <div className="role">Управляющая Ton Azure Resort</div>
              </div>
            </div>
            <div className="case-stats reveal" data-delay="4">
              <div className="stat">
                <div className="v">312</div>
                <div className="l">диалогов за 2 месяца</div>
              </div>
              <div className="stat">
                <div className="v">87</div>
                <div className="l">подтверждённых броней</div>
              </div>
              <div className="stat">
                <div className="v">×52</div>
                <div className="l">ROI к стоимости подписки</div>
              </div>
            </div>
          </div>
          <div className="case-visual reveal" data-delay="2">
            <div className="placeholder-mono">
              ФОТО КУРОРТА · TON AZURE
              <span>4:5 — место под реальный снимок отеля на Иссык-Куле</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== Pricing ====== */

export function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="reveal section-tag">08 · Цены</div>
        <h2 className="reveal" data-delay="1" style={{ marginTop: 18, maxWidth: "18ch" }}>
          Один онбординг — и работает годами.
        </h2>
        <p className="reveal subhead" data-delay="2" style={{ marginTop: 22 }}>
          Никаких процентов с броней, никаких сюрпризов. AI-расходы оплачиваете напрямую — мы только собираем платформу.
        </p>

        <div className="pricing-grid">
          <div className="price-card reveal" data-delay="2">
            <div className="name">Self-serve</div>
            <div className="desc">Для отелей, готовых пройти визард самостоятельно.</div>
            <div className="price-row">
              <div className="price">$0<small>/онбординг</small></div>
              <div className="sub-price">+ $20/мес подписка</div>
            </div>
            <ul>
              <li><CheckIcon /> WhatsApp + Telegram</li>
              <li><CheckIcon /> Визард, промпты, эскалация</li>
              <li><CheckIcon /> ROI-дашборд</li>
              <li><CheckIcon /> Бюджет $5–40/мес на AI</li>
              <li><CheckIcon /> Email-поддержка</li>
            </ul>
            <button className="cta primary">Попробовать бесплатно <ArrowIcon className="arrow" style={{ marginLeft: 6 }} /></button>
          </div>

          <div className="price-card feature reveal" data-delay="3">
            <div className="name">С онбордингом</div>
            <div className="desc">Мы сами настроим, обучим персонал, подключим каналы.</div>
            <div className="price-row">
              <div className="price">$700<small>/единоразово</small></div>
              <div className="sub-price">+ $20/мес подписка</div>
            </div>
            <ul>
              <li><CheckIcon /> Всё из Self-serve</li>
              <li><CheckIcon /> Настройка под ваш отель</li>
              <li><CheckIcon /> Обучение менеджеров (онлайн)</li>
              <li><CheckIcon /> Тонкая настройка тона и стиля</li>
              <li><CheckIcon /> Приоритетная поддержка в Telegram</li>
              <li><CheckIcon /> 30 дней — гарантия возврата</li>
            </ul>
            <button className="cta primary">Записаться на онбординг <ArrowIcon className="arrow" style={{ marginLeft: 6 }} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== Roadmap ====== */

export function Roadmap() {
  const items = [
    { when: "Q2 2026", title: "Мультиязычность", body: "Английский, кыргызский, казахский — бот переключается по языку гостя." },
    { when: "Q2 2026", title: "Триал-режим", body: "Запуск без онбординга — 14 дней бесплатно, чтобы попробовать на живых гостях." },
    { when: "Q3 2026", title: "Интеграция с Google Calendar", body: "Синхронизация занятости номеров с календарём отеля." },
    { when: "Q3 2026", title: "PMS · TravelLine", body: "Прямая связь с системой управления — реальные остатки номеров в реальном времени." },
    { when: "Q4 2026", title: "Голосовые сообщения", body: "WhatsApp-голос → Whisper → Claude → ответ. Гости часто пишут голосом." },
    { when: "Q4 2026", title: "Оплата через Stripe / Elcard", body: "Гость подтверждает бронь и платит прямо в чате — без перехода на сайт." },
  ];

  return (
    <section className="roadmap" id="roadmap">
      <div className="container">
        <div className="reveal section-tag">09 · Роадмап</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginTop: 18 }}>
          <h2 className="reveal" data-delay="1" style={{ maxWidth: "16ch" }}>Куда мы идём.</h2>
          <p className="reveal subhead" data-delay="2">
            Раз в квартал ex machine получает большое обновление. Все клиенты получают новые фичи бесплатно.
          </p>
        </div>
        <div className="roadmap-list">
          {items.map((it, i) => (
            <div key={i} className="roadmap-item reveal" data-delay={(i % 3) + 1}>
              <div className="when">{it.when}</div>
              <div className="what">
                <h4>{it.title}</h4>
                <p>{it.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ====== FAQ ====== */

export function FAQ() {
  const items = [
    {
      q: "Что если бот ответит неправильно?",
      a: "Мы тестируем каждый промпт на 50+ типичных запросах перед запуском. Если бот не уверен — он эскалирует менеджеру. Все диалоги логируются: вы видите, на чём бот «споткнулся», и одним кликом улучшаете промпт.",
    },
    {
      q: "WhatsApp нужен Business API?",
      a: "Нет. Мы работаем через wappi.pro — он подключает обычный WhatsApp-аккаунт через QR-код. Никаких 200 USD/мес за официальный API, никаких длинных согласований с Meta.",
    },
    {
      q: "Сколько стоит AI на самом деле?",
      a: "Один диалог на Claude 3.5 Haiku — $0.01–0.05 в среднем. Для отеля с 30 диалогами/день это $9–45/мес. Вы можете установить жёсткий лимит — например, $20/мес — и бот сам остановится при достижении.",
    },
    {
      q: "А если я хочу полностью контролировать ответы?",
      a: "Можно. Включите режим «черновик» — бот предлагает ответ менеджеру, тот отправляет одним кликом. Это всё равно в 4 раза быстрее, чем писать с нуля.",
    },
    {
      q: "Какие данные вы собираете?",
      a: "Только тексты диалогов и метаданные (время, канал, длина). Все хранится в PostgreSQL на Railway, EU/EAEU регион. Гостевые данные не передаются третьим сторонам, кроме Anthropic для генерации ответов.",
    },
    {
      q: "Можно интегрировать с моей PMS?",
      a: "Сейчас — через webhook'и (мы делаем это руками). Прямая интеграция с TravelLine — Q3 2026. Для других PMS пишите — обсудим.",
    },
  ];

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="reveal section-tag">10 · FAQ</div>
        <h2 className="reveal" data-delay="1" style={{ marginTop: 18 }}>
          Что обычно спрашивают.
        </h2>
        <div className="faq-list">
          {items.map((it, i) => (
            <details key={i} className="faq-item">
              <summary>
                <span>{it.q}</span>
                <span className="ico">+</span>
              </summary>
              <div className="ans">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ====== CTA Banner ====== */

export function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="container">
        <div className="cta-banner-inner reveal">
          <h2 style={{ maxWidth: "18ch", marginInline: "auto" }}>
            Гость, который пишет в три ночи, — ваш.
          </h2>
          <p>
            Подключите ex machine за 5 минут. Первый месяц с онбордингом — гарантия возврата, если бот не вернёт хотя бы одну бронь.
          </p>
          <div className="ctas">
            <a className="btn btn-primary btn-lg" href="#wizard">Запустить визард <ArrowIcon className="arrow" /></a>
            <a className="btn btn-ghost btn-lg" href="#demo">Сначала попробовать демо</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== Footer ====== */

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="copyright" style={{ borderTop: 0, paddingTop: 0, justifyContent: "flex-start" }}>
              <div className="brand-line">
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: "linear-gradient(155deg, var(--primary-bright), var(--primary-deep))",
                  color: "white", display: "grid", placeItems: "center",
                  fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700,
                }}>x</span>
                ex machine
              </div>
            </div>
            <p style={{ marginTop: 16, maxWidth: "32ch", fontSize: 13.5 }}>
              AI-консьерж для маленьких отелей Кыргызстана и Центральной Азии. Сделано в Бишкеке.
            </p>
          </div>
          <div>
            <h5>Продукт</h5>
            <ul>
              <li><a href="#features">Фичи</a></li>
              <li><a href="#pricing">Цены</a></li>
              <li><a href="#demo">Демо</a></li>
              <li><a href="#roadmap">Роадмап</a></li>
            </ul>
          </div>
          <div>
            <h5>Кейсы</h5>
            <ul>
              <li><a href="#case">Ton Azure</a></li>
              <li><a href="#">Готовится…</a></li>
            </ul>
          </div>
          <div>
            <h5>Связаться</h5>
            <ul>
              <li><a href="#">hello@exmachine.kg</a></li>
              <li><a href="#">+996 555 12 34 56</a></li>
              <li><a href="#">@exmachine_team</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <div>© 2026 ex machine · Бишкек, Кыргызстан</div>
          <div style={{ display: "flex", gap: 18 }}>
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Условия</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
