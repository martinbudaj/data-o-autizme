export default function KpiCards({ summary }) {
  const items = [
    { label: 'Registrovaných osôb', value: summary.total.toLocaleString('sk-SK') },
    { label: 'Medziročný nárast', value: `+${summary.growthPercent} %` },
    { label: 'Výskyt (0–19 rokov)', value: summary.prevalenceLabel },
    { label: 'Najpočetnejšia veková skupina', value: summary.peakAgeGroup },
  ]

  return (
    <div className="dashboard__kpis">
      {items.map((item) => (
        <div className="dashboard__kpi-card" key={item.label}>
          <div className="dashboard__kpi-value">{item.value}</div>
          <div className="dashboard__kpi-label">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
