export default function Header({ grow }) {
  const hasGrow = grow?.activeGrow
  const growDay = grow?.growDay

  return (
    <header className="bb-header">
      {/* Blütenbande Logo */}
      <img
        src={`${import.meta.env.BASE_URL}Logo Front1.png`}
        alt="Die Blütenbande"
        className="bb-logo"
        onError={e => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />
      <div className="bb-logo-fallback" style={{ display: 'none' }}>
        <span className="bb-logo-emoji">🌿</span>
        <div className="bb-logo-text">
          <span className="bb-logo-die">Die</span>
          <span className="bb-logo-name">Blütenbande</span>
        </div>
      </div>

      <div className="bb-header-divider" />

      <div className="bb-header-app">
        <span className="bb-header-app-name">GrowGuide</span>
        <span className="bb-header-app-sub">Plagron Edition</span>
      </div>

      {hasGrow && (
        <div className="bb-header-grow-badge">
          <span className="bb-grow-day">{growDay}</span>
          <span className="bb-grow-label">Tag</span>
        </div>
      )}
    </header>
  )
}
