import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ageBreakdown from '../../data/ageBreakdown.json'

// 10 raw age buckets are too many distinct colors for one stacked chart to carry
// (dataviz guidance caps categorical/ordinal color at ~5-7) — the 40+ brackets are
// each a small share anyway, so they fold into a single "40+" band here. Full
// per-decade granularity stays available via the age filter on the main trend chart.
const MERGED_GROUPS = [
  { label: '0-9', color: '#86b6ef', sourceIndices: [0] },
  { label: '10-19', color: '#5598e7', sourceIndices: [1] },
  { label: '20-29', color: '#2a78d6', sourceIndices: [2] },
  { label: '30-39', color: '#1c5cab', sourceIndices: [3] },
  { label: '40+', color: '#0d366b', sourceIndices: [4, 5, 6, 7, 8, 9] },
]

const INSURER_IDS = Object.keys(ageBreakdown.insurers)

// Recharts derives the default legend/tooltip swatch and text color from each Area's
// `stroke` (used here for the 2px surface-gap separator between stacked bands), so
// both the legend and the tooltip need their own explicit color instead of the default.
const LEGEND_PAYLOAD = MERGED_GROUPS.map((group) => ({
  value: group.label,
  type: 'square',
  color: group.color,
  id: group.label,
}))

const chartData = ageBreakdown.years.map((year) => {
  const yearKey = String(year)
  const bucketTotals = ageBreakdown.ageGroups.map((_, groupIndex) =>
    INSURER_IDS.reduce((sum, insurerId) => sum + ageBreakdown.insurers[insurerId][yearKey][groupIndex], 0),
  )
  const yearTotal = bucketTotals.reduce((sum, value) => sum + value, 0)

  const row = { year }
  MERGED_GROUPS.forEach((group) => {
    const groupTotal = group.sourceIndices.reduce((sum, index) => sum + bucketTotals[index], 0)
    row[group.label] = yearTotal > 0 ? (groupTotal / yearTotal) * 100 : 0
    row[`${group.label}__count`] = groupTotal
  })
  return row
})

function AgeStructureTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const dataRow = payload[0].payload

  return (
    <div className="dashboard__chart-tooltip">
      <div className="dashboard__chart-tooltip-title">{label}</div>
      {[...MERGED_GROUPS].reverse().map((group) => (
        <div className="dashboard__chart-tooltip-row" key={group.label}>
          <span className="dashboard__chart-tooltip-dot" style={{ background: group.color }} />
          <span className="dashboard__chart-tooltip-label">{group.label}</span>
          <span className="dashboard__chart-tooltip-value">
            {dataRow[group.label].toFixed(1)} % · {dataRow[`${group.label}__count`].toLocaleString('sk-SK')}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AgeStructureChart() {
  return (
    <section className="dashboard__section">
      <h2 className="dashboard__section-title">Vývoj vekovej štruktúry pacientov 2015 – 2025</h2>
      <div className="dashboard__chart">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(value) => `${Math.round(value)}%`} />
            <Tooltip content={<AgeStructureTooltip />} />
            <Legend
              payload={LEGEND_PAYLOAD}
              formatter={(value) => <span style={{ color: '#1f2430' }}>{value}</span>}
            />
            {MERGED_GROUPS.map((group) => (
              <Area
                key={group.label}
                type="monotone"
                dataKey={group.label}
                name={group.label}
                stackId="age"
                stroke="#fff"
                strokeWidth={2}
                fill={group.color}
                fillOpacity={1}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
