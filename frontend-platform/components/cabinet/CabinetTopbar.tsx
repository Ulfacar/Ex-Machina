'use client'

import { usePathname } from 'next/navigation'
import { IcoSearch, IcoBell } from './icons'

const LABELS: Record<string, string> = {
  '/cabinet': 'Дашборд',
  '/cabinet/inbox': 'Inbox',
  '/cabinet/bookings': 'Брони',
  '/cabinet/bot': 'Настройки бота',
  '/cabinet/knowledge': 'База знаний',
  '/cabinet/integrations': 'Интеграции',
  '/cabinet/team': 'Команда',
  '/cabinet/billing': 'Биллинг',
}

export default function CabinetTopbar() {
  const pathname = usePathname()
  const label = LABELS[pathname] || 'Кабинет'

  return (
    <div className="cab-topbar">
      <div className="cab-bread">
        <span className="crumb">Issyk Lodge</span>
        <span className="sep">/</span>
        <span className="crumb cur">{label}</span>
      </div>
      <div className="cab-search">
        <IcoSearch style={{ width: 14, height: 14 }} />
        <input placeholder="Поиск гостей, броней, диалогов..." />
        <span className="kbd">⌘K</span>
      </div>
      <div className="cab-top-actions">
        <button className="cab-icon-btn">
          <IcoBell style={{ width: 18, height: 18 }} />
          <span className="dot" />
        </button>
      </div>
    </div>
  )
}
