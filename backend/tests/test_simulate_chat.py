"""Regression test for /preview-chat/simulate — the endpoint that powers the
public hotel demo page (/hotels/{id}/demo).

Bug history (locked in by this test):
- 2026-04-14 (commit 8711006): BotPreview was wired to call this endpoint.
- 2026-04-16 (commit 73637de, Emir's frontend redesign): the merge brought
  back a stale BotPreview that *removed* the API call and replaced it with
  a 7-keyword client-side matcher. The demo silently returned "Извините,
  я пока не знаю ответа..." for everything outside those 7 patterns.
  The backend endpoint kept working — nobody noticed for 26 days because
  it was never invoked from the demo UI.

This test pins the *backend* contract so it cannot regress while we fix
the frontend. The frontend re-wire is tracked separately; a Playwright
E2E for /hotels/{id}/demo should be added to lock in that side too.
"""
from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.api.endpoints.preview_chat import simulate_chat, SimulateRequest
from app.db.database import Base
from app.db.models import Hotel, User


@pytest_asyncio.fixture
async def db():
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    Session = async_sessionmaker(engine, expire_on_commit=False)
    async with Session() as session:
        yield session
    await engine.dispose()


@pytest_asyncio.fixture
async def seeded(db):
    owner_a = User(name="A", email="a@x", hashed_password="x", role="sales")
    owner_b = User(name="B", email="b@x", hashed_password="x", role="sales")
    db.add_all([owner_a, owner_b])
    await db.flush()

    hotel_a = Hotel(
        owner_id=owner_a.id,
        name="Hotel A",
        slug="hotel-a",
        system_prompt="You are the AI concierge for Hotel A. Be helpful.",
        staging_prompt=None,
        ai_model="anthropic/claude-3.5-haiku",
        rooms=[{"name": "Standard", "capacity": 2, "price": 5000}],
    )
    hotel_b = Hotel(owner_id=owner_b.id, name="Hotel B", slug="hotel-b")  # no prompt
    db.add_all([hotel_a, hotel_b])
    await db.commit()
    return {"owner_a": owner_a, "owner_b": owner_b, "hotel_a": hotel_a, "hotel_b": hotel_b}


@pytest.mark.asyncio
async def test_happy_path_returns_llm_reply(db, seeded):
    """Demo question → LLM reply, not the keyword-matcher fallback.

    This is the contract the broken frontend wasn't honoring.
    """
    fake_gen = AsyncMock(
        return_value=(
            "Конечно! Стандартный номер — 5000 сом за ночь, завтрак включён.",
            {"prompt_tokens": 100, "completion_tokens": 30, "cost_usd": 0.001},
        )
    )
    with patch("app.api.endpoints.preview_chat.ai_service.generate_response", fake_gen):
        result = await simulate_chat(
            data=SimulateRequest(
                hotel_id=seeded["hotel_a"].id,
                message="Сколько стоит стандартный номер?",
                history=[],
                use_staging=False,
            ),
            current_user=seeded["owner_a"],
            db=db,
        )

    # Real LLM-shaped reply — not the "не знаю ответа" fallback
    assert "не знаю ответа" not in result["reply"]
    assert "5000" in result["reply"]
    assert result["prompt_used"] == "production"
    assert result["tokens"] == 130
    assert result["cost_usd"] == 0.001
    assert result["needs_manager"] is False

    # System prompt was passed as the first message; the production prompt was used
    fake_gen.assert_awaited_once()
    sent_messages = fake_gen.await_args.kwargs["messages"]
    assert sent_messages[0]["role"] == "system"
    assert sent_messages[0]["content"] == "You are the AI concierge for Hotel A. Be helpful."
    assert sent_messages[-1] == {"role": "user", "content": "Сколько стоит стандартный номер?"}


@pytest.mark.asyncio
async def test_history_is_passed_to_llm(db, seeded):
    """Multi-turn dialog: the prior history reaches the model so it has context."""
    fake_gen = AsyncMock(return_value=("Да, конечно!", {"cost_usd": 0.0}))
    with patch("app.api.endpoints.preview_chat.ai_service.generate_response", fake_gen):
        await simulate_chat(
            data=SimulateRequest(
                hotel_id=seeded["hotel_a"].id,
                message="А завтрак включён?",
                history=[
                    {"role": "user", "content": "Сколько стоит номер?"},
                    {"role": "assistant", "content": "Стандарт — 5000 сом."},
                ],
                use_staging=False,
            ),
            current_user=seeded["owner_a"],
            db=db,
        )

    sent_messages = fake_gen.await_args.kwargs["messages"]
    # system + 2 history + 1 new user = 4
    assert len(sent_messages) == 4
    assert sent_messages[1] == {"role": "user", "content": "Сколько стоит номер?"}
    assert sent_messages[2] == {"role": "assistant", "content": "Стандарт — 5000 сом."}


@pytest.mark.asyncio
async def test_staging_prompt_used_when_requested(db, seeded):
    """When use_staging=True and staging_prompt is set, that draft is used."""
    seeded["hotel_a"].staging_prompt = "DRAFT: testing tone changes — be playful."
    await db.commit()

    fake_gen = AsyncMock(return_value=("Хей-хо! 🌟", {"cost_usd": 0.0}))
    with patch("app.api.endpoints.preview_chat.ai_service.generate_response", fake_gen):
        result = await simulate_chat(
            data=SimulateRequest(
                hotel_id=seeded["hotel_a"].id,
                message="Привет",
                history=[],
                use_staging=True,
            ),
            current_user=seeded["owner_a"],
            db=db,
        )

    assert result["prompt_used"] == "staging"
    sent_messages = fake_gen.await_args.kwargs["messages"]
    assert sent_messages[0]["content"] == "DRAFT: testing tone changes — be playful."


@pytest.mark.asyncio
async def test_cross_owner_blocked(db, seeded):
    """Owner A trying to simulate Owner B's hotel → authorization error."""
    result = await simulate_chat(
        data=SimulateRequest(
            hotel_id=seeded["hotel_b"].id,
            message="Anything",
            history=[],
            use_staging=False,
        ),
        current_user=seeded["owner_a"],
        db=db,
    )
    assert result == {"error": "Not authorized"}


@pytest.mark.asyncio
async def test_hotel_not_found(db, seeded):
    result = await simulate_chat(
        data=SimulateRequest(
            hotel_id=999999,
            message="Anything",
            history=[],
            use_staging=False,
        ),
        current_user=seeded["owner_a"],
        db=db,
    )
    assert result == {"error": "Hotel not found"}


@pytest.mark.asyncio
async def test_no_system_prompt_configured(db, seeded):
    """If hotel has neither system_prompt nor staging_prompt → error, no LLM call."""
    fake_gen = AsyncMock()
    seeded["owner_b"].id  # ensure owner exists in scope
    # Re-fetch hotel_b which has no system_prompt
    with patch("app.api.endpoints.preview_chat.ai_service.generate_response", fake_gen):
        result = await simulate_chat(
            data=SimulateRequest(
                hotel_id=seeded["hotel_b"].id,
                message="Anything",
                history=[],
                use_staging=False,
            ),
            current_user=seeded["owner_b"],
            db=db,
        )

    assert result == {"error": "No system prompt configured"}
    fake_gen.assert_not_awaited()
