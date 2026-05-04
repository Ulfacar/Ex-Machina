'use client'

import { usePathname } from 'next/navigation'
import { IcoSearch, IcoBell } from './icons'

const LABELS: Record<string, string> = {
  '/partner': 'Главная',
  '/partner/create': 'Создать бота клиенту',
  '/partner/leads': 'Мои лиды',
  '/partner/hotels': 'Мои отели',
  '/partner/income': 'Доходы',
  '/partner/promo': 'Промо-материалы',
  '/partner/settings': 'Настройки',
}

export default function PartnerTopbar() {
  const pathname = usePathname()
  const label = LABELS[pathname] || 'Партнёр'

  return (
    <div className="p-topbar">
      <div className="p-bread">
        <span>Партнёр</span>
        <span className="sep">/</span>
        <span className="cur">{label}</span>
      </div>
      <div className="p-search">
        <IcoSearch style={{ width: 14, height: 14 }} />
        <input placeholder="Поиск отелей, лидов, выплат..." />
        <span className="kbd">⌘K</span>
      </div>
      <div className="p-top-actions">
        <button className="p-icon-btn">
          <IcoBell style={{ width: 18, height: 18 }} />
          <span className="dot" />
        </button>
      </div>
    </div>
  )
}
