'use client';

import { useMemo, useEffect, useRef } from 'react';
import { useCountUp } from './hooks';

export function Problem() {
  const [r1Ref, r1Val] = useCountUp(67, { suffix: "%" });
  const [r2Ref, r2Val] = useCountUp(43, { suffix: " мин" });
  const [r3Ref, r3Val] = useCountUp(18, { prefix: "до ", suffix: "%" });

  const messages = useMemo(() => {
    const arr: { x: number; replied: boolean; h: number }[] = [];
    for (let h = 0; h < 24; h++) {
      const density = h >= 19 || h <= 8 ? 5 : 2;
      for (let i = 0; i < density; i++) {
        const x = ((h + Math.random()) / 24) * 100;
        const day = h >= 9 && h <= 21;
        const replied = day ? Math.random() < 0.85 : Math.random() < 0.15;
        arr.push({ x, replied, h: Math.random() * 70 + 22 });
      }
    }
    return arr;
  }, []);

  const tlRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!tlRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.3 }
    );
    io.observe(tlRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="problem">
      <div className="container">
        <div className="reveal section-tag">01 · Проблема</div>
        <h2 className="reveal" data-delay="1" style={{ marginTop: 18, maxWidth: "18ch" }}>
          Маленькие отели теряют брони — пока вы спите.
        </h2>
        <p className="reveal subhead" data-delay="2" style={{ marginTop: 22, color: "oklch(0.82 0.02 264)" }}>
          В Кыргызстане и ЦА 60–70% бронирований приходят в WhatsApp и Telegram. Гость пишет в 23:47 — отвечать некому. К утру он уже в другом отеле.
        </p>

        <div className="problem-grid">
          <div className="reveal stat-card">
            <div className="stat-tag">через мессенджеры</div>
            <div className="stat-num"><span ref={r1Ref}>{r1Val}</span></div>
            <div className="stat-label">бронирований приходит через WhatsApp и Telegram, а не через формы на сайте.</div>
          </div>
          <div className="reveal stat-card" data-delay="1">
            <div className="stat-tag">средняя реакция</div>
            <div className="stat-num"><span ref={r2Ref}>{r2Val}</span></div>
            <div className="stat-label">— в это время гость уже сравнивает с двумя другими вариантами или засыпает.</div>
          </div>
          <div className="reveal stat-card" data-delay="2">
            <div className="stat-tag">конверсия</div>
            <div className="stat-num"><span ref={r3Ref}>{r3Val}</span></div>
            <div className="stat-label">падает, если первый ответ задерживается больше чем на 30 минут (внутренние данные пилотов).</div>
          </div>
        </div>

        <div ref={tlRef} className="lost-timeline reveal" data-delay="2">
          <h4>Один день в WhatsApp небольшого отеля</h4>
          <div className="sub">Зелёные — отвеченные сообщения. Красные — потеряны или отвечены утром. Видно, что ночью бизнес стоит.</div>
          <div className="timeline-track">
            <div className="timeline-night-overlay" style={{ left: "0%", width: `${(9 / 24) * 100}%` }}></div>
            <div className="timeline-night-overlay" style={{ left: `${(22 / 24) * 100}%`, right: "0%" }}></div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`timeline-msg ${m.replied ? "replied" : "lost"}`}
                style={{ left: `${m.x}%`, height: `${m.h}%`, transitionDelay: `${i * 8}ms` }}
              />
            ))}
            <div className="timeline-hours">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span>
            </div>
          </div>
          <div className="timeline-legend">
            <div><span className="swatch" style={{ background: "var(--accent)" }}></span>Отвечено вовремя</div>
            <div><span className="swatch" style={{ background: "var(--danger)" }}></span>Потеряно или поздний ответ</div>
          </div>
        </div>
      </div>
    </section>
  );
}
