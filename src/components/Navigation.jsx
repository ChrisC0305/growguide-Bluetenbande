export default function Navigation({ active, onChange, hasGrow }) {
  const tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'calendar', icon: '📅', label: 'Kalender' },
    { id: 'nutrients', icon: '🌿', label: 'Dünger' },
    { id: 'settings', icon: '⚙️', label: 'Einstellungen' },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-btn ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
