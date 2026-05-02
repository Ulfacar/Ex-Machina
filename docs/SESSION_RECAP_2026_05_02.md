# Session Recap — 2026-05-02 (3rd panel design — Platform Admin)

> **Если ты новый Claude (особенно на Mac):** memory НЕ синхронизируется между машинами. Single source of truth = этот recap + предыдущий `SESSION_RECAP_2026_04_28.md`. Recap за 30.04 (pre-pitch hotfixes) и 01.05 (питч-день) ещё не написаны.

---

## TL;DR

- 🆕 **Решили: будет 3-я панель** — Platform Admin для Алана как owner'a платформы (`/platform/*`). До этого в Ex-Machina было 2 (Owner Dashboard + Sales).
- 🎯 **MVP 3-й панели = Support Inbox + ROI-виджет на главной у клиента.** Cost monitoring и impersonate отложены.
- 🤝 **BMad party mode** (John + Winston + Victor) утвердил **формат C** для тикета (subject + message + reply + status, без треда) и **2 отдельных PR** (сначала Support Inbox, потом ROI-виджет).
- 🎨 **Эмир сделал свой фронт-redesign** локально показал — Алан говорит «супер». Эмиру дано добро заливать. Ждём его пуш в репо — backend подгоняем под его UI, не наоборот.
- ⏸️ **Кода в этой сессии не написано** — только обсуждение + 1 правка memory (убрал ошибочное упоминание `mesh-aios.asystem.kg` как Ex-Machina админки — это другой проект ASystem).

---

## Ключевые решения

### 3 панели в финальной картине

| # | Панель | Кто пользуется | Статус |
|---|---|---|---|
| 1 | Owner Dashboard `/dashboard/*` | Владелец отеля (клиент) | ✅ есть |
| 2 | Sales Panel `/sales/*` | Продажник | ✅ есть |
| 3 | **Platform Admin `/platform/*`** | Алан как owner платформы | ❌ MVP в design |

### Scope 3-й панели в MVP

**Делаем (Sprint 3, 2 PR):**
1. **Support Inbox** — тикет-канал клиент↔Алан
   - Клиентская кнопка «Связаться с поддержкой» в Owner Dashboard (форма subject + message + категория)
   - Раздел «Мои обращения» в `/dashboard` со статусами `open` / `in_progress` / `resolved`
   - `/platform/support` — cross-tenant инбокс для Алана с фильтром по статусу/категории
   - TG-нотификация Алану при новом тикете
2. **ROI-виджет на главной у клиента** — вытаскиваем `XX×` из `/reports` (3 клика) на:
   - `/dashboard/hotels/[id]` (главная отеля) — per-hotel ROI
   - `/dashboard` (home) — агрегат по всем отелям

**Откладываем:**
- Cost monitoring (`/platform/clients` с маржой) — Sprint 4+, после первых платящих клиентов
- Impersonate («войти как клиент») — позже, или вместо него bypass-в-фильтре когда понадобится

### Архитектурные решения (из design draft'a)

- **Роль:** новый bool `users.is_platform_admin` (НЕ менять existing `role` enum) — Алан остаётся `role="admin"` со своими демо-отелями + получает доступ к `/platform/*`.
- **Таблицы:** одна новая `support_tickets` (миграция 025). Поля: `hotel_id, created_by_user_id, subject, message, category, reply, replied_at, replied_by_user_id, status, timestamps`. Тред в отдельной таблице **не делаем** — YAGNI, миграция позже простая.
- **Формат тикета (C):** subject + message + reply (один) + status. Если клиенту нужно ещё — создаёт новый тикет.
- **Endpoints:**
  - `/api/support/tickets/*` — клиентский CRUD (с `_assert_hotel_access`)
  - `/api/platform/support/tickets/*` — платформенный (с `Depends(get_platform_admin)`)
- **Категории (preset, рекомендация):** `prompt_change` / `bug` / `question` / `other` (default `other`).
- **Уведомления:** `notification_service` (уже есть) → TG в личку Алана.

---

## Что произошло за сессию (фазы)

### Phase 1 — recovery
Восстановил контекст прошлой сессии 30.04 (pre-pitch hotfixes + Invest Day kit, 7 коммитов). Заметил 57 untracked PNG + `presentation.html` + `snapshot_inbox.md` в корне.

### Phase 2 — сколько панелей
Алан спросил «сколько у нас админ панелей». Я ошибочно упомянул `mesh-aios.asystem.kg/panel` как «legacy» Ex-Machina — Алан поправил, это ASystem (другой проект). Поправил memory.

### Phase 3 — что класть в 3-ю
Изначально я предлагал 3 опции (cost monitoring / impersonate / hybrid). Алан переориентировал: реальный сценарий — **клиент пишет в саппорт типа «поменяйте цены»**, и важно чтобы **клиент сразу видел ROI**. Impersonate не приоритет.

### Phase 4 — BMad party mode
Позвал John (PM), Winston (Architect), Victor (Disruptive Innovation).
- **Victor** challenged: зачем тикет если есть WhatsApp.
- **John** ответил: WhatsApp не оставляет следа. Нужен formalized канал.
- **Winston** дал схему таблицы + настоял на 2 отдельных PR.
- **Victor** добавил: только Support Inbox в этой сессии, ROI-виджет отдельно. Не смешивать.
- **Утвердили:** формат C, 2 PR, TG-нотификация, `support_tickets.message` как TEXT (не выделенная таблица сообщений).

### Phase 5 — design phase, прерванная
Начал представлять Architecture (раздел 1 из 4) с inline-вопросами по роли (A1 vs A2), боту для нотификаций, категориям. Алан переключился на «что Эмиру сказать» → составил готовое сообщение для Эмира. Алан сообщил что Эмир уже сделал супер-фронт, ждём пуш.

---

## Что делать ПЕРВЫМ в следующей сессии

### Сценарий 1 — Эмир уже запушил
1. `git fetch && git log --all --oneline -10` → найди его ветку (вероятно `frontend-redesign` или подобная)
2. `git checkout <его ветка>` или открой через diff
3. Просмотри что покрыто. Сверь со scope «Делаем» выше:
   - Если в его UI **уже есть** страницы `/dashboard/support` (форма «Связаться»), `/platform/support` (инбокс), ROI-виджет → backend подгоняем под форму его API-вызовов
   - Если его UI — **только редизайн существующего** без support / Platform Admin → заводи новые страницы поверх его стилистики
4. Спроси у Алана подтверждения по открытым design-вопросам (см. ниже)

### Сценарий 2 — Эмир ещё не запушил
1. Спроси у Алана: «Эмир уже залил? Можно проверить ветку?»
2. Если ещё нет — попроси Алана пингануть Эмира.
3. Параллельно можно делать **техдолг** (см. ниже).

---

## Открытые design-вопросы для Алана (на следующую сессию)

1. **Роль:** подтвердить **A2** (bool `is_platform_admin` поверх существующего `role`) vs **A1** (новый enum value `platform_admin`). Рекомендация: A2 (не ломает Алана как owner'a демо-отелей).
2. **TG-бот для нотификаций:** есть ли уже бот для системных алертов или создавать новый `@exmachina_platform_bot`?
3. **Категории тикета:** preset из 4 (`prompt_change` / `bug` / `question` / `other`) или свободный текст?

---

## Накопленный техдолг (на отдельные окна)

1. **`SESSION_RECAP_2026_04_30.md`** — за pre-pitch hotfixes (7 коммитов, Invest Day kit). Не написан.
2. **`SESSION_RECAP_2026_05_01.md`** — питч-день, итог не зафиксирован в memory.
3. **Чистка корня** — 57 PNG (`mvp_test_*`, `e25-e28_*`, `e33_*`, etc.) + `presentation.html` + `snapshot_inbox.md` + `ton-azure-chat-milana.png`. Перенести в `docs/screenshots/` или `.gitignore`.
4. **Ротация `OPENROUTER_API_KEY`** — карточка in-progress в Trello с 28.04.
5. **Memory `project_exmachina_state.md`** — устарел на 7 дней (миграции 020-024, новые страницы `/reports`, `/cases/ton-azure`, `/compare`, `/share/[token]` не отражены).

---

## Memory обновления в этой сессии

Один малый Edit:
- `project_exmachina_state.md` → раздел «Деплой»: убрана ошибочная строка про `mesh-aios.asystem.kg/panel` как Ex-Machina админку (это ASystem, другой проект Алана). Заменено явным примечанием.

Полный memory cleanup (с учётом всех изменений за апрель) не делал — отдельная задача.

---

## Task list (для пересоздания на другой машине)

| # | Задача | Статус |
|---|---|---|
| 1 | Explore project context | Done (контекст восстановлен из git + memory) |
| 2 | Ask clarifying questions | In progress (3 inline-вопроса в design'e открыты) |
| 3 | Propose 2-3 approaches | Done (через party mode) |
| 4 | Present design sections | In progress (раздел 1/4 — Architecture частично представлен) |
| 5 | Write design doc `docs/superpowers/specs/2026-05-02-platform-admin-design.md` | Pending (после ответов на inline-вопросы) |
| 6 | Spec self-review | Pending |
| 7 | User reviews written spec | Pending |
| 8 | Invoke writing-plans skill | Pending |

---

## Не делать в pre-implementation период

- **Не пиши backend под Support Inbox пока не увидел фронт Эмира** — риск переписывать payload-форматы.
- **Не делай design-doc** пока не получил ответы на 3 inline-вопроса (роль / TG-бот / категории).
- **Не трогай `/platform/clients`** (cost monitoring) — отложили в Sprint 4+.

---

## Финальная заметка

Сессия **дискуссионная, не имплементационная**. Кода не писали — обсуждали архитектуру 3-й панели, договорились о scope, решили формат тикета через party mode. Это правильная плотность работы перед началом — не торопиться в код, пока scope трясётся и фронт Эмира на подходе.

После пуша Эмира начнётся implementation-фаза. Сценарий: посмотрел его код → согласовали API-контракт → 1 PR Support Inbox backend + хуки → 1 PR ROI-виджет.

---

*Session 2026-05-02 закрыта. Жди пуш Эмира.*
