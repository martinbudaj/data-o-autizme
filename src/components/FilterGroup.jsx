import { useState } from 'react'

export default function FilterGroup({ title, items, selectedIds, onToggle, collapsible = true }) {
  const [open, setOpen] = useState(!collapsible)
  const allSelected = selectedIds.size === items.length
  const summary = allSelected ? 'všetky' : `${selectedIds.size}/${items.length}`

  return (
    <div className="dashboard__filter-group">
      {collapsible ? (
        <button
          type="button"
          className="dashboard__filter-toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <span className="dashboard__filter-title">{title}</span>
          <span className="dashboard__filter-summary">
            {summary}
            <span className="dashboard__filter-chevron" aria-hidden="true">
              {open ? '−' : '+'}
            </span>
          </span>
        </button>
      ) : (
        <span className="dashboard__filter-title dashboard__filter-title--static">{title}</span>
      )}

      {open && (
        <div className="dashboard__filter-chips">
          {items.map((item) => {
            const active = selectedIds.has(item.id)
            return (
              <button
                key={item.id}
                type="button"
                className={active ? 'dashboard__chip dashboard__chip--active' : 'dashboard__chip'}
                style={item.color ? { '--chip-color': item.color } : undefined}
                onClick={() => onToggle(item.id)}
                aria-pressed={active}
              >
                {item.color && <span className="dashboard__chip-dot" />}
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
