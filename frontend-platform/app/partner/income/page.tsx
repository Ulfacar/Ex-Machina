'use client'

import { IcoDownload, IcoUp } from '@/components/partner/icons'

const fmtSom = (n: number) => Math.round(n).toLocaleString('ru-RU') + ' сом'

const ledger = [
  { id: 1, date: '20 апр 2026', hotel: 'Sary-Chelek Lodge', type: 'Подключение', amount: 21000, status: 'paid' },
  { id: 2, date: '5 апр 2026', hotel: 'Issyk-Kul Resort', type: 'Подключение', amount: 21000, status: 'paid' },
  { id: 3, date: '30 мар 2026', hotel: 'Plaza Hotel Karakol', type: 'Подключение', amount: 21000, status: 'pending', note: 'Ожидание оплаты клиентом' },
]

const activePipeline = 4 // leads in new/demo/testing

export default function IncomePage() {
  const totalPaid = ledger.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0)
  const pending = ledger.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0)

  return (
    <div className="p-page">
      <div className="p-page-head">
        <div>
          <h1>Доходы</h1>
          <div className="sub">30% разовая комиссия с каждого подключения ($700)</div>
        </div>
        <div className="p-page-actions">
          <button className="btn btn-outline"><IcoDownload />Выгрузить CSV</button>
        </div>
      </div>

      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kpi-card">
          <div className="v" style={{ color: 'var(--p-accent)' }}>{fmtSom(totalPaid)}</div>
          <div className="l">Получено</div>
          <div className="d up"><IcoUp style={{ width: 10, height: 10 }} />За всё время</div>
        </div>
        <div className="kpi-card">
          <div className="v" style={{ color: 'var(--p-warn)' }}>{fmtSom(pending)}</div>
          <div className="l">Ожидает</div>
          <div className="d">после подтверждения оплаты</div>
        </div>
        <div className="kpi-card">
          <div className="v" style={{ color: 'var(--p-primary-bright)' }}>{fmtSom(21000 * activePipeline)}</div>
          <div className="l">Потенциал воронки</div>
          <div className="d">если все {activePipeline} лида закроются</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-head">
          <div>
            <h3>История начислений</h3>
            <div className="sub">Все комиссии и их статусы</div>
          </div>
        </div>
        <table className="tbl">
          <thead><tr>
            <th>Дата</th><th>Отель</th><th>Тип</th><th>Сумма</th><th>Статус</th>
          </tr></thead>
          <tbody>
            {ledger.map(r => (
              <tr key={r.id}>
                <td className="num">{r.date}</td>
                <td className="guest-name">{r.hotel}</td>
                <td>{r.type}</td>
                <td className="num" style={{ fontWeight: 600, color: r.status === 'paid' ? 'var(--p-accent)' : 'var(--p-ink-muted)' }}>+{fmtSom(r.amount)}</td>
                <td>
                  {r.status === 'paid'
                    ? <span className="pill paid">Выплачено</span>
                    : <span className="pill demo">Ожидает</span>}
                  {r.note && <div className="meta">{r.note}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="card">
          <div className="card-head"><h3>Реквизиты для выплат</h3></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <InfoRow k="Способ" v="Банковская карта" />
            <InfoRow k="Карта" v="•••• 4729 (Optima Bank)" />
            <InfoRow k="Получатель" v="Турдубаев Б." />
            <InfoRow k="Период выплат" v="Каждый понедельник" />
            <button className="btn btn-outline" style={{ alignSelf: 'flex-start', marginTop: 6 }}>Изменить реквизиты</button>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Как считается комиссия</h3></div>
          <div className="card-body" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--p-ink-soft)' }}>
            <p style={{ margin: '0 0 10px' }}><strong>30% с подключения</strong> — это разовая выплата с первого месяца клиента ($700).</p>
            <p style={{ margin: 0 }}>Один клиент = <strong style={{ fontFamily: 'var(--p-font-mono)' }}>$210 ≈ 21 000 сом</strong>. Деньги падают на счёт после того, как клиент оплатил подписку.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--p-line-soft)', fontSize: 13 }}>
      <span style={{ color: 'var(--p-ink-muted)' }}>{k}</span>
      <span style={{ fontWeight: 500 }}>{v}</span>
    </div>
  )
}
