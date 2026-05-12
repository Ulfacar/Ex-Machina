# Session Recap — 2026-05-12 (Demo-bot P0 fix — regression от Emir's merge закрыт)

> **Если ты новый Claude:** memory не синхронизируется между машинами. Single source of truth для этой сессии = этот recap + `SESSION_RECAP_2026_05_06.md` (предыдущий — party-mode planning).

---

## TL;DR

- 🎯 **Demo-bot bug — P0 sales-killer — найден за 10 минут code-archaeology, без воспроизведения.**
- 🔥 **Root cause: regression от `73637de` (Emir's frontend redesign merge, 16.04.2026).** Его fork отделился *до* AI-интеграции от `8711006` (14.04), при merge перетёрло `BotPreview.tsx` стейл-версией без API-вызова. Bug жил **26 дней**.
- ✅ **Backend `/preview-chat/simulate` всё это время работал.** Дыра была чисто в UI — BotPreview перестал звать backend и крутил client-side `if/else` на 7 кейвордов.
- ✅ **Fix зашит** в `BotPreview.tsx`: восстановил `sendMessage()` + typing indicator, сохранил весь dark-theme styling Эмира.
- ✅ **6 regression-тестов** (`backend/tests/test_simulate_chat.py`) — все pass, фиксируют backend contract.
- ✅ **3 модульных коммита** (test, fix, recap), unpushed.

---

## Что было сделано

### 1. Code archaeology — root cause за 10 минут

`/hotels/{id}/demo` → page.tsx → `<BotPreview hotelId={hotel.id} />`. Открыл компонент — там **синхронная функция `generateBotResponse(question)`** с 7 if-блоками (цен/адрес/телефон/заезд/услуг/назва/расскаж). Всё что не попало → `'Извините, я пока не знаю ответа на этот вопрос. Спросите что-то ещё! 😊'`. **Никакого AI-вызова не было.**

Git blame показал:
- `8711006` (14.04) — Алан добавил **реальный** `/preview-chat` вызов + commit message буквально пишет: *"Real AI preview: BotPreview calls /preview-chat instead of client-side fake"*.
- `73637de` (16.04) — Эмир мерджит свой fork `emirkhayam/Ex-Machina-1`, **снёс `import api`**, удалил async `sendMessage()`, заменил на client-side stub. Commit message — *"feat: Emir's frontend redesign — dark theme, effects, Prism UI"* (визуальный refactor; никто не заметил функциональный regression).

### 2. Regression test — `backend/tests/test_simulate_chat.py`

6 тестов (все pass за 4.2s), фиксируют backend contract `/preview-chat/simulate`:

| Тест | Что проверяет |
|---|---|
| `test_happy_path_returns_llm_reply` | Demo question → LLM reply, **не fallback** |
| `test_history_is_passed_to_llm` | Multi-turn dialog: history доходит до модели |
| `test_staging_prompt_used_when_requested` | `use_staging=True` берёт `staging_prompt` |
| `test_cross_owner_blocked` | Owner A → Hotel B = `{"error": "Not authorized"}` |
| `test_hotel_not_found` | Несуществующий hotel_id = `{"error": "Hotel not found"}` |
| `test_no_system_prompt_configured` | Hotel без prompt → error, LLM **не вызывается** |

Pattern из `test_register_telegram_webhook.py` — `pytest_asyncio` + in-memory SQLite + `unittest.mock.AsyncMock` для `ai_service.generate_response`.

### 3. Fix — `frontend-platform/components/hotel/BotPreview.tsx`

Surgical revert:
- Вернул `import api from '@/lib/api'`, `useRef`, `useEffect`
- Async `sendMessage(question)` с двумя ветками:
  - `hotelId` есть → `POST /preview-chat/simulate` (продакшен бот с реальным `hotel.system_prompt`)
  - `hotelId` нет → `POST /preview-chat` (wizard preview из in-flight `formData`)
- `isTyping` state + 3 анимированных дота как настоящий мессенджер
- `messagesEndRef` для auto-scroll
- Input/buttons disabled пока loading
- UI role `'bot'` ⇄ backend role `'assistant'` конверсия в `sendToBackend`
- Error handling: показывает API detail или `'Ошибка соединения. Попробуйте ещё раз.'` с ⚠️ — **не** misleading "не знаю ответа"

Сохранил всё CSS Эмира (`bg-[#0A0A0A]`, `#3B82F6` user bubble, glassmorphism). Никакой framer-motion/gsap не трогал.

TypeScript clean (`npx tsc --noEmit` — единственная ошибка предсуществующая: `lenis` module not found на `app/page.tsx`, не наша).

---

## Что осталось в backlog'е demo-bot thread'а

| # | Задача | Приоритет | Когда |
|---|---|---|---|
| F1 | **Playwright E2E на `/hotels/{id}/demo`** — открыть, спросить "А есть ли русская сауна?", assert reply ≠ keyword-fallback + assert network на `/preview-chat/simulate` | Medium | Sprint 4 или после демки Назире |
| F2 | **Аудит остальных компонентов merge'а `73637de`** — Emir мог перетереть **другие** интеграции, не только BotPreview. Список изменённых файлов в этом коммите: 20+ страниц. | High | Solo-decision Alan'а |
| F3 | **Уведомить Эмира** — bug 26 дней висел, ему стоит знать про merge-discipline (rebase + diff-review перед merge feature-веток с fork'а) | Medium | По коммуникации с ним |
| F4 | **Trello update** — карточка `BUG: /hotels/{id}/demo bot returns 'не знаю ответа'` → Done. Учесть disclipine из `feedback_trello_discipline.md`. | Now | Алан вручную или через `seed_trello.py` |
| F5 | **WA-сообщение Назире** (Sally's recommendation): *"Ты лендинг показываешь клиентам, или сразу демо-ссылку?"* — разблокирует landing-strategy decision (Sprint 3 candidate). | Now | 30 секунд |

---

## Состояние коммитов

На начало 12.05: `d3331ea` (`SESSION_RECAP 2026-05-06`), локально = origin/main, 0 unpushed.

После сессии:
- `5bf028a` — test(simulate-chat): regression tests
- `eeca6ce` — fix(demo-bot): restore AI integration in BotPreview
- *(этот recap — будет 3-й commit)*

**3 unpushed коммита.** Алан не push'ит без явного решения; на Mac подтянуть через `git pull --rebase`.

---

## Накопленный техдолг (актуально на 12.05)

| # | Задача | Приоритет | Срочность |
|---|---|---|---|
| 1 | ~~🔴 Demo-bot "не знаю ответа" bug — P0 sales-killer~~ | **DONE 12.05** | ✅ |
| 2 | **Landing pricing/positioning mismatch** — strategic decision pending | High | После ответа Назиры (F5) |
| 3 | **Audit Emir's merge `73637de`** — другие компоненты могли потерять API-интеграции | High | Sprint 3-4 |
| 4 | **Memory `project_exmachina_state.md` обновить** — Sprint 2 closed, demo-bot fixed | Medium | После этого recap'а |
| 5 | `/dashboard/stats $0.00` looks like prod — UI-fix | Medium | Sprint 3 candidate |
| 6 | Tz-aware datetime sweep ×6 call-sites | Medium | Sprint 3-4 |
| 7 | **Чистка корня** — 57 PNG + presentation.html → `.gitignore` или `docs/screenshots/` | Low | Когда удобно |
| 8 | SESSION_RECAP 2026_04_30 + 2026_05_01 не написаны (pre-pitch hotfixes + питч-тренировка) | Low | Cross-device |
| 9 | 3-я панель Support Inbox + ROI-виджет (design в `SESSION_RECAP_2026_05_02.md`) | Medium | Когда встроим в `/cabinet` Эмира |

---

## Открытые ожидания

- ⏳ **Ответ Назиры** на WA-вопрос (F5) — разблокирует landing strategy
- ⏳ **Ответ Эмира** на наши 27 ответов (с 04.05 тишина); сюда же — реакция на demo-bot regression notification
- ⏳ **Назира onboarding** в Ex-Machina
- ⏳ **Ответ NURAI WA-бота** на 3 вопроса от 22.04 (Trello: `Intel: NURAI` In Progress)

---

## Что сделать ПЕРВЫМ в следующей сессии

1. **Push 3 unpushed коммитов** (если на Mac — `git pull --rebase` сначала).
2. **F4** — закрыть Trello-карточку demo-bot fix.
3. **F5** — отправить WA Назире (30 сек, разблокирует landing thread).
4. Выбрать следующую Sprint 3 story из backlog'а (см. техдолг #5-#6).

---

## Что НЕ сделано в сессии (намеренно)

- ❌ **Push не делал** — Алан push'ит сам.
- ❌ **Trello card move не делал** — нет Trello-токена в текущем сетапе MCP (только Playwright и Google Drive). Скрипт `scripts/seed_trello.py` существует, но он для seed'а, не для move-to-Done.
- ❌ **Memory update `project_exmachina_state.md`** — не трогал, потому что 23-дневная давность и многое могло измениться; лучше Алан сам решит что туда добавить, либо в следующей сессии.
- ❌ **Playwright E2E** — отложено (F1). Backend pytest достаточен для commit'а; full E2E — отдельная story.

---

## Tooling-апдейт (минорный)

Поставил `ccusage` (npm, v18.0.11) — мониторинг расходов Claude Code.

**Текущие траты (с 2026-02):** $756.50 total. April $599.96 (refounding + pitch + intel + investigations). May $123.99 за 12 дней — на трек ~$310/мес.

Полезные команды:
- `ccusage daily` — суточная разбивка
- `ccusage monthly` — помесячно
- `ccusage blocks --live` — real-time трекер 5-часовой billing window

Остальное из видео "9 инструментов" — пропустил (AgentMemory дублирует встроенную auto-memory; TDD Guard опасен на pre-sales фазе; Sequential Thinking устарел для Opus 4.7; Deepcon $8-20/мес pre-revenue не оправдан).

Также пропустил `/silver-platter` skill из второго видео — оно для солопренёров с messy data, а у тебя `MEMORY.md` уже structured silver platter.

---

*Session 2026-05-12 закрыта. Sprint 3 первая story done. Demo-bot снова живой.*
