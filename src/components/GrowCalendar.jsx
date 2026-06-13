import { useState } from 'react'

const MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
const DAY_NAMES = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const TYPE_META = {
  water: { icon: '💧', color: '#38bdf8', label: 'Gegossen' },
  feed: { icon: '🌿', color: '#22c55e', label: 'Gedüngt' },
  ph_check: { icon: '📊', color: '#a78bfa', label: 'pH/EC' },
  training: { icon: '🪄', color: '#f97316', label: 'Training' },
  photo: { icon: '📷', color: '#fbbf24', label: 'Foto' },
  note: { icon: '📝', color: '#94a3b8', label: 'Notiz' },
  problem: { icon: '⚠️', color: '#ef4444', label: 'Problem' },
  flush: { icon: '🚿', color: '#38bdf8', label: 'Gespült' },
  harvest: { icon: '✂️', color: '#fbbf24', label: 'Geerntet' },
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  // Monday-based (0=Mon, 6=Sun)
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

export default function GrowCalendar({ grow }) {
  const { activeGrow, growDay, currentPhase, getLogsForDate, getLogsForGrow, quickAction } = grow
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const allLogs = activeGrow ? getLogsForGrow() : []
  const logDates = new Set(allLogs.map(l => l.dateKey))

  const startDate = activeGrow ? new Date(activeGrow.startDate) : null

  function isGrowDay(d) {
    if (!startDate) return false
    const date = new Date(year, month, d)
    return date >= startDate && date <= now
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const selectedLogs = getLogsForDate(selectedDate)
  const selectedDay = selectedDate ? parseInt(selectedDate.split('-')[2]) : null
  const selectedGrowDay = startDate && selectedDate
    ? Math.max(1, Math.floor((new Date(selectedDate).getTime() - startDate.getTime()) / 86400000) + 1)
    : null

  // Build calendar cells
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const dateKey = (d) => {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  const todayKey = now.toISOString().split('T')[0]

  return (
    <div className="page">
      <h1 className="page-title">📅 Grow-Kalender</h1>

      {!activeGrow && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-title">Kein aktiver Grow</div>
          <div className="empty-desc">Starte zuerst einen Grow über den Dashboard-Tab.</div>
        </div>
      )}

      {activeGrow && (
        <>
          {/* Grow info strip */}
          <div className="card" style={{ marginBottom: 12, padding: '10px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{activeGrow.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  Tag {growDay} · {currentPhase?.name}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green)' }}>{allLogs.length}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Einträge</div>
              </div>
            </div>
          </div>

          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <button className="btn btn-secondary btn-sm" onClick={prevMonth}>‹</button>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{MONTH_NAMES[month]} {year}</div>
            <button className="btn btn-secondary btn-sm" onClick={nextMonth}>›</button>
          </div>

          {/* Calendar grid */}
          <div className="card" style={{ padding: 12 }}>
            <div className="cal-grid">
              {DAY_NAMES.map(d => (
                <div key={d} className="cal-day-head">{d}</div>
              ))}
              {cells.map((d, i) => {
                if (!d) return <div key={`empty-${i}`} />
                const key = dateKey(d)
                const isToday = key === todayKey
                const hasLog = logDates.has(key)
                const isGrow = isGrowDay(d)
                const isSelected = key === selectedDate
                return (
                  <div
                    key={d}
                    className={`cal-day ${isToday ? 'today' : ''} ${hasLog ? 'has-log' : ''} ${isGrow && !isToday ? 'grow-day' : ''}`}
                    style={{
                      outline: isSelected && !isToday ? '2px solid var(--green)' : undefined,
                    }}
                    onClick={() => setSelectedDate(key)}
                  >
                    {d}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11, color: 'var(--text3)', justifyContent: 'center' }}>
              <span>● Eintrag</span>
              <span style={{ color: 'rgba(34,197,94,0.4)' }}>■ Grow-Tag</span>
              <span style={{ color: 'var(--green)' }}>● Heute</span>
            </div>
          </div>

          {/* Selected day */}
          {selectedDate && (
            <>
              <div className="section-title">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
                {selectedGrowDay && selectedGrowDay > 0 && ` · Tag ${selectedGrowDay}`}
              </div>

              {selectedLogs.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                  <div style={{ color: 'var(--text2)', fontSize: 14 }}>Keine Einträge an diesem Tag</div>
                </div>
              ) : (
                <div className="card">
                  {selectedLogs.map(log => {
                    const meta = TYPE_META[log.type] || { icon: '📌', color: 'var(--text2)', label: log.type }
                    return (
                      <div key={log.id} className="log-entry">
                        <div className="log-meta">
                          {new Date(log.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                          {log.ph && <span style={{ marginLeft: 8, color: 'var(--green)' }}>pH {log.ph}</span>}
                          {log.ec && <span style={{ marginLeft: 8, color: 'var(--blue)' }}>EC {log.ec}</span>}
                          {log.growDay && <span style={{ marginLeft: 8 }}>Tag {log.growDay}</span>}
                        </div>
                        <div className="log-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{meta.icon}</span>
                          <span style={{ color: meta.color }}>{log.title}</span>
                        </div>
                        {log.products && log.products.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 4 }}>
                            {log.products.map((p, i) => (
                              <span key={i} className="pill">{p}</span>
                            ))}
                          </div>
                        )}
                        {log.note && <div className="log-note">{log.note}</div>}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* All logs summary */}
          <div className="section-title">Alle Einträge ({allLogs.length})</div>
          {allLogs.length === 0 ? (
            <div className="tip-card blue">
              <span className="tip-icon">📊</span>
              <div>Noch keine Einträge. Dokumentiere Gießen, Düngen, pH-Werte und Notizen über das Dashboard.</div>
            </div>
          ) : (
            <div className="card">
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
                {Object.entries(TYPE_META).map(([type, meta]) => {
                  const count = allLogs.filter(l => l.type === type).length
                  if (!count) return null
                  return (
                    <div key={type} style={{ textAlign: 'center', padding: '8px 4px', background: 'var(--surface)', borderRadius: 8 }}>
                      <div style={{ fontSize: 20 }}>{meta.icon}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: meta.color }}>{count}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{meta.label}</div>
                    </div>
                  )
                })}
              </div>

              {allLogs.slice(0, 20).map(log => {
                const meta = TYPE_META[log.type] || { icon: '📌', color: 'var(--text2)', label: log.type }
                return (
                  <div key={log.id} className="log-entry">
                    <div className="log-meta">
                      {new Date(log.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} ·
                      {new Date(log.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} · Tag {log.growDay}
                      {log.ph && <span style={{ marginLeft: 8, color: 'var(--green)' }}>pH {log.ph}</span>}
                      {log.ec && <span style={{ marginLeft: 8, color: 'var(--blue)' }}>EC {log.ec}</span>}
                    </div>
                    <div className="log-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{meta.icon}</span>
                      <span style={{ color: meta.color }}>{log.title}</span>
                      {log.phase && <span className="badge badge-green" style={{ marginLeft: 4 }}>{log.phase}</span>}
                    </div>
                    {log.note && <div className="log-note">{log.note}</div>}
                  </div>
                )
              })}
              {allLogs.length > 20 && (
                <div style={{ textAlign: 'center', padding: '12px', color: 'var(--text3)', fontSize: 13 }}>
                  + {allLogs.length - 20} weitere Einträge
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
