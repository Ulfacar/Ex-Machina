'use client'

import { IcoPlus, IcoKnowledge, IcoChev } from '@/components/cabinet/icons'

export default function KnowledgePage() {
  const docs = [
    { name: 'Описание отеля и номеров', type: 'MD', size: '12 KB', upd: '1 мар', chunks: 24 },
    { name: 'Прайс-лист 2026', type: 'XLSX', size: '48 KB', upd: '28 фев', chunks: 12 },
    { name: 'Карта отеля и территория.pdf', type: 'PDF', size: '2.1 MB', upd: '20 фев', chunks: 18 },
    { name: 'Меню ресторана', type: 'PDF', size: '640 KB', upd: '15 фев', chunks: 9 },
    { name: 'Правила и регламенты', type: 'DOCX', size: '84 KB', upd: '10 фев', chunks: 31 },
    { name: 'Достопримечательности рядом', type: 'MD', size: '8 KB', upd: '5 фев', chunks: 14 },
  ]

  return (
    <div className="cab-page">
      <div className="cab-page-head">
        <div>
          <h1>База знаний</h1>
          <div className="sub">Документы, на которые опирается бот при ответах. Обновляются автоматически.</div>
        </div>
        <div className="cab-page-actions">
          <button className="c-btn c-btn-outline">Подключить Notion</button>
          <button className="c-btn c-btn-primary"><IcoPlus style={{ width: 14, height: 14 }} />Загрузить документ</button>
        </div>
      </div>

      <div className="cab-cols-3" style={{ marginBottom: 16 }}>
        {[
          ['Документов', '6', 'из них 4 обновлены за месяц'],
          ['Чанков (фрагментов)', '108', 'проиндексировано'],
          ['Покрытие вопросов', '94%', 'оценка по типичным запросам'],
        ].map(([l, v, h], i) => (
          <div key={i} className="kpi" style={{ padding: 16 }}>
            <div className="kpi-label">{l as string}</div>
            <div className="kpi-value" style={{ fontSize: 26 }}>{v as string}</div>
            <div style={{ fontSize: 11.5, color: 'var(--c-ink-muted)', marginTop: 4 }}>{h as string}</div>
          </div>
        ))}
      </div>

      <div className="c-card">
        <div className="c-card-head"><div><h3>Документы</h3><div className="sub">Что бот «прочитал»</div></div></div>
        <table className="c-table">
          <thead><tr><th>Имя</th><th>Тип</th><th>Размер</th><th>Чанки</th><th>Обновлено</th><th></th></tr></thead>
          <tbody>
            {docs.map((d, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 7, background: 'var(--c-tint)', display: 'grid', placeItems: 'center', color: 'var(--c-ink-muted)' }}>
                      <IcoKnowledge style={{ width: 14, height: 14 }} />
                    </div>
                    <div style={{ fontWeight: 500 }}>{d.name}</div>
                  </div>
                </td>
                <td><span className="c-status-pill bot" style={{ fontFamily: 'var(--font-mono)' }}>{d.type}</span></td>
                <td className="num">{d.size}</td>
                <td className="num">{d.chunks}</td>
                <td className="meta">{d.upd}</td>
                <td><button className="c-btn c-btn-ghost" style={{ padding: '4px 8px' }}><IcoChev style={{ width: 14, height: 14 }} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
