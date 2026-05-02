# Party Mode Session: Личный кабинет владельца отеля

## Дата: 2026-05-02

## Контекст проекта

**Ex-Machina** — платформа AI-ботов для отелей.
- **Frontend**: Next.js (App Router) + Tailwind + shadcn/ui
- **Backend**: FastAPI + SQLAlchemy (async) + PostgreSQL
- **Auth**: JWT (access_token в localStorage), bcrypt, роли: `admin`, `sales`
- **Деплой**: Docker + Nginx + Railway/VPS

### Текущая архитектура авторизации
- `/auth/register` — invite-only (первый юзер = admin, остальные = sales)
- `/auth/login` — email + password → JWT (24h)
- `/auth/me` — текущий юзер (id, name, email, role, is_active)
- Dashboard layout проверяет token в localStorage, редиректит на /login
- Модель User: id, name, email, hashed_password, role, is_active
- Модель Hotel: owner_id → User

### Текущие роли
- `admin` — полный доступ к dashboard (заявки, отели, биллинг, статистика, юзеры)
- `sales` — воронка продаж (/sales)

### Что уже есть
- Лендинг личного кабинета (asystem-landing.html — отдельный HTML)
- Страницы /login, /register
- Dashboard для admin (отели, заявки, статистика, биллинг, conversations)

---

## Задача: Вход в личный кабинет для владельцев отелей

### Обсуждение

*(записи обсуждения будут добавляться ниже)*

---

## Решения

*(принятые решения будут фиксироваться здесь)*

---

## TODO

- [ ] Определить flow входа для hotel owner
- [ ] Определить нужна ли новая роль или отдельная система
- [ ] Спроектировать UX входа
- [ ] Определить что видит owner в своем кабинете
