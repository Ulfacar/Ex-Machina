'use client';

import { useState } from 'react';
import { ArrowIcon, CheckIcon, WhatsappIcon, TelegramIcon } from './icons';

interface WizardData {
  name: string;
  type: string;
  rooms: number | string;
  tone: string;
  checkin: string;
  checkout: string;
  channels: { wa: boolean; tg: boolean };
  budget: number;
}

export function WizardPreview() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    name: "Issyk Lodge",
    type: "Курорт",
    rooms: 12,
    tone: "Тёплый, на «вы»",
    checkin: "14:00",
    checkout: "12:00",
    channels: { wa: true, tg: true },
    budget: 20,
  });

  const steps = [
    { label: "Об отеле", num: "01" },
    { label: "Номера и цены", num: "02" },
    { label: "Голос бота", num: "03" },
    { label: "Каналы", num: "04" },
    { label: "Запуск", num: "05" },
  ];

  function next() { setStep((s) => Math.min(steps.length - 1, s + 1)); }
  function prev() { setStep((s) => Math.max(0, s - 1)); }

  return (
    <section className="wizard-section" id="wizard">
      <div className="container">
        <div className="reveal section-tag">04 · Визард</div>
        <h2 className="reveal" data-delay="1" style={{ marginTop: 18, maxWidth: "20ch" }}>
          Попробуйте визард — те же 5 шагов, что у вашего отеля.
        </h2>
        <p className="reveal subhead" data-delay="2" style={{ marginTop: 22 }}>
          Полностью интерактивный. Кликайте по шагам слева, меняйте поля. Никаких регистраций.
        </p>

        <div className="wizard-shell reveal" data-delay="2">
          <aside className="wizard-side">
            <div className="brand">
              <span className="mark" style={{
                width: 22, height: 22, borderRadius: 6,
                background: "linear-gradient(155deg, var(--primary-bright), var(--primary-deep))",
                color: "white", display: "grid", placeItems: "center",
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
              }}>x</span>
              ex machine · setup
            </div>
            <div className="step-list">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`step-item ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
                  onClick={() => setStep(i)}
                >
                  <div className="num">{i < step ? "✓" : s.num}</div>
                  <div>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="timer">
              <div>Среднее время:</div>
              <div className="tval">4 мин 32 сек</div>
            </div>
          </aside>

          <div className="wizard-main">
            <div className="header-row">
              <div>
                <h3>{steps[step].label}</h3>
                <div className="substep">Шаг {step + 1} из {steps.length}</div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-muted)" }}>
                {Math.round(((step + 1) / steps.length) * 100)}% готово
              </div>
            </div>

            {step === 0 && (
              <div className="form-grid">
                <label className="field">
                  Название отеля
                  <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                </label>
                <label className="field">
                  Тип объекта
                  <input value={data.type} onChange={(e) => setData({ ...data, type: e.target.value })} />
                </label>
                <label className="field">
                  Количество номеров
                  <input type="number" value={data.rooms} onChange={(e) => setData({ ...data, rooms: e.target.value })} />
                </label>
                <label className="field">
                  Город / локация
                  <input defaultValue="Иссык-Куль, Кыргызстан" />
                </label>
                <label className="field full">
                  Что отличает ваш отель? Бот расскажет об этом гостям.
                  <textarea defaultValue="Камерный курорт прямо у воды. Завтрак из локальных продуктов. Сауна с видом на горы." />
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="form-grid">
                <label className="field">Стандарт, сом/ночь<input defaultValue="5400" /></label>
                <label className="field">Делюкс, сом/ночь<input defaultValue="8400" /></label>
                <label className="field">Сьют, сом/ночь<input defaultValue="14000" /></label>
                <label className="field">Дополнительная кровать, сом<input defaultValue="1200" /></label>
                <label className="field">Заезд<input value={data.checkin} onChange={(e) => setData({ ...data, checkin: e.target.value })} /></label>
                <label className="field">Выезд<input value={data.checkout} onChange={(e) => setData({ ...data, checkout: e.target.value })} /></label>
                <label className="field full">
                  Что входит в стоимость?
                  <textarea defaultValue="Завтрак, парковка, Wi-Fi, использование сауны 1 час/день." />
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="form-grid">
                <div className="full">
                  <label style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10, display: "block" }}>Тон общения</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {["Тёплый, на «вы»", "Профессиональный, нейтральный", "Дружеский, на «ты»"].map((t) => (
                      <button
                        key={t}
                        className={`pill-toggle ${data.tone === t ? "on" : ""}`}
                        onClick={() => setData({ ...data, tone: t })}
                        style={{ padding: 14 }}
                      >{t}</button>
                    ))}
                  </div>
                </div>
                <label className="field full">
                  Эмодзи в ответах?
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    {["Не использовать", "Иногда (🌿✨)", "Часто (😊🌿✨)"].map((t, i) => (
                      <button key={t} className={`pill-toggle ${i === 1 ? "on" : ""}`}>{t}</button>
                    ))}
                  </div>
                </label>
                <label className="field full">
                  Подпись после каждого ответа (необязательно)
                  <input defaultValue="— команда Issyk Lodge" />
                </label>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div
                  className={`channel-card wa ${data.channels.wa ? "on" : ""}`}
                  onClick={() => setData({ ...data, channels: { ...data.channels, wa: !data.channels.wa } })}
                >
                  <div className="icn"><WhatsappIcon /></div>
                  <div>
                    <div className="name">WhatsApp Business</div>
                    <div className="desc">Через wappi.pro · QR-код, без API-провайдера</div>
                  </div>
                  <div className="check"></div>
                </div>
                <div
                  className={`channel-card tg ${data.channels.tg ? "on" : ""}`}
                  onClick={() => setData({ ...data, channels: { ...data.channels, tg: !data.channels.tg } })}
                >
                  <div className="icn"><TelegramIcon /></div>
                  <div>
                    <div className="name">Telegram</div>
                    <div className="desc">Через Bot API · токен от @BotFather</div>
                  </div>
                  <div className="check"></div>
                </div>
                <div className="full" style={{ gridColumn: "1 / -1", marginTop: 12 }}>
                  <label className="field">
                    Контакт менеджера для эскалации
                    <input defaultValue="+996 555 12 34 56" />
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="wizard-launch">
                <div className="pulse-ring"><CheckIcon /></div>
                <h3>Бот {data.name} готов</h3>
                <p>Системный промпт собран, каналы подключены, лимит расходов установлен на ${data.budget}/мес. Нажмите «Запустить» — и через несколько секунд бот начнёт отвечать гостям.</p>
                <button className="btn btn-primary btn-lg" style={{ marginTop: 28 }}>
                  Запустить в продакшн <ArrowIcon className="arrow" />
                </button>
              </div>
            )}

            <div className="controls">
              <button className="btn btn-ghost" onClick={prev} disabled={step === 0}>← Назад</button>
              <span className="step-counter">{step + 1} / {steps.length}</span>
              <button className="btn btn-primary" onClick={next} disabled={step === steps.length - 1}>
                Далее <ArrowIcon className="arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
