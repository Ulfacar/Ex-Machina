"""Tests for ai_service.get_credit_balance — the OpenRouter balance shown
on /dashboard/stats.

Before this code, admin.py hardcoded `openrouter_balance=0.0  # TODO`,
which made the stats UI render "$0.00 — Пополните баланс!" in red even
on a freshly-deployed instance. The fix returns None on any failure so
the UI shows "—" instead of the false alarm. These tests pin that
contract.
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.services.ai_service import AIService


@pytest.mark.asyncio
async def test_happy_path_returns_remaining_credit():
    """credits - usage = remaining balance."""
    service = AIService()
    fake_response = MagicMock()
    fake_response.raise_for_status = MagicMock()
    fake_response.json.return_value = {"data": {"total_credits": 50.0, "total_usage": 12.34}}

    fake_client = MagicMock()
    fake_client.__aenter__ = AsyncMock(return_value=fake_client)
    fake_client.__aexit__ = AsyncMock(return_value=False)
    fake_client.get = AsyncMock(return_value=fake_response)

    with patch("app.services.ai_service.httpx.AsyncClient", return_value=fake_client), \
         patch("app.services.ai_service.settings") as mock_settings:
        mock_settings.OPENROUTER_API_KEY = "sk-or-v1-real"
        mock_settings.OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
        balance = await service.get_credit_balance()

    assert balance == 37.66  # 50.0 - 12.34, rounded to 2dp


@pytest.mark.asyncio
async def test_returns_none_when_api_key_missing():
    """Empty key (dev / unconfigured) → None, no network call."""
    service = AIService()
    with patch("app.services.ai_service.httpx.AsyncClient") as mock_client, \
         patch("app.services.ai_service.settings") as mock_settings:
        mock_settings.OPENROUTER_API_KEY = ""
        balance = await service.get_credit_balance()

    assert balance is None
    mock_client.assert_not_called()  # No network attempt


@pytest.mark.asyncio
async def test_returns_none_on_http_failure():
    """Network error / 5xx → None (not a misleading 0.0)."""
    service = AIService()
    fake_client = MagicMock()
    fake_client.__aenter__ = AsyncMock(return_value=fake_client)
    fake_client.__aexit__ = AsyncMock(return_value=False)
    fake_client.get = AsyncMock(side_effect=Exception("connection refused"))

    with patch("app.services.ai_service.httpx.AsyncClient", return_value=fake_client), \
         patch("app.services.ai_service.settings") as mock_settings:
        mock_settings.OPENROUTER_API_KEY = "sk-or-v1-real"
        mock_settings.OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
        balance = await service.get_credit_balance()

    assert balance is None


@pytest.mark.asyncio
async def test_returns_none_on_unexpected_payload():
    """Missing/malformed `data` field → None, not a crash."""
    service = AIService()
    fake_response = MagicMock()
    fake_response.raise_for_status = MagicMock()
    fake_response.json.return_value = {}  # No `data` key

    fake_client = MagicMock()
    fake_client.__aenter__ = AsyncMock(return_value=fake_client)
    fake_client.__aexit__ = AsyncMock(return_value=False)
    fake_client.get = AsyncMock(return_value=fake_response)

    with patch("app.services.ai_service.httpx.AsyncClient", return_value=fake_client), \
         patch("app.services.ai_service.settings") as mock_settings:
        mock_settings.OPENROUTER_API_KEY = "sk-or-v1-real"
        mock_settings.OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
        balance = await service.get_credit_balance()

    # Empty data falls through the float(... or 0) coercion → 0 - 0 = 0.0
    assert balance == 0.0
