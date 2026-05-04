'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IcoDash, IcoInbox, IcoBook, IcoBot, IcoKnowledge, IcoInteg, IcoTeam, IcoBilling, IcoChevD } from './icons'

const NAV = [
  { group: 'Главное', items: [
    { id: 'dashboard', href: '/cabinet', label: 'Дашборд', Icon: IcoDash },
    { id: 'inbox', href: '/cabinet/inbox', label: 'Inbox', Icon: IcoInbox, badge: 7 },
    { id: 'bookings', href: '/cabinet/bookings', label: 'Брони', Icon: IcoBook },
  ]},
  { group: 'Бот', items: [
    { id: 'bot', href: '/cabinet/bot', label: 'Настройки бота', Icon: IcoBot },
    { id: 'knowledge', href: '/cabinet/knowledge', label: 'База знаний', Icon: IcoKnowledge },
    { id: 'integrations', href: '/cabinet/integrations', label: 'Интеграции', Icon: IcoInteg },
  ]},
  { group: 'Аккаунт', items: [
    { id: 'team', href: '/cabinet/team', label: 'Команда', Icon: IcoTeam },
    { id: 'billing', href: '/cabinet/billing', label: 'Биллинг', Icon: IcoBilling },
  ]},
]

export default function CabinetSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/cabinet') return pathname === '/cabinet'
    return pathname.startsWith(href)
  }

  return (
    <aside className="cab-sidebar">
      <div className="cab-brand">
        <div className="mark">ex</div>
        <div className="brand-name">ex machine</div>
      </div>

      <div className="cab-hotel">
        <div className="ico">IL</div>
        <div className="meta">
          <div className="h-name">Issyk Lodge</div>
          <div className="h-sub">12 номеров · Иссык-Куль</div>
        </div>
        <IcoChevD style={{ width: 14, height: 14, color: 'oklch(0.65 0.02 264)' }} />
      </div>

      <nav className="cab-nav">
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="cab-nav-section">{g.group}</div>
            {g.items.map((it) => (
              <Link
                key={it.id}
                className={`cab-nav-item ${isActive(it.href) ? 'active' : ''}`}
                href={it.href}
              >
                <it.Icon />
                <span>{it.label}</span>
                {it.badge ? <span className="badge">{it.badge}</span> : null}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="cab-user">
        <div className="avatar">АК</div>
        <div className="meta">
          <div className="u-name">Айгуль К.</div>
          <div className="u-role">Владелец</div>
        </div>
        <IcoChevD style={{ width: 14, height: 14, color: 'oklch(0.65 0.02 264)' }} />
      </div>
    </aside>
  )
}
