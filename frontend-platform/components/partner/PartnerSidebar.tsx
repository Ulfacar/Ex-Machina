'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IcoHome, IcoSpark, IcoLeads, IcoHotel, IcoMoney, IcoPromo, IcoCog, IcoLogout } from './icons'

const NAV = [
  { id: 'home', href: '/partner', label: 'Главная', Icon: IcoHome },
  { id: 'create', href: '/partner/create', label: 'Создать бота', Icon: IcoSpark },
  { id: 'leads', href: '/partner/leads', label: 'Мои лиды', Icon: IcoLeads, badge: 3 },
  { id: 'hotels', href: '/partner/hotels', label: 'Мои отели', Icon: IcoHotel },
  { id: 'income', href: '/partner/income', label: 'Доходы', Icon: IcoMoney },
  { id: 'promo', href: '/partner/promo', label: 'Промо', Icon: IcoPromo },
  { id: 'settings', href: '/partner/settings', label: 'Настройки', Icon: IcoCog },
]

export default function PartnerSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/partner') return pathname === '/partner'
    return pathname.startsWith(href)
  }

  return (
    <aside className="p-sidebar">
      <Link href="/partner" className="p-brand">
        <div className="mark">EM</div>
        <div className="name">Ex-Machine</div>
        <span className="badge-partner">Partner</span>
      </Link>
      <nav className="p-nav">
        {NAV.map((it) => (
          <Link
            key={it.id}
            href={it.href}
            className={isActive(it.href) ? 'active' : ''}
          >
            <it.Icon />
            <span>{it.label}</span>
            {it.badge ? <span className="badge">{it.badge}</span> : null}
          </Link>
        ))}
      </nav>
      <div className="p-side-foot">
        <div className="p-user">
          <div className="av">PA</div>
          <div className="meta">
            <div className="u-name">Partner</div>
            <div className="u-tier">Silver · 4 клиента</div>
          </div>
        </div>
        <a href="#" className="p-logout"><IcoLogout style={{ width: 16, height: 16 }} />Выход</a>
      </div>
    </aside>
  )
}
