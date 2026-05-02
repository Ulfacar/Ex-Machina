'use client'

import { IcoPlus, IcoChev } from '@/components/cabinet/icons'

export default function TeamPage() {
  const team = [
    { name: 'Айгуль Кадырова', role: 'Владелец', access: 'Полный доступ', initials: 'АК', online: true, last: 'сейчас' },
    { name: 'Бакыт Асанов', role: 'Менеджер', access: 'Inbox + Брони', initials: 'БА', online: true, last: '5 мин назад' },
    { name: 'Чынар Орозова', role: 'Ресепшн', access: 'Только Inbox', initials: 'ЧО', online: false, last: 'вчера' },
    { name: 'Эрмек Турсунов', role: 'Ресепшн', access: 'Только Inbox', initials: 'ЭТ', online: false, last: '3 дня назад' },
  ]

  return (
    <div className="cab-page">
      <div className="cab-page-head">
        <div>
          <h1>Команда</h1>
          <div className="sub">{team.length} человек · 1 владелец, {team.length - 1} сотрудников</div>
        </div>
        <div className="cab-page-actions">
          <button className="c-btn c-btn-primary"><IcoPlus style={{ width: 14, height: 14 }} />Пригласить</button>
        </div>
      </div>

      <div className="c-card">
        <table className="c-table">
          <thead><tr><th>Сотрудник</th><th>Роль</th><th>Доступ</th><th>Последний раз</th><th></th></tr></thead>
          <tbody>
            {team.map((m, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(155deg, var(--c-primary-bright), var(--c-primary-deep))', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 12 }}>{m.initials}</div>
                      {m.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: 'var(--c-accent)', border: '2px solid white' }} />}
                    </div>
                    <div className="guest-name">{m.name}</div>
                  </div>
                </td>
                <td>{m.role}</td>
                <td className="meta">{m.access}</td>
                <td className="meta">{m.last}</td>
                <td><button className="c-btn c-btn-ghost" style={{ padding: '4px 8px' }}><IcoChev style={{ width: 14, height: 14 }} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
