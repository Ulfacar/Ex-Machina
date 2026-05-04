'use client';

import { useState, useEffect } from 'react';
import { ArrowIcon, CheckIcon, WhatsappIcon, TelegramIcon } from './icons';
import { fmtRub } from './hooks';

interface Bubble {
  who: string;
  text: string;
  t: string;
}

export function Hero() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [roi, setRoi] = useState(0);

  useEffect(() => {
    const script: Bubble[] = [
      { who: "guest", text: "Здравствуйте! Есть номер на 14\u201317 марта на двоих?", t: "23:47" },
      { who: "bot", text: "Здравствуйте \ud83c\udf3f На 14\u201317 марта свободен Делюкс с видом на озеро \u2014 8 400 сом/ночь. Завтрак включён. Подтвердить?", t: "23:47" },
      { who: "guest", text: "А парковка есть? и ранний заезд можно?", t: "23:48" },
      { who: "bot", text: "Парковка бесплатная для гостей. Ранний заезд \u2014 с 11:00, без доплаты при наличии. Сделать предварительную бронь?", t: "23:48" },
      { who: "guest", text: "Да, бронируйте", t: "23:49" },
      { who: "bot", text: "Бронь №A-2841 закреплена. Менеджер подтвердит и пришлёт реквизиты утром \u2713", t: "23:49" },
    ];
    let i = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    setBubbles([]);
    const tick = () => {
      if (cancelled) return;
      if (i >= script.length) {
        timer = setTimeout(() => {
          if (cancelled) return;
          i = 0;
          setBubbles([]);
          timer = setTimeout(tick, 600);
        }, 4500);
        return;
      }
      const item = script[i];
      if (!item) return;
      setBubbles((b) => [...b, item]);
      i++;
      timer = setTimeout(tick, 1700);
    };
    timer = setTimeout(tick, 800);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1800);
      const eased = 1 - Math.pow(1 - p, 3);
      setRoi(Math.round(184000 * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = setTimeout(() => requestAnimationFrame(tick), 700);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="reveal in eyebrow">
              <span className="dot"></span>
              <span>AI-консьерж для отелей · <strong>работает в боевом режиме</strong></span>
            </div>
            <h1 className="reveal in" data-delay="1">
              Гости пишут <span className="strike">в три ночи</span>.
              <br />
              Бот отвечает — <span className="accent">бронь подтверждена.</span>
            </h1>
            <p className="hero-sub reveal in" data-delay="2">
              ex machine — это AI-консьерж на базе Claude, который за 5 минут подключается к WhatsApp и Telegram вашего отеля. Отвечает гостям 24/7, доводит до брони, эскалирует менеджеру когда нужно человеку.
            </p>
            <div className="hero-cta reveal in" data-delay="3">
              <a className="btn btn-primary btn-lg" href="#wizard">Запустить бота за 5 минут <ArrowIcon className="arrow" /></a>
              <a className="btn btn-ghost btn-lg" href="#demo">Попробовать живое демо</a>
            </div>
            <div className="hero-trust reveal in" data-delay="4">
              <div><strong>Ton Azure</strong> · Иссык-Куль · 2+ месяца в продакшне</div>
              <div className="sep"></div>
              <div><strong>~150</strong> диалогов / месяц</div>
              <div className="sep"></div>
              <div><strong>$0.03</strong> средний AI-чек</div>
            </div>
          </div>

          <div className="hero-stage">
            <div className="hero-glow"></div>

            <div className="hero-chip chip-claude">
              <span className="pulse"></span>
              <span className="kbd">claude · haiku</span>
              <span className="ms">1.4s</span>
            </div>
            <div className="hero-chip chip-channel">
              <span className="ch ch-wa"><WhatsappIcon /></span>
              <span className="ch ch-tg"><TelegramIcon /></span>
              <span className="ch-text">2 канала · live</span>
            </div>

            <div className="hero-device">
              <div className="hero-device-bar">
                <div className="hd-avatar"></div>
                <div className="hd-meta">
                  <div className="hd-name">Ваш AI-отельер<span className="hd-verified" title="верифицирован"><CheckIcon /></span></div>
                  <div className="hd-sub">
                    <span className="hd-pulse"></span>
                    отвечает за гостей · 24/7
                  </div>
                </div>
                <div className="hd-actions">
                  <span className="hd-action">&#8984;K</span>
                </div>
              </div>

              <div className="hero-thread">
                {bubbles.map((b, i) => (
                  <div key={i} className={`hbubble hb-${b.who}`}>
                    {b.who === "bot" && <span className="hb-tag">AI</span>}
                    <div className="hb-body">
                      {b.text}
                      <div className="hb-foot">
                        <span className="hb-time">{b.t}</span>
                        {b.who === "bot" && <span className="hb-status"><CheckIcon /> доставлено</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {bubbles.length > 0 && bubbles.length < 6 && bubbles[bubbles.length - 1] && bubbles[bubbles.length - 1].who === "guest" && (
                  <div className="hbubble hb-bot">
                    <span className="hb-tag">AI</span>
                    <div className="hb-body hb-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
              </div>

              <div className="hero-composer">
                <span className="hc-hint">бот печатает за вас</span>
                <span className="hc-cursor"></span>
              </div>
            </div>

            <div className="roi-card">
              <div className="label">Возвращённая выручка / мес</div>
              <div className="value">{fmtRub(roi)}</div>
              <div className="delta"><ArrowIcon style={{ transform: "rotate(-45deg)" }} /> +21 бронь, которую бы упустили</div>
            </div>
          </div>
        </div>

        <div className="logos-strip reveal">
          <div className="label">Малые и средние отели Кыргызстана и Центральной Азии используют ex machine</div>
          <div className="logos-row">
            <div className="logo-placeholder">Ton Azure</div>
            <div className="logo-placeholder">Каприз</div>
            <div className="logo-placeholder">Royal Beach</div>
            <div className="logo-placeholder">Радуга</div>
            <div className="logo-placeholder">Bel-Tam</div>
          </div>
        </div>
      </div>
    </section>
  );
}
