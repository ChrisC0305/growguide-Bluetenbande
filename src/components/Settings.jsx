import { useState } from 'react'
import { PHASES } from '../data/phases.js'
import GrowerProfile from './GrowerProfile.jsx'

export default function Settings({ grow }) {
  const { activeGrow, grows, growDay, growWeek, currentPhase, endGrow, deleteGrow,
          notifEnabled, enableNotifications, disableNotifications,
          growerProfile } = grow
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [notifStatus, setNotifStatus] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showAllGrows, setShowAllGrows] = useState(false)

  const mediumLabel = { soil: '🌱 Erde', coco: '🥥 Kokos', hydro: '💧 Hydro', mix: '🪨 Mix' }
  const methodLabel = { indoor: '🏠 Indoor', outdoor: '☀️ Outdoor', greenhouse: '🏡 Greenhouse', autoflower: '⚡ Autoflower' }

  const completedGrows = grows.filter(g => g.status === 'completed')
  const allLogs = grow.getLogsForGrow ? grow.getLogsForGrow() : []

  const estimatedHarvest = activeGrow
    ? new Date(new Date(activeGrow.startDate).getTime() +
        (parseInt(activeGrow.vegDays) + parseInt(activeGrow.bloomDays) + 14) * 86400000)
    : null

  const daysToHarvest = estimatedHarvest
    ? Math.max(0, Math.ceil((estimatedHarvest - Date.now()) / 86400000))
    : null

  return (
    <div className="page">
      <h1 className="page-title">⚙️ Einstellungen</h1>

      {/* Active Grow */}
      {activeGrow ? (
        <>
          <div className="section-title">Aktiver Grow</div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{activeGrow.name}</div>
                {activeGrow.strain && (
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>🌿 {activeGrow.strain}</div>
                )}
              </div>
              <span className="badge badge-green">Aktiv</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              <div className="env-box">
                <div className="env-label">Startdatum</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {new Date(activeGrow.startDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
              </div>
              <div className="env-box">
                <div className="env-label">Grow-Tag</div>
                <div style={{ fontWeight: 700, fontSize: 22, color: 'var(--green)' }}>Tag {growDay}</div>
              </div>
              <div className="env-box">
                <div className="env-label">Medium</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{mediumLabel[activeGrow.medium]}</div>
              </div>
              <div className="env-box">
                <div className="env-label">Methode</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{methodLabel[activeGrow.method]}</div>
              </div>
              <div className="env-box">
                <div className="env-label">Akt. Phase</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: currentPhase?.color }}>
                  {currentPhase?.icon} {currentPhase?.name}
                </div>
              </div>
              <div className="env-box">
                <div className="env-label">Einträge</div>
                <div style={{ fontWeight: 700, fontSize: 22, color: 'var(--green)' }}>{allLogs.length}</div>
              </div>
            </div>

            {estimatedHarvest && (
              <div className="tip-card blue" style={{ marginBottom: 14 }}>
                <span className="tip-icon">✂️</span>
                <div style={{ fontSize: 13 }}>
                  <strong>Geschätzte Ernte:</strong> {estimatedHarvest.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {daysToHarvest > 0 && ` (in ${daysToHarvest} Tagen)`}
                  {daysToHarvest === 0 && ' (heute!)'}
                  {daysToHarvest < 0 && ` (vor ${Math.abs(daysToHarvest)} Tagen)`}
                </div>
              </div>
            )}

            {activeGrow.notes && (
              <div className="tip-card green" style={{ marginBottom: 14 }}>
                <span className="tip-icon">📝</span>
                <div style={{ fontSize: 13 }}>{activeGrow.notes}</div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmEnd(true)}
              >
                ✅ Grow beenden
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setConfirmDelete(true)}
              >
                🗑️ Löschen
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="section-title">Grow-Zeitplan</div>
          <div className="card">
            {PHASES.map((phase, i) => {
              const isActive = currentPhase?.id === phase.id
              const isPast = growDay > phase.endDay
              const isFuture = growDay < phase.startDay
              return (
                <div key={phase.id} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  paddingBottom: i < PHASES.length - 1 ? 14 : 0,
                  marginBottom: i < PHASES.length - 1 ? 14 : 0,
                  borderBottom: i < PHASES.length - 1 ? '1px solid var(--border)' : undefined,
                }}>
                  {/* Timeline dot */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 50,
                    background: isActive ? phase.color : isPast ? 'var(--green-dark)' : 'var(--card2)',
                    border: `2px solid ${isActive ? phase.color : isPast ? 'var(--green)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, flexShrink: 0, marginTop: 2,
                  }}>
                    {isPast ? '✓' : isActive ? phase.icon : ''}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: 14, fontWeight: 700,
                        color: isActive ? phase.color : isPast ? 'var(--text2)' : 'var(--text3)',
                      }}>
                        {phase.name}
                      </span>
                      {isActive && <span className="badge badge-green">Jetzt</span>}
                      {isPast && <span className="badge" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--green-dark)' }}>✓</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
                      Tag {phase.startDay}–{phase.endDay} · {phase.lightCycle}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="tip-card blue" style={{ marginBottom: 14 }}>
          <span className="tip-icon">🌱</span>
          <div>Kein aktiver Grow. Starte einen neuen Grow über den Dashboard-Tab.</div>
        </div>
      )}

      {/* Previous grows */}
      {completedGrows.length > 0 && (
        <>
          <div className="section-title">Abgeschlossene Grows ({completedGrows.length})</div>
          <div className="card">
            {completedGrows.slice(0, showAllGrows ? undefined : 3).map(g => (
              <div key={g.id} className="log-entry">
                <div className="log-meta">
                  {new Date(g.startDate).toLocaleDateString('de-DE')} → {g.endedAt ? new Date(g.endedAt).toLocaleDateString('de-DE') : '?'}
                </div>
                <div className="log-title">{g.name}</div>
                {g.strain && <div className="log-note">🌿 {g.strain}</div>}
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <span className="badge badge-purple">{mediumLabel[g.medium]}</span>
                  <span className="badge badge-blue">{methodLabel[g.method]}</span>
                </div>
              </div>
            ))}
            {completedGrows.length > 3 && (
              <button className="btn btn-secondary btn-full btn-sm" style={{ marginTop: 8 }}
                onClick={() => setShowAllGrows(!showAllGrows)}>
                {showAllGrows ? 'Weniger anzeigen' : `Alle ${completedGrows.length} anzeigen`}
              </button>
            )}
          </div>
        </>
      )}

      {/* Grower Profile */}
      <div className="section-title">Grower-Stil / Coach</div>
      <div className="card" style={{ marginBottom: 'var(--sp-md)' }}>
        {growerProfile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              fontSize: 32, width: 48, height: 48,
              background: `rgba(0,0,0,0.2)`, borderRadius: 'var(--r-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{growerProfile.emoji}</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: growerProfile.color }}>{growerProfile.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{growerProfile.tagline}</div>
            </div>
          </div>
        ) : (
          <div className="tip-card blue" style={{ marginBottom: 14 }}>
            <span className="tip-icon">🎓</span>
            <div style={{ fontSize: 13 }}>
              Kein Grower-Stil aktiv. Wähle einen Coach für phasenbezogene Tipps nach einer bestimmten Methode.
            </div>
          </div>
        )}
        <button className="btn btn-secondary btn-full" onClick={() => setShowProfileModal(true)}>
          {growerProfile ? '🔄 Grower-Stil wechseln' : '🎓 Grower-Stil wählen'}
        </button>
      </div>

      {/* Notifications */}
      <div className="section-title">Benachrichtigungen</div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Phasenwechsel-Alarm</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>
              Benachrichtigung wenn sich EC, pH oder Temperatur ändern
            </div>
          </div>
          <div style={{
            width: 48, height: 28, borderRadius: 99,
            background: notifEnabled ? 'var(--primary)' : 'var(--border2)',
            cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
          }} onClick={async () => {
            if (notifEnabled) {
              disableNotifications()
              setNotifStatus('disabled')
            } else {
              const res = await enableNotifications()
              setNotifStatus(res.success ? 'enabled' : res.reason)
            }
          }}>
            <div style={{
              position: 'absolute', top: 3,
              left: notifEnabled ? 23 : 3,
              width: 22, height: 22, borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }} />
          </div>
        </div>

        {notifStatus === 'denied' && (
          <div className="tip-card yellow" style={{ marginBottom: 0 }}>
            <span className="tip-icon">⚠️</span>
            <div style={{ fontSize: 13 }}>
              Berechtigung verweigert. Erlaube Benachrichtigungen in den Browser-/App-Einstellungen.
            </div>
          </div>
        )}
        {notifStatus === 'not_supported' && (
          <div className="tip-card yellow" style={{ marginBottom: 0 }}>
            <span className="tip-icon">⚠️</span>
            <div style={{ fontSize: 13 }}>Dein Browser unterstützt keine Benachrichtigungen.</div>
          </div>
        )}
        {notifStatus === 'enabled' && (
          <div className="tip-card green" style={{ marginBottom: 0 }}>
            <span className="tip-icon">✅</span>
            <div style={{ fontSize: 13 }}>Phasenwechsel-Benachrichtigungen sind aktiv.</div>
          </div>
        )}

        {!notifEnabled && !notifStatus && (
          <div className="tip-card blue" style={{ marginBottom: 0 }}>
            <span className="tip-icon">🔔</span>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              Aktiviere Benachrichtigungen um beim Wechsel der Wachstumsphase automatisch über neue pH-, EC- und Temperaturziele informiert zu werden.
            </div>
          </div>
        )}
      </div>

      {/* App info */}
      <div className="section-title">App Info</div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text2)' }}>App-Name</span>
          <span style={{ fontWeight: 600 }}>GrowGuide Plagron</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text2)' }}>Version</span>
          <span style={{ fontWeight: 600 }}>1.0.0</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text2)' }}>Daten-Speicher</span>
          <span style={{ fontWeight: 600 }}>Lokal (LocalStorage)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
          <span style={{ color: 'var(--text2)' }}>Düngermarke</span>
          <span style={{ fontWeight: 600 }}>Plagron 🌿</span>
        </div>
      </div>

      {/* PWA Install hint */}
      <div className="section-title">Als App installieren</div>
      <div className="tip-card blue" style={{ marginBottom: 8 }}>
        <span className="tip-icon">📱</span>
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>
          <strong>Android:</strong> Öffne diese Seite in Chrome → Menü (⋮) → "Zum Startbildschirm hinzufügen"
        </div>
      </div>
      <div className="tip-card blue" style={{ marginBottom: 14 }}>
        <span className="tip-icon">🍎</span>
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>
          <strong>iPhone/iPad:</strong> Öffne diese Seite in Safari → Teilen (↑) → "Zum Home-Bildschirm"
        </div>
      </div>

      {/* Confirm end grow */}
      {confirmEnd && (
        <div className="modal-overlay" onClick={() => setConfirmEnd(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h3 style={{ marginBottom: 8 }}>Grow beenden?</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.5 }}>
                Der Grow wird als abgeschlossen markiert. Alle Daten bleiben erhalten.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setConfirmEnd(false)}>Abbrechen</button>
              <button className="btn btn-primary" onClick={() => { endGrow(); setConfirmEnd(false) }}>
                Grow beenden
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
              <h3 style={{ marginBottom: 8 }}>Grow löschen?</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.5 }}>
                Alle Daten dieses Grows werden <strong style={{ color: 'var(--red)' }}>unwiderruflich gelöscht</strong>,
                einschließlich aller Einträge und Logs.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>Abbrechen</button>
              <button className="btn btn-danger" onClick={() => {
                deleteGrow(activeGrow.id)
                setConfirmDelete(false)
              }}>
                Endgültig löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <GrowerProfile grow={grow} onClose={() => setShowProfileModal(false)} />
      )}

      <div className="legal">
        ⚠️ Diese App dient nur als digitale Grow-Dokumentation und Orientierungshilfe.
        Bitte beachte die gesetzlichen Regelungen deines Landes.
        Alle Daten werden ausschließlich lokal auf deinem Gerät gespeichert.
      </div>
    </div>
  )
}
