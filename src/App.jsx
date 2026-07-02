import { useState } from 'react'
import summaryByYear from '../data/summary.json'
import ageDistributionByYear from '../data/ageDistribution.json'
import regionDistributionByYear from '../data/regionDistribution.json'
import diagnosisStructureByYear from '../data/diagnosisStructure.json'
import YearToggle from './components/YearToggle.jsx'
import KpiCards from './components/KpiCards.jsx'
import AgeChart from './components/AgeChart.jsx'
import RegionChart from './components/RegionChart.jsx'
import DiagnosisChart from './components/DiagnosisChart.jsx'
import './dashboard.css'

const YEARS = Object.keys(summaryByYear).sort().reverse()

export default function App() {
  const [year, setYear] = useState(YEARS[0])

  return (
    <>
      <header className="dashboard__header">
        <h1 className="dashboard__title">Dáta o autizme na Slovensku</h1>
        <YearToggle years={YEARS} activeYear={year} onChange={setYear} />
      </header>

      <KpiCards summary={summaryByYear[year]} />

      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Výskyt podľa veku</h2>
        <AgeChart data={ageDistributionByYear[year]} />
      </section>

      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Výskyt podľa krajov</h2>
        <RegionChart data={regionDistributionByYear[year]} />
      </section>

      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Diagnostická štruktúra</h2>
        <DiagnosisChart data={diagnosisStructureByYear[year]} />
        <p className="dashboard__note">
          Súčet percent presahuje 100 %, keďže časť osôb má viac ako jednu diagnózu.
        </p>
      </section>
    </>
  )
}
