import { useState } from 'react'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

const LOG_TYPES = [
  { id: 'water', icon: '💧', label: 'Gegossen' },
  { id: 'feed', icon: '🌿', label: 'Gedüngt' },
  { id: 'ph_check', icon: '📊', label: 'pH/EC' },
  { id: 'training', icon: '🪄', label: 'Training' },
  { id: 'photo', icon: '📷', label: 'Foto' },
  { id: 'note', icon: '📝', label: 'Notiz' },
  { id: 'problem', icon: '⚠️', label: 'Problem' },
  { id: 'flush', icon: '🚿', label: 'Gespült' },
]

function QuickLogModal({ onClose, onAdd }) {
  const [type, setType] = useState('water')
  const [note, setNote] = useState('')
  const [ph, setPh] = useState('')
  const [ec, setEc] = useState('')

  const submit = () => {
    const entry = { type, note }
    if (ph) entry.ph = ph
    if (ec) entry.ec = ec
    onAdd(entry)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700 }}>Aktion dokumentieren</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {LOG_TYPES.map(t => (
            <button
              key={t.id}
              className={`action-btn ${type === t.id ? 'done' : ''}`}
              onClick={() => setType(t.id)}
              style={{ borderColor: type === t.id ? 'var(--green)' : undefined }}
            >
              <span className="action-icon">{t.icon}</span>
              <span className="action-label">{t.label}</span>
            </button>
          ))}
        </div>

        {(type === 'ph_check' || type === 'feed' || type === 'water') && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div>
              <label className="form-label">pH-Wert</label>
              <input className="form-input" type="number" step="0.1" placeholder="6.2" value={ph} onChange={e => setPh(e.target.value)} />
            </div>
            <div>
              <label className="form-label">EC-Wert (mS/cm)</label>
              <input className="form-input" type="number" step="0.1" placeholder="1.8" value={ec} onChange={e => setEc(e.target.value)} />
            </div>
          </div>
        )}

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="form-label">Notiz (optional)</label>
          <textarea
            className="form-input"
            placeholder="Was ist aufgefallen? Besonderheiten…"
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            style={{ resize: 'none' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button className="btn btn-secondary" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={submit}>Speichern ✓</button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ grow }) {
  const { activeGrow, growDay, growWeek, currentPhase, phaseProgress, quickAction, toggleTodayCheck, getTodayChecks, getLogsForDate, growerProfile } = grow
  const [showLog, setShowLog] = useState(false)
  const [doneActions, setDoneActions] = useState({})

  const todayChecked = getTodayChecks()
  const today = new Date().toISOString().split('T')[0]
  const todayLogs = getLogsForDate(today)

  const mediumLabel = { soil: '🌱 Erde', coco: '🥥 Kokos', hydro: '💧 Hydro', mix: '🪨 Mix' }
  const methodLabel = { indoor: '🏠 Indoor', outdoor: '☀️ Outdoor', greenhouse: '🏡 Greenhouse', autoflower: '⚡ Autoflower' }

  const handleQuickAction = (type) => {
    if (doneActions[type]) return
    quickAction(type)
    setDoneActions(prev => ({ ...prev, [type]: true }))
  }

  if (!activeGrow || !currentPhase) return null

  const phaseColor = currentPhase.color || 'var(--green)'

  // Get today's main tip (rotate by day)
  const tipIndex = growDay % currentPhase.tips.length
  const mainTip = currentPhase.tips[tipIndex]
  const mainWarning = currentPhase.warnings[growDay % currentPhase.warnings.length]

  // Days until end of phase
  const daysLeft = Math.max(0, currentPhase.endDay - growDay)

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, marginBottom: 2 }}>
            {mediumLabel[activeGrow.medium]} · {methodLabel[activeGrow.method]}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{activeGrow.name}</h1>
          {activeGrow.strain && (
            <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>🌿 {activeGrow.strain}</div>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'right' }}>
          {new Date(activeGrow.startDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          <br />Startdatum
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-val">{growDay}</div>
          <div className="stat-label">Grow-Tag</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{growWeek}</div>
          <div className="stat-label">Woche</div>
        </div>
      </div>

      {/* Phase banner */}
      <div className="phase-banner" style={{ '--phase-color': phaseColor }}>
        <div className="phase-emoji">{currentPhase.icon}</div>
        <div style={{ flex: 1 }}>
          <div className="phase-name">{currentPhase.name}</div>
          <div className="phase-sub">
            {currentPhase.lightCycle} · {daysLeft > 0 ? `noch ${daysLeft} Tage in dieser Phase` : 'Phase endet heute'}
          </div>
          <div className="progress-wrap" style={{ marginTop: 8, marginBottom: 0 }}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${phaseProgress}%`, background: phaseColor }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="section-title">Heute erledigt</div>
      <div className="action-row" style={{ marginBottom: 16 }}>
        {[
          { type: 'water', icon: '💧', label: 'Gegossen' },
          { type: 'feed', icon: '🌿', label: 'Gedüngt' },
          { type: 'ph_check', icon: '📊', label: 'pH/EC' },
          { type: 'photo', icon: '📷', label: 'Foto' },
        ].map(a => (
          <button
            key={a.type}
            className={`action-btn ${doneActions[a.type] || todayLogs.some(l => l.type === a.type) ? 'done' : ''}`}
            onClick={() => handleQuickAction(a.type)}
          >
            <span className="action-icon">{a.icon}</span>
            <span className="action-label">{a.label}</span>
          </button>
        ))}
      </div>

      <button className="btn btn-secondary btn-full" style={{ marginBottom: 16 }} onClick={() => setShowLog(true)}>
        + Aktion dokumentieren
      </button>

      {/* Today's tip */}
      <div className="section-title">Heutiger Tipp</div>
      <div className="tip-card green">
        <span className="tip-icon">💡</span>
        <div>{mainTip}</div>
      </div>

      {/* Grower Coach tip */}
      {growerProfile && currentPhase && growerProfile.phaseNotes[currentPhase.id] && (() => {
        const note = growerProfile.phaseNotes[currentPhase.id]
        return (
          <>
            <div className="section-title">{growerProfile.emoji} {growerProfile.name} empfiehlt</div>
            <div style={{
              background: `rgba(${hexToRgb(growerProfile.color)},0.07)`,
              border: `1px solid rgba(${hexToRgb(growerProfile.color)},0.2)`,
              borderRadius: 'var(--r-xl)',
              padding: 'var(--sp-md) var(--sp-lg)',
              marginBottom: 'var(--sp-sm)',
            }}>
              <div style={{ fontSize: 13, color: growerProfile.color, fontWeight: 800, marginBottom: 6 }}>
                🎯 {note.focus}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, fontWeight: 500 }}>
                {note.tip}
              </div>
              {note.schedule && (
                <div style={{
                  marginTop: 8, fontSize: 12, color: 'var(--text2)', fontWeight: 600,
                  padding: '6px 10px', background: 'var(--surface)',
                  borderRadius: 'var(--r-md)', display: 'inline-block',
                }}>
                  🗓️ {note.schedule}
                </div>
              )}
            </div>
          </>
        )
      })()}

      {/* Warning */}
      <div className="section-title">Wichtig beachten</div>
      <div className="tip-card yellow">
        <span className="tip-icon">⚠️</span>
        <div>{mainWarning}</div>
      </div>

      {/* Environment targets */}
      <div className="section-title">Zielwerte heute</div>
      <div className="card" style={{ padding: '12px' }}>
        <div className="env-grid">
          <div className="env-box">
            <div className="env-label">🌡️ Temperatur (Tag)</div>
            <div className="env-val">{currentPhase.environment.temp.min}–{currentPhase.environment.temp.max}<span className="env-unit">°C</span></div>
            {currentPhase.environment.temp.note && (
              <div className="env-status text-xs text-muted">{currentPhase.environment.temp.note}</div>
            )}
          </div>
          <div className="env-box">
            <div className="env-label">💧 Luftfeuchtigkeit</div>
            <div className="env-val">{currentPhase.environment.humidity.min}–{currentPhase.environment.humidity.max}<span className="env-unit">%</span></div>
            {currentPhase.environment.humidity.note && (
              <div className="env-status text-xs text-muted">{currentPhase.environment.humidity.note}</div>
            )}
          </div>
          {currentPhase.environment.ph && (
            <div className="env-box">
              <div className="env-label">⚗️ pH-Wert</div>
              <div className="env-val">{currentPhase.environment.ph.min}–{currentPhase.environment.ph.max}</div>
              <div className="env-status text-xs" style={{ color: 'var(--green)' }}>Gießwasser</div>
            </div>
          )}
          {currentPhase.environment.ec && (
            <div className="env-box">
              <div className="env-label">⚡ EC (Erde)</div>
              <div className="env-val">{currentPhase.environment.ec.soil.min}–{currentPhase.environment.ec.soil.max}<span className="env-unit">mS/cm</span></div>
              <div className="env-status text-xs text-muted">
                ≈ {Math.round(currentPhase.environment.ec.soil.min * 500)}–{Math.round(currentPhase.environment.ec.soil.max * 500)} ppm
              </div>
            </div>
          )}
          {currentPhase.environment.vpd && (
            <div className="env-box">
              <div className="env-label">🌬️ VPD</div>
              <div className="env-val">{currentPhase.environment.vpd.min}–{currentPhase.environment.vpd.max}<span className="env-unit">kPa</span></div>
              <div className="env-status text-xs text-muted">{currentPhase.environment.vpd.label}</div>
            </div>
          )}
          {currentPhase.environment.ppfd && (
            <div className="env-box">
              <div className="env-label">☀️ PPFD (Licht)</div>
              <div className="env-val" style={{ fontSize: 14 }}>{currentPhase.environment.ppfd.min}–{currentPhase.environment.ppfd.max}</div>
              <div className="env-status text-xs text-muted">μmol/m²/s</div>
            </div>
          )}
          <div className="env-box">
            <div className="env-label">💡 Lichtzyklus</div>
            <div className="env-val" style={{ fontSize: 15 }}>{currentPhase.lightCycle}</div>
          </div>
        </div>
      </div>

      {/* Plagron products */}
      {currentPhase.feeding && currentPhase.feeding.length > 0 && (
        <>
          <div className="section-title">Plagron Produkte jetzt</div>
          {currentPhase.feeding.map((f, i) => (
            <div key={i} className="product-card">
              <div className="product-dot" style={{ background: f.color || 'var(--green)' }} />
              <div style={{ flex: 1 }}>
                <div className="product-name">
                  {f.product}
                  {f.foliar && <span className="badge badge-blue" style={{ marginLeft: 6 }}>Blattspray</span>}
                  {f.optional && <span className="badge badge-purple" style={{ marginLeft: 6 }}>Optional</span>}
                  {f.booster && <span className="badge badge-red" style={{ marginLeft: 6 }}>Booster</span>}
                </div>
                <div className="product-dose">{f.dose}</div>
                <div className="product-note">{f.frequency}</div>
              </div>
            </div>
          ))}
        </>
      )}

      {currentPhase.feeding && currentPhase.feeding.length === 0 && currentPhase.id !== 'germination' && (
        <div className="tip-card blue">
          <span className="tip-icon">💧</span>
          <div><strong>Nur reines Wasser!</strong> In dieser Phase kein Dünger verwenden.</div>
        </div>
      )}

      {/* Daily checklist */}
      <div className="section-title">Checkliste heute</div>
      <div className="card">
        {currentPhase.dailyChecks.map((check, i) => {
          const isChecked = todayChecked.includes(check)
          return (
            <div
              key={i}
              className={`check-item ${isChecked ? 'checked' : ''}`}
              onClick={() => toggleTodayCheck(check)}
            >
              <div className="check-circle">{isChecked ? '✓' : ''}</div>
              <span className="check-text">{check}</span>
            </div>
          )
        })}
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>
          {todayChecked.length} / {currentPhase.dailyChecks.length} erledigt
        </div>
      </div>

      {/* Recent logs */}
      {todayLogs.length > 0 && (
        <>
          <div className="section-title">Heute dokumentiert</div>
          <div className="card">
            {todayLogs.slice(0, 5).map(log => (
              <div key={log.id} className="log-entry">
                <div className="log-meta">
                  {new Date(log.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} · Tag {log.growDay}
                  {log.ph && <span style={{ marginLeft: 8, color: 'var(--green)' }}>pH {log.ph}</span>}
                  {log.ec && <span style={{ marginLeft: 8, color: 'var(--blue)' }}>EC {log.ec}</span>}
                </div>
                <div className="log-title">{log.title}</div>
                {log.note && <div className="log-note">{log.note}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Phase description */}
      <div className="section-title">Phase: {currentPhase.name}</div>
      <div className="tip-card blue">
        <span className="tip-icon">{currentPhase.icon}</span>
        <div style={{ lineHeight: 1.6 }}>{currentPhase.description}</div>
      </div>

      {/* Nutrients needed */}
      {currentPhase.nutrients.needed.length > 0 && (
        <>
          <div className="section-title">Wichtige Nährstoffe</div>
          <div className="card">
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10, lineHeight: 1.5 }}>
              {currentPhase.nutrients.role}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {currentPhase.nutrients.needed.map((n, i) => (
                <span key={i} className="pill">{n}</span>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="legal">
        Diese App dient nur als digitale Grow-Dokumentation und Orientierungshilfe.
        Bitte beachte die gesetzlichen Regelungen deines Landes.
      </div>

      {showLog && (
        <QuickLogModal
          onClose={() => setShowLog(false)}
          onAdd={(entry) => grow.addLog(entry)}
        />
      )}
    </div>
  )
}
