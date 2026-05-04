"""
Initialize database - create all tables and demo users
Run: python init_db.py
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import engine, Base, AsyncSessionLocal
from app.db.models import User, Hotel, Client, Conversation, Message, ConfirmedBooking, ShareLink
from app.core.security import get_password_hash


DEMO_USERS = [
    {"name": "Admin", "email": "admin@exmachine.ai", "password": "admin123", "role": "admin"},
    {"name": "Partner Demo", "email": "partner@exmachine.ai", "password": "partner123", "role": "sales"},
    {"name": "Demo User", "email": "demo@asystem.com", "password": "demo123", "role": "client"},
]


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("[OK] Database initialized successfully!")
    print("Tables created: users, hotels, clients, conversations, messages")

    async with AsyncSessionLocal() as session:
        for u in DEMO_USERS:
            result = await session.execute(
                select(User).where(User.email == u["email"])
            )
            existing = result.scalar_one_or_none()

            if not existing:
                user = User(
                    name=u["name"],
                    email=u["email"],
                    hashed_password=get_password_hash(u["password"]),
                    role=u["role"],
                    is_active=True
                )
                session.add(user)
                await session.commit()
                print(f"[OK] {u['role']} user created: {u['email']} / {u['password']}")
            else:
                if existing.role != u["role"]:
                    existing.role = u["role"]
                    await session.commit()
                    print(f"[OK] Updated {u['email']} role to {u['role']}")
                else:
                    print(f"[INFO] {u['role']} user already exists: {u['email']}")


if __name__ == "__main__":
    asyncio.run(init_db())
