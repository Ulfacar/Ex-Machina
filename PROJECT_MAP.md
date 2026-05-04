# Ex-Machina — Project Map

> Этот файл описывает текущую структуру проекта, чтобы избежать конфликтов при параллельной разработке.
> Последнее обновление: 2026-05-04

---

## Стек

| Слой | Технологии |
|------|-----------|
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Python, FastAPI, SQLAlchemy, Alembic (миграции) |
| **Инфра** | Docker Compose, Nginx, Certbot (SSL), VPS |

---

## Структура репозитория

```
Ex-Machina/
├── frontend-platform/    # Next.js фронтенд
├── backend/              # FastAPI бэкенд
├── nginx/                # Конфиг Nginx
├── certbot/              # SSL-сертификаты
├── scripts/              # Утилиты деплоя
├── docs/                 # Документация, sales-материалы
├── _bmad/                # BMad Builder конфиг
├── docker-compose.yml
├── deploy.sh
└── .env / .env.example
```

---

## Frontend — `frontend-platform/`

### Страницы (`app/`)

| Роут | Файл | Описание |
|------|-------|----------|
| `/` | `page.tsx` | Лендинг (главная) |
| `/login` | `login/page.tsx` | Авторизация |
| `/register` | `register/page.tsx` | Регистрация |
| `/hotels/new` | `hotels/new/page.tsx` | Создание отеля |
| `/hotels/[id]` | `hotels/[id]/page.tsx` | Страница отеля |
| `/hotels/[id]/demo` | `hotels/[id]/demo/page.tsx` | Демо чат-бота |
| `/create-bot` | `create-bot/page.tsx` | Создание бота |
| `/compare` | `compare/page.tsx` | Сравнение тарифов |
| `/faq` | `faq/page.tsx` | FAQ для отельеров |
| `/share/[token]` | `share/[token]/page.tsx` | Шеринг по токену |
| `/success` | `success/page.tsx` | Страница успеха |
| `/cases/ton-azure` | `cases/ton-azure/page.tsx` | Кейс-стади |
| `/guides/wa-onboarding` | `guides/wa-onboarding/page.tsx` | Гайд WhatsApp |

### Кабинет отельера (`app/cabinet/`)

| Роут | Описание |
|------|----------|
| `/cabinet` | Дашборд кабинета |
| `/cabinet/inbox` | Входящие сообщения |
| `/cabinet/bookings` | Бронирования |
| `/cabinet/bot` | Настройки бота |
| `/cabinet/knowledge` | База знаний |
| `/cabinet/integrations` | Интеграции |
| `/cabinet/team` | Команда |
| `/cabinet/billing` | Биллинг |

### Партнёрский кабинет (`app/partner/`)

| Роут | Описание |
|------|----------|
| `/partner` | Дашборд партнёра |
| `/partner/hotels` | Отели партнёра |
| `/partner/leads` | Лиды |
| `/partner/income` | Доходы |
| `/partner/promo` | Промо-материалы |
| `/partner/create` | Создание отеля от партнёра |
| `/partner/settings` | Настройки |

### Админ-панель (`app/dashboard/`)

| Роут | Описание |
|------|----------|
| `/dashboard` | Главная админки |
| `/dashboard/hotels` | Список отелей |
| `/dashboard/hotels/[id]` | Отель — детали |
| `/dashboard/hotels/[id]/conversations` | Диалоги |
| `/dashboard/hotels/[id]/reports` | Отчёты |
| `/dashboard/users` | Пользователи |
| `/dashboard/stats` | Статистика |
| `/dashboard/billing` | Биллинг |
| `/dashboard/applications/[id]` | Заявки |

### Sales (`app/sales/`)

| Роут | Описание |
|------|----------|
| `/sales` | Sales-дашборд |
| `/sales/leads` | Лиды |
| `/sales/leads/[id]` | Детали лида |

### Компоненты (`components/`)

| Папка | Описание |
|-------|----------|
| `ui/` | shadcn/ui базовые компоненты (button, card, input, badge и др.) |
| `landing/` | Компоненты лендинга v1 (ROI-калькулятор, PhoneMockup, CaseFlipCard) |
| `landing-v2/` | **НОВЫЙ лендинг v2** (Hero, Navbar, LiveDemo, HowItWorks, Problem, WizardPreview) |
| `hotel/` | Визард создания отеля (5 шагов), BotPreview |
| `cabinet/` | Sidebar, Topbar, Sparkline, иконки для кабинета отельера |
| `partner/` | Sidebar, Topbar, иконки для партнёрского кабинета |
| `layout/` | Общие layout-компоненты (CardNav, Sidebar) |
| `effects/` | Визуальные эффекты (Magnet, GradientText, BlurText, ClickSpark, Dock и др.) |

---

## Backend — `backend/`

### API эндпоинты (`app/api/endpoints/`)

| Файл | Описание |
|------|----------|
| `auth.py` | Авторизация, регистрация |
| `hotels.py` | CRUD отелей, регистрация webhook Telegram |
| `conversations.py` | Диалоги |
| `webhooks.py` | Вебхуки (Telegram) |
| `webhooks_whatsapp.py` | Вебхуки (WhatsApp) |
| `preview_chat.py` | Превью чат-бота |
| `demo_chat.py` | Демо чат |
| `share.py` | Шеринг диалогов по токену |
| `reports.py` | Отчёты (ROI и др.) |
| `admin.py` | Админ-эндпоинты |
| `sales.py` | Sales-эндпоинты |
| `applications.py` | Заявки |

### Сервисы (`app/services/`)

| Файл | Описание |
|------|----------|
| `ai_service.py` | Генерация ответов через AI |
| `telegram_service.py` | Интеграция с Telegram |
| `meta_whatsapp_service.py` | Интеграция с WhatsApp (Meta) |
| `followup_service.py` | Автоматические follow-up сообщения |
| `notification_service.py` | Уведомления |
| `operator_service.py` | Переключение на оператора |
| `budget_service.py` | Бюджетирование |
| `price_validator.py` | Валидация цен |
| `response_processor.py` | Обработка ответов |
| `dialog_classifier.py` | Классификация диалогов |

### БД и миграции

| Файл | Описание |
|------|----------|
| `app/db/models.py` | SQLAlchemy модели |
| `app/db/database.py` | Подключение к БД |
| `app/api/schemas.py` | Pydantic-схемы |
| `alembic/` | Миграции Alembic |

---

## Последний коммит (на момент пуша)

```
d452d70 feat: add partner cabinet, hotel cabinet, and landing v2
```

Этот коммит добавил:
- **Partner Cabinet** — полный партнёрский кабинет (`app/partner/`, `components/partner/`)
- **Hotel Cabinet** — кабинет отельера (`app/cabinet/`, `components/cabinet/`)
- **Landing v2** — новый лендинг (`components/landing-v2/`)

---

## Важно для разработки

- **Не трогай `.env`** — содержит секреты, не коммитится (есть в `.gitignore`)
- **Backend API base** — задаётся через `NEXT_PUBLIC_API_URL` в `.env`
- **Миграции** — перед изменением моделей делай `alembic revision --autogenerate`
- **Node modules** — `frontend-platform/node_modules/` в `.gitignore`
- **Docker** — `docker-compose.yml` поднимает backend + frontend + nginx + certbot
