# SESSION RECAP — 2026-05-13

## Главное событие сессии

ПВТ КР открыл набор на **Dive Into Silicon Valley** (2 нед) + **Unicorn from KG** (5 нед в Draper University). Финал — KIT Forum 2026.

**Жёсткий timeline:**
- 2026-05-18 12:00 — deadline заявки (НЕ продлевается)
- 2026-06-08 — pitch перед жюри
- November 2026 — поездка для прошедших

**English only.** Инсайдер: «у конкурентов проекты ни о чём».

**Решение Алана:** «Подаю, не пройду — значит не пройду». Cost-capped attempt, не bet-the-company.

## BMad party mode (все 18 агентов высказались)

Консенсус:
- ✅ Подавать — 18/18
- ✅ Заявка под Unicorn-bar (выше планка), Dive Into SV — fallback
- ⚠️ Главные риски: English fluency, live demo reliability, отсутствие LOI/MRR на pitch
- 📋 Алан явно отказался от части плана (LOI pressure, English coach) — позиция «cost-capped»

Полный лог party-mode не сохранён отдельным файлом, но ключевые insights в `memory/project_sv_trip_2026.md`.

## Что сделано в коде (5 коммитов запушено)

| SHA | Что |
|---|---|
| `471a587` | `feat(landing): align pricing to pitch — $800 setup + $40/mo single tier` |
| `8bc5d42` | `feat(demo): live API health badge in /hotels/{id}/demo header` |
| `3431977` | `feat(sv-pitch): English demo hotel seed + smoke-test scripts` |
| `eb0ebf5` | `chore(deps): refresh package-lock after npm install` |

Plus 10 carryover коммитов Sprint 3 от 12.05 (Эмировы регрессии) — тоже улетели в prod в одном push'е.

### Pricing rewrite (`SectionsRest.tsx`)
- Было: 2 tier'а — Self-serve `$0+$20/мес` и С онбордингом `$700+$20/мес`
- Стало: 1 tier — Полный онбординг **$800 единоразово + $40/мес платформа**
- ROI calc base monthly cost: `$20 → $40`
- **Why:** жюри откроет URL → увидит «начать бесплатно» → услышит на pitch «$800 минимум» = credibility kill.

### Health badge (`/hotels/[id]/demo/page.tsx`)
- Pings `/health` каждые 30с, показывает зелёную мигающую точку + `API · live`
- Красный `API · offline` если backend down
- **Why:** во время live demo жюри должно видеть «реальная инфра», не догадываться «лагает / лежит».

### English demo hotel (`backend/scripts/seed_sv_demo.py`)
- Создаёт Hotel slug=`sv-demo-english`, name=«Pearl Lake Boutique Hotel»
- Полный English `system_prompt` (rooms / rules / amenities / escalation / tone)
- Идемпотентный — повторный run обновляет prompt
- Локально: hotel id=3
- **На prod-Railway пока НЕ запущен** — это первая задача завтра

### Smoke test (`backend/scripts/smoke_test_sv_demo.py`)
- 5 типовых English-вопросов гостя → real LLM via `/preview-chat/simulate`
- Сохраняет транскрипт в `docs/sv_smoke_test_<date>.md`
- ~$0.025 per run
- Локально не запускается (dummy `OPENROUTER_API_KEY`), на prod-Railway — ок
- **На prod-Railway пока НЕ запущен**

### Trello (`scripts/create_sv_card.py`)
- UTF-8 safe creator (обошёл cp1251 mojibake bug `seed_trello.py`)
- Карточка `🌉 Кремневая долина` в `In Progress`, due 2026-05-18
- https://trello.com/c/4ju96ygd

## Локальная проверка (Алан подтвердил визуально)

- `http://127.0.0.1:3001` — Landing с новым Pricing ✅
- `http://127.0.0.1:3001/hotels/3/demo` — Pearl Lake + green health badge ✅
- Бот в чате локально не отвечает (dummy ключ) — это норма
- Note: dev-server встал на 3001 не 3000 (что-то висело на 3000)

## Локальные dep-фиксы (нужны на новой машине тоже)

- `npm install lenis` в `frontend-platform/` — пакет был в `package.json` но не установлен (наследие commit'а `d452d70` от Эмира)
- Backend Python deps без изменений

## Prod после push'а (eb0ebf5)

- `exmachina.up.railway.app` — Landing с `$800+$40` ✅ verified
- `exmachina-api.up.railway.app/health` → 200 ✅
- В prod-Postgres English hotel **ещё нет** — пользователь не дошёл до seed step

## ⏭ Завтра/следующая сессия (приоритет сверху вниз)

1. **`railway run python scripts/seed_sv_demo.py`** на проде → получить `Hotel ID` (X) → проверить `exmachina.up.railway.app/hotels/{X}/demo` живой URL для заявки
2. **Найти форму ПВТ КР** (ссылка «в шапке профиля» в их Instagram/Telegram) → выписать все поля → понять формат (text/video/deck)
3. **English pitch deck + script** — Paige (перевод из `docs/sales/invest_day_speech_2026_05_01.md`) + Caravaggio (deck-структура из 10 слайдов)
4. **Demo screencast 30 сек** — после того как seed на проде запустится
5. **Submit** к 17.05 11:00 (буфер до 18.05 12:00 deadline)

## Память (created/updated this session)

- ✨ NEW: `memory/project_sv_trip_2026.md` — полный план программы + sprint
- 📝 UPDATE: `memory/MEMORY.md` — добавлена ссылка на SV trip memory

## Сессия закрыта

Алан ушёл домой. Серверы заглушены. Все коммиты в `origin/main`. Railway автодеплой прошёл (verified poll). Trello card актуальна. Память синхронизирована.
