import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TrendChart({ years, insurers }) {
  const [enabledIds, setEnabledIds] = useState(() => new Set(insurers.map((insurer) => insurer.id)))

  const chartData = useMemo(
    () =>
      years.map((year, yearIndex) => {
        const row = { year }
        insurers.forEach((insurer) => {
          row[insurer.id] = insurer.values[yearIndex]
        })
        return row
      }),
    [years, insurers],
  )

  const visibleInsurers = insurers.filter((insurer) => enabledIds.has(insurer.id))

  function toggleInsurer(id) {
    setEnabledIds((prev) => {
      // at least one insurer must stay active so the bars never go empty
      if (prev.has(id) && prev.size === 1) return prev

      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <section className="dashboard__section dashboard__section--main">
      <h2 className="dashboard__section-title">Autizmus na Slovensku 2015 – 2025</h2>
      <div className="dashboard__chart">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => value.toLocaleString('sk-SK')} />
            <Tooltip formatter={(value) => value.toLocaleString('sk-SK')} />
            {visibleInsurers.map((insurer, index) => (
              <Bar
                key={insurer.id}
                dataKey={insurer.id}
                name={insurer.name}
                stackId="total"
                fill={insurer.color}
                radius={index === visibleInsurers.length - 1 ? [4, 4, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        <div className="dashboard__insurer-legend">
          {insurers.map((insurer) => {
            const active = enabledIds.has(insurer.id)
            return (
              <button
                key={insurer.id}
                type="button"
                className={
                  active
                    ? 'dashboard__insurer-btn dashboard__insurer-btn--active'
                    : 'dashboard__insurer-btn'
                }
                style={{ '--insurer-color': insurer.color }}
                onClick={() => toggleInsurer(insurer.id)}
                aria-pressed={active}
              >
                <span className="dashboard__insurer-dot" />
                {insurer.name}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
