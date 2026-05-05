# Session Recap — 2026-05-06 (Party-mode planning по реальному Trello state)

> **Если ты новый Claude:** memory не синхронизируется между машинами. Single source of truth = этот recap + `SESSION_RECAP_2026_05_04.md`. Сессия короткая, без коммитов кода — только ревизия priorities.

---

## TL;DR

- 🔍 **Открытие:** `SESSION_RECAP_2026_05_04.md` назвал `#26` / `#17` / `#25` / ротацию `OPENROUTER_API_KEY` критическим Sprint 2 carryover. **По Trello всё это в Done.** Recap был стейл — между 02.05 и 04.05 кто-то (Алан или его аль-бот) закрыл Sprint 2 целиком, но не обновил memory.
- ✅ **Sprint 2 фактически закрыт.** Доска `Done` теперь содержит 39 карточек, включая `#26`, `#17`, `#25`, `#33 ROI report`, ротацию ключа.
- 🎉 **Запустил BMad party-mode** (Mary / John / Victor / Bob / Murat) для приоритизации Sprint 3. Команда сошлась на P0 = `demo-bot fix`. Разошлась по лендингу — нужны ответы Алана.
- 🛑 **Сессия пауза по запросу Алана.** Жду 2 ответа на стратегические вопросы → продолжим выбор Sprint 3 candidates.

---

## Реальное состояние Trello (на 06.05)

**Backlog (31 карточка) — топ сюрпризы для pre-sales:**
- 🔴 `BUG: /hotels/{id}/demo bot returns 'не знаю ответа'` — sales-killer, Назира демонстрирует именно эту страницу
- 🔴 `Strategic mismatch: landing pricing ($29/$249/$299) vs pitch ($800+$40)` — у клиента ломается доверие на первом касании
- 🟠 `Strategic: landing hero targets agencies, not hotel owners` — wrong audience
- 🟡 `BUG: /dashboard/stats — 'Пополните баланс $0.00' looks like prod`
- 🟡 `BUG: tz-aware datetime sweep — 6 more naive utcnow() call-sites`
- 🟢 `Tech debt: Redis для operator_reply_state` (ждёт триггера: Railway autoscale OR 5+ отелей)
- 🟢 `Tech debt: followup-tasks → Redis (race condition на multi-replica)`

**Process-долги:**
- ✅ `Process: untracked-check в начале сессии`
- ✅ `Process: party-mode перед каждой L-story (DoR)` — следуем этому правилу прямо сейчас

**Backlog stories ($HIGH, R1b/R1c/R2):** `#16` после-оплаты WA, `#22` роли менеджеров 2-4 на отель, `#3` рефералка, `Shelter outreach`, `#14` Kaspi/ElCard

**In Progress (1):** `Intel: NURAI под персоной "сын/Айгуль"` — ждём ответ NURAI WA-бота с 22.04

**Done (39):** Sprint 1 + Sprint 2 + 14 D-исторических.

---

## Что сказала команда BMad

### 📊 Mary (Analyst) — root cause hypothesis
3 критических сигнала (лендинг pricing, питч pricing, демо-бот) — **один root cause:** после refounding 20.04 поменяли модель монетизации, но продуктовый surface отстал. Лендинг — артефакт старой стратегии. Демо-бот, возможно, тоже использует старый промпт/конфиг.

### 📋 John (PM) — приоритеты
- **P0:** demo-bot fix. "Не знаю ответа" = sales-killer. Без рабочего демо весь питч — pitch без proof.
- **P1:** landing pricing — quick fix (скрыть блок или "от $800")
- **P2:** всё остальное (`#22`, `#16`, рефералки) — rich-people problems, появятся при 3-м платящем клиенте

### ⚡ Victor (Innovation Strategist) — стратегический challenge
Лендинг не "устарел" — он **транслирует другую ценностную пропозицию**. SaaS self-serve $29 ≠ B2B service $800+$40. Это разные продукты с разными воронками. **Не делай rebuild за $1. Либо снеси лендинг (high-touch only через Назиру), либо сделай полный pivot на "запросить демо" + Ton Azure case.**

### 🏃 Bob (Scrum Master) — Sprint 3 кандидаты по размеру
| Карточка | Size | Note |
|---|---|---|
| Demo-bot fix | M (полдня debug) | P0 |
| Landing pricing fix | S (1ч) | если quick-fix путь |
| /dashboard/stats $0.00 | S (2ч) | |
| Tz-aware datetime ×6 | M (полдня механика) | |
| Landing v2 pivot | L | **нужен party-mode/DoR** |
| Shelter outreach | L | нужен decision Алана |

### 🧪 Murat (Test Architect) — bug-триаж
Запускать в порядке: **demo-bot → landing pricing → stats → datetime sweep**. Demo-bot bug должен быть воспроизведён в regression-тесте до фикса (правило из `feedback_happy_path_testing.md`).

---

## ⏳ Открытые вопросы к Алану (продолжить отсюда!)

Команда сошлась на demo-bot = P0, но **расходится по лендингу**. Чтобы выбрать tactical-fix vs strategic-pivot, нужны от тебя 2 ответа:

1. **Назира УЖЕ даёт ссылку на лендинг клиентам?** Или продаёт через PDF/звонок и лендинг никто не видит?
2. **Лендинг существует для самой Назиры (её закладка) или для self-serve клиентов из Google?**

От этого выбираем:
- Если "только Назира" → снести лендинг, оставить one-pager (Ton Azure case + WA contact)
- Если "self-serve тоже" → нужен landing-v2 как L-story с full DoR
- Если "Назира пока никому не даёт" → tactical pricing fix на час и забыть

---

## Что сделать ПЕРВЫМ в следующей сессии

1. **Получить от Алана ответы на 2 вопроса выше** (или прочитать в чате если он ответил).
2. **Воспроизвести demo-bot bug:** открыть `/hotels/{id}/demo`, попробовать стандартный booking flow, поймать "не знаю ответа", найти в логах источник (старый промпт? отсутствует hotel.payment_details? broken cross-dialog memory?).
3. **Написать regression-тест ДО фикса** (правило happy-path testing).
4. **Решить landing fate** на основе ответов Алана + перевести в Sprint 3.

---

## Накопленный техдолг (актуально на 06.05)

| # | Задача | Приоритет | Срочность |
|---|---|---|---|
| 1 | **🔴 Demo-bot "не знаю ответа" bug** — P0 sales-killer | **Critical** | Sprint 3 #1 |
| 2 | **Landing pricing/positioning mismatch** — strategic decision pending | High | После ответов Алана |
| 3 | **Memory `project_exmachina_state.md` обновить** — Sprint 2 closed, не carryover | Medium | До крупного кода |
| 4 | `/dashboard/stats $0.00` looks like prod — UI-fix | Medium | Sprint 3 |
| 5 | Tz-aware datetime sweep ×6 call-sites | Medium | Sprint 3-4 |
| 6 | **Чистка корня** — 57 PNG + presentation.html → `.gitignore` или `docs/screenshots/` | Low | Когда удобно |
| 7 | SESSION_RECAP 2026_04_30 + 2026_05_01 не написаны (pre-pitch hotfixes + питч-тренировка) | Low | Cross-device |
| 8 | 3-я панель Support Inbox + ROI-виджет (design в `SESSION_RECAP_2026_05_02.md`) | Medium | Когда увидим как встроить в `/cabinet` Эмира |

---

## Открытые ожидания

- ⏳ **Ответ Алана** на 2 стратегических вопроса (см. выше)
- ⏳ **Ответ Эмира/его Claude** на наши 27 ответов (с 04.05, новых коммитов от него на 06.05 нет)
- ⏳ **Назира onboarding** в Ex-Machina — после этого pipeline должен ожить
- ⏳ **Ответ NURAI WA-бота** на 3 вопроса от 22.04 (Trello: `Intel: NURAI` In Progress)

---

## Состояние коммитов

На начало сессии 06.05: `48db735` SESSION_RECAP 2026-05-04, локально = origin/main, 0 unpushed.

После этого recap'а: 1 unpushed commit (этот recap + memory update).

---

*Session 2026-05-06 пауза. Алан вернётся когда будет готов дать ответы на 2 вопроса.*
