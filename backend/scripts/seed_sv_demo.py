"""Seed English-language demo hotel for SV pitch (Dive Into SV / Unicorn from KG).

Creates one hotel owned by demo@asystem.com with an English system_prompt so the
/preview-chat/simulate endpoint replies in English. Used for the application
screencast (15-17 May) and live pitch demo (8 June).

Idempotent: re-running updates the system_prompt instead of duplicating the hotel.

Run:
    cd backend
    python scripts/seed_sv_demo.py
"""
import asyncio
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.dirname(HERE)
if BACKEND not in sys.path:
    sys.path.insert(0, BACKEND)

from sqlalchemy import select  # noqa: E402

from app.db.database import AsyncSessionLocal  # noqa: E402
from app.db.models import Hotel, User  # noqa: E402


HOTEL_SLUG = "sv-demo-english"
HOTEL_NAME = "Pearl Lake Boutique Hotel"

ENGLISH_SYSTEM_PROMPT = """You are the AI assistant for «Pearl Lake Boutique Hotel», a 14-room family-run resort on the shore of Lake Issyk-Kul, Kyrgyzstan.

Reply SHORT and TO THE POINT, the way a real manager would on WhatsApp. Maximum 1-3 sentences per reply. Use natural, warm English.

## HOTEL
14 rooms, family-owned since 2018. Pebble beach, 80 meters from the entrance. Mountain views to the south.
Address: 12 Lakeside Drive, Cholpon-Ata, Kyrgyzstan
Contact: +996 555 123 456, hello@pearllake.kg

## ROOMS
- Standard Double — up to 2 guests, $55/night. 20 m², queen bed or twin beds, balcony, AC.
- Deluxe Lake View — up to 3 guests, $95/night. 27 m², balcony facing the lake, bathrobes and slippers, espresso machine.
- Family Suite — up to 4 guests, $140/night. 42 m², two rooms, kitchenette, lake view.

## RULES
- Check-in: 14:00. Check-out: 12:00.
- Payment: card, bank transfer, cash on arrival.
- Cancellation: free up to 7 days before check-in; 50% refund within 7 days; no refund within 48 hours.
- Pets: small dogs welcome (+$15/night). No cats.
- Smoking: only on the balcony.

## AMENITIES
Free Wi-Fi everywhere. Free parking. Breakfast buffet included (7:00-10:30). Restaurant (lunch & dinner). Heated outdoor pool May-September. Private beach with sun loungers. Airport transfer ($35 from Bishkek Manas).

## NEARBY
- Ruh Ordo cultural complex — 1.2 km
- Issyk-Kul beach (pebble) — 80 m
- Cholpon-Ata Petroglyphs — 3 km
- Bishkek Manas Airport — 270 km / ~4h drive

## NOT AVAILABLE (do NOT invent):
No spa, no gym, no kids' club, no all-inclusive packages. We don't accept crypto.

## BEHAVIOR
Be warm and helpful but never pushy. After answering, suggest a relevant extra service only if it fits the question (transfer, breakfast, room upgrade) — never on every message.

## ESCALATION
If the guest asks something not covered above, or wants a non-standard request (group booking >5 rooms, corporate event, payment in cryptocurrency, late cancellation), reply:
"Let me check with our manager — they'll reach out within a few minutes."
Never invent prices, dates, or policies that aren't listed above.

## TONE
- Use contractions ("we're", "you'll", "it's")
- Avoid corporate phrases ("we are pleased to inform you")
- Address the guest directly: "you", not "the guest"
- One emoji is OK, two is too many. Default to none.
"""


async def main() -> None:
    async with AsyncSessionLocal() as db:
        demo = (
            await db.execute(select(User).where(User.email == "demo@asystem.com"))
        ).scalar_one_or_none()
        if demo is None:
            print("ERROR: demo@asystem.com not found — run `python init_db.py` first")
            sys.exit(1)

        hotel = (
            await db.execute(select(Hotel).where(Hotel.slug == HOTEL_SLUG))
        ).scalar_one_or_none()

        if hotel is None:
            hotel = Hotel(
                owner_id=demo.id,
                name=HOTEL_NAME,
                slug=HOTEL_SLUG,
                address="12 Lakeside Drive, Cholpon-Ata, Kyrgyzstan",
                phone="+996 555 123 456",
                email="hello@pearllake.kg",
                description="14-room family-run boutique hotel on the shore of Lake Issyk-Kul.",
                rooms=[
                    {"name": "Standard Double", "capacity": 2, "price": 55, "description": "queen bed or twin beds, balcony"},
                    {"name": "Deluxe Lake View", "capacity": 3, "price": 95, "description": "balcony facing the lake, espresso machine"},
                    {"name": "Family Suite", "capacity": 4, "price": 140, "description": "two rooms, kitchenette, lake view"},
                ],
                languages=["en"],
                status="active",
                is_active=True,
                manager_name="Aida",
                manager_telegram_id="0",
                system_prompt=ENGLISH_SYSTEM_PROMPT,
                ai_model="anthropic/claude-3.5-haiku",
            )
            db.add(hotel)
            await db.flush()
            print(f"CREATE hotel id={hotel.id}  slug={hotel.slug}")
        else:
            hotel.system_prompt = ENGLISH_SYSTEM_PROMPT
            hotel.name = HOTEL_NAME
            hotel.is_active = True
            hotel.status = "active"
            print(f"UPDATE hotel id={hotel.id}  slug={hotel.slug}")

        await db.commit()
        print()
        print(f"  English-prompt hotel ready.")
        print(f"  Hotel ID: {hotel.id}")
        print(f"  Slug: {hotel.slug}")
        print(f"  Login: demo@asystem.com")
        print(f"  Preview URL: /hotels/{hotel.id}/demo")
        print(f"  Use this for: SV application screencast + live pitch demo (08.06.2026)")


if __name__ == "__main__":
    asyncio.run(main())
