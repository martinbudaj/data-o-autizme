import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RegionChart({ data }) {
  return (
    <div className="dashboard__chart">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={(value) => value.toLocaleString('sk-SK')} />
          <YAxis type="category" dataKey="region" width={120} />
          <Tooltip formatter={(value) => value.toLocaleString('sk-SK')} />
          <Bar dataKey="count" name="Počet osôb" fill="#2fb380" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
