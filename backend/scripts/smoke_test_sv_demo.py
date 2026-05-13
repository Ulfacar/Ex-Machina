"""Smoke-test for the SV pitch demo bot (English hotel slug `sv-demo-english`).

Hits the same code path as the live demo: loads the hotel, calls
`/preview-chat/simulate` *as a function* (no HTTP, no JWT), runs five typical
English guest questions through real OpenRouter, and prints/saves the replies.

Cost: ~5 × $0.005 = $0.025 per run on Claude 3.5 Haiku.

Pre-req:
    python scripts/seed_sv_demo.py   # creates the English hotel
    OPENROUTER_API_KEY set in .env   # real LLM call

Run:
    cd backend
    python scripts/smoke_test_sv_demo.py

Output:
    docs/sv_smoke_test_<date>.md       (committable transcript)
    stdout                              (live progress)

Exit code: 0 if all 5 pass sanity checks, 1 otherwise.
"""
import asyncio
import os
import sys
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.dirname(HERE)
REPO = os.path.dirname(BACKEND)
if BACKEND not in sys.path:
    sys.path.insert(0, BACKEND)

from sqlalchemy import select  # noqa: E402

from app.api.endpoints.preview_chat import SimulateRequest, simulate_chat  # noqa: E402
from app.db.database import AsyncSessionLocal  # noqa: E402
from app.db.models import Hotel, User  # noqa: E402


QUESTIONS = [
    "Do you have any free rooms for next weekend, June 14-15?",
    "Is breakfast included in the price?",
    "What's the Wi-Fi situation? My partner works remotely.",
    "Do you have parking? We're driving from Bishkek.",
    "Can we check in early? Our flight lands at 8am.",
]

# Sanity checks — what makes a reply "good enough" for the pitch
MIN_LENGTH = 30                # one-word replies fail
FAILURE_PHRASES = (
    "i don't know",
    "i'm not sure",
    "не знаю",
    "извините",
)


async def main() -> int:
    async with AsyncSessionLocal() as db:
        demo = (
            await db.execute(select(User).where(User.email == "demo@asystem.com"))
        ).scalar_one_or_none()
        hotel = (
            await db.execute(select(Hotel).where(Hotel.slug == "sv-demo-english"))
        ).scalar_one_or_none()

        if demo is None:
            print("ERROR: demo user not found. Run `python init_db.py` first.")
            return 1
        if hotel is None:
            print("ERROR: English demo hotel not found. Run `python scripts/seed_sv_demo.py` first.")
            return 1

        print(f"Smoking hotel id={hotel.id}  slug={hotel.slug}")
        print(f"Owner: {demo.email}")
        print(f"Model: {hotel.ai_model}")
        print()

        transcript: list[str] = []
        transcript.append(f"# SV demo smoke-test — {date.today().isoformat()}")
        transcript.append("")
        transcript.append(f"- Hotel: **{hotel.name}** (id={hotel.id}, slug={hotel.slug})")
        transcript.append(f"- Model: `{hotel.ai_model}`")
        transcript.append(f"- Owner: {demo.email}")
        transcript.append("")

        failures: list[tuple[str, str, str]] = []
        total_cost = 0.0
        total_tokens = 0

        for i, q in enumerate(QUESTIONS, 1):
            print(f"[{i}/5] Q: {q}")
            result = await simulate_chat(
                data=SimulateRequest(hotel_id=hotel.id, message=q, history=[], use_staging=False),
                current_user=demo,
                db=db,
            )

            if "error" in result:
                print(f"        ERROR: {result['error']}")
                transcript.append(f"### Q{i}. {q}")
                transcript.append(f"**ERROR:** `{result['error']}`")
                transcript.append("")
                failures.append((q, "endpoint_error", str(result)))
                continue

            reply = result["reply"]
            cost = result.get("cost_usd", 0.0) or 0.0
            tokens = result.get("tokens", 0) or 0
            total_cost += cost
            total_tokens += tokens

            print(f"        A: {reply[:120]}{'...' if len(reply) > 120 else ''}")
            print(f"           tokens={tokens}  cost=${cost:.4f}")
            print()

            transcript.append(f"### Q{i}. {q}")
            transcript.append("")
            transcript.append(f"**A:** {reply}")
            transcript.append("")
            transcript.append(f"`tokens={tokens} cost=${cost:.4f} needs_manager={result.get('needs_manager')}`")
            transcript.append("")

            reply_lower = reply.lower()
            if len(reply) < MIN_LENGTH:
                failures.append((q, "too_short", reply))
            elif any(phrase in reply_lower for phrase in FAILURE_PHRASES):
                failures.append((q, "fallback_phrase", reply))

        transcript.append("---")
        transcript.append(f"**Total:** 5 questions, {total_tokens} tokens, ${total_cost:.4f}")
        transcript.append(f"**Failures:** {len(failures)}/5")
        transcript.append("")
        if failures:
            transcript.append("## Failed checks")
            for q, why, reply in failures:
                transcript.append(f"- **{why}** on `{q}` → `{reply[:80]}`")

        out_path = os.path.join(REPO, "docs", f"sv_smoke_test_{date.today().isoformat()}.md")
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("\n".join(transcript))

        print(f"Transcript saved: {out_path}")
        print(f"Total cost: ${total_cost:.4f}  tokens: {total_tokens}")
        print(f"Failures: {len(failures)}/5")
        return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
