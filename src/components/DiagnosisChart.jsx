import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DiagnosisChart({ data }) {
  return (
    <div className="dashboard__chart">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="diagnosis" tick={{ fontSize: 12 }} interval={0} />
          <YAxis unit="%" />
          <Tooltip formatter={(value) => `${value} %`} />
          <Bar dataKey="percent" name="Podiel" fill="#f5a54f" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
