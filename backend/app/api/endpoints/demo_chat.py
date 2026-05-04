"""
Public demo chat endpoint for the landing page.
No auth required. Rate-limited by simple in-memory counter.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict
from collections import defaultdict
import time

from ...services.ai_service import AIService

router = APIRouter(prefix="/api/v1/demo", tags=["demo"])

ai_service = AIService()

# Simple in-memory rate limiter: max 20 requests per IP per 10 minutes
_rate: Dict[str, List[float]] = defaultdict(list)
RATE_WINDOW = 600  # seconds
RATE_LIMIT = 20

DEMO_SYSTEM_PROMPT = """Ты — AI-консьерж небольшого отеля «Issyk Lodge» на Иссык-Куле, демо-режим для платформы ex machine.
ТОН: тёплый, краткий, на «вы» с одним эмодзи в начале или конце ответа.
ЯЗЫК: отвечай на языке гостя (русский по умолчанию).
ДАННЫЕ ОТЕЛЯ:
— 12 номеров: Стандарт 5400 сом/ночь, Делюкс с видом на озеро 8400 сом/ночь, Сьют 14000 сом/ночь.
— Завтрак включён (континентальный + локальные блюда).
— Заезд 14:00, выезд 12:00. Ранний заезд с 11:00 при наличии — бесплатно.
— Парковка бесплатная. С животными — только маленькие, до 10 кг, +500 сом/ночь.
— От Бишкека ~4 часа на машине, организуем трансфер 6500 сом в одну сторону.
— Сауна, мангальная зона, прокат сапбордов летом.
ПРАВИЛА:
— Если гость спрашивает скидку больше 10% или жалуется — скажи что передашь менеджеру.
— Не выдумывай данные, которых нет. Если не знаешь — скажи и предложи уточнить у менеджера.
— Отвечай коротко: 1-3 предложения.
— В конце предлагай следующий шаг: уточнить даты, забронировать, прислать фото."""


class ChatMessage(BaseModel):
    role: str
    content: str = Field(max_length=500)


class DemoChatRequest(BaseModel):
    system: str | None = None
    messages: List[ChatMessage] = Field(max_length=30)


class DemoChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=DemoChatResponse)
async def demo_chat(req: DemoChatRequest):
    # Build messages for AI
    ai_messages = [{"role": "system", "content": DEMO_SYSTEM_PROMPT}]
    for m in req.messages[-10:]:  # Keep last 10 messages max
        ai_messages.append({"role": m.role, "content": m.content[:500]})

    text, _ = await ai_service.generate_response(
        messages=ai_messages,
        temperature=0.7,
        max_tokens=300,
    )

    return DemoChatResponse(reply=text)
