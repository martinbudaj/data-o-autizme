export default function YearToggle({ years, activeYear, onChange }) {
  return (
    <div className="dashboard__year-toggle">
      {years.map((year) => (
        <button
          key={year}
          type="button"
          className={
            year === activeYear
              ? 'dashboard__year-btn dashboard__year-btn--active'
              : 'dashboard__year-btn'
          }
          onClick={() => onChange(year)}
        >
          {year}
        </button>
      ))}
    </div>
  )
}
