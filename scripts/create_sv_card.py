"""One-shot: create Silicon Valley card on Ex-Machina Trello.
Uses requests (UTF-8 safe), not curl-with-windows-cp1251."""
from __future__ import annotations
import os
import sys
import requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

KEY = os.environ["TRELLO_API_KEY"]
TOKEN = os.environ["TRELLO_TOKEN"]
LIST_IN_PROGRESS = "69e7a330dad49554f8d65533"

NAME = "🌉 Кремневая долина — Dive Into SV / Unicorn from KG (ПВТ КР)"

DESC = """## Программа
ПВТ КР открыл набор на 2 параллельные программы (можно подать на обе):
- 🚀 **Dive Into Silicon Valley** — 2 недели погружения в SV, networking
- 🚀 **Unicorn from KG** — 5 недель в Draper University (San Mateo, CA), Tim Draper сеть

Финалисты выступают на **KIT Forum 2026**.

## Timeline (жёсткий, без буфера)
- **2026-05-18 12:00** — deadline заявки (НЕ продлевается)
- **2026-06-08** — pitch перед жюри
- **November 2026** — поездка в Калифорнию для прошедших

## Critical constraints
- 🚨 **ENGLISH ONLY** — заявка и pitch
- 💰 Решение Алана 13.05: "Подаю, не пройду — значит не пройду". Cost-capped attempt.
- 📊 Инсайдер: "у конкурентов проекты ни о чём" — реальный шанс пройти

## Sprint plan (5 дней)
- **Вт 13.05** — найти форму ПВТ КР, выписать все поля, начать продукт-подготовку
- **Ср 14.05** — Paige переводит speech на English; заполнить text-поля
- **Чт 15.05** — Caravaggio + Amelia: pitch deck (10 слайдов English) + demo screencast 30 сек
- **Пт 16.05** — video pitch (если требуется); landing kill-switch
- **Сб 17.05** — финальная вычитка, submit к 11:00

## Product prep checklist
- [ ] Landing: скрыть /pricing блок ИЛИ / → /demo redirect (mismatch $29/249/299 vs pitch $800+40)
- [ ] Demo reliability: smoke-test /hotels/{id}/demo с 3 браузеров
- [ ] Demo English mode: prompt для hotel id=99 на английском (для screencast)
- [ ] Health endpoint визуально на demo-странице

## Re-use assets (готовые)
- docs/sales/invest_day_speech_2026_05_01.md — основа pitch
- docs/sales/storytelling_library.md — нарративы
- docs/sales/hotelbot_comparison_2026_04.md — anti-competitor
- mvp_test_*.png — скриншоты для deck
- reference_ton_azure_arch.md — credibility proof

## Memory ref
- project_sv_trip_2026.md (детальный план)
- BMad party mode discussion от 2026-05-13"""

resp = requests.post(
    "https://api.trello.com/1/cards",
    params={"key": KEY, "token": TOKEN},
    data={
        "idList": LIST_IN_PROGRESS,
        "name": NAME,
        "desc": DESC,
        "due": "2026-05-18T07:00:00.000Z",
    },
    timeout=30,
)
resp.raise_for_status()
card = resp.json()
print(f"OK created card {card['id']}")
print(f"URL: {card['shortUrl']}")
print(f"Name: {card['name']}")
