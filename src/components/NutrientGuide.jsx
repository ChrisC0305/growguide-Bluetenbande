import { useState } from 'react'
import { PLAGRON_PRODUCTS } from '../data/plagronProducts.js'
import { NUTRIENTS, EC_GUIDE, VPD_GUIDE, SOIL_PH_GUIDE, PPFD_GUIDE, EC_PPM_CONVERSION } from '../data/nutrients.js'
import { PHASES } from '../data/phases.js'

const TABS = [
  { id: 'products', label: '🌿 Plagron' },
  { id: 'nutrients', label: '⚗️ Nährstoffe' },
  { id: 'ec', label: '⚡ EC/PPM/Licht' },
  { id: 'ph', label: '🧪 pH' },
  { id: 'phases', label: '📋 Phasen' },
]

function NutrientBar({ nutrient, phaseId }) {
  const importance = nutrient.importance[phaseId] || 0
  const pct = (importance / 5) * 100
  return (
    <div className="nutrient-row">
      <div className="nutrient-header">
        <span className="nutrient-name" style={{ color: nutrient.color }}>
          {nutrient.symbol} — {nutrient.name}
        </span>
        <span className="nutrient-ph" style={{ fontSize: 11 }}>
          pH {nutrient.optimalPHMin}–{nutrient.optimalPHMax}
        </span>
      </div>
      <div className="nutrient-track">
        <div
          className="nutrient-fill"
          style={{ width: `${pct}%`, background: nutrient.color, opacity: importance === 0 ? 0.2 : 1 }}
        />
      </div>
    </div>
  )
}

function ProductDetail({ product, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: `${product.color}20`,
            border: `2px solid ${product.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, flexShrink: 0,
          }}>
            {product.icon}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{product.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>{product.category} · {product.medium}</div>
            {product.npk && (
              <span className="badge badge-green" style={{ marginTop: 4 }}>NPK: {product.npk}</span>
            )}
          </div>
        </div>

        <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>{product.description}</p>

        <div className="section-title">Dosierung</div>
        <div className="tip-card green" style={{ marginBottom: 14 }}>
          <span className="tip-icon">💊</span>
          <div>
            <strong>{product.dosage}</strong>
            {product.maxDosage && ` (max. ${product.maxDosage})`}
            {product.warning && <div style={{ marginTop: 6, color: 'var(--yellow)', fontSize: 13 }}>⚠️ {product.warning}</div>}
          </div>
        </div>

        <div className="section-title">Vorteile</div>
        {product.benefits.map((b, i) => (
          <div key={i} className="tip-card green" style={{ marginBottom: 6, padding: '8px 12px' }}>
            <span className="tip-icon">✓</span>
            <div style={{ fontSize: 13 }}>{b}</div>
          </div>
        ))}

        <div className="section-title">Einsatzzeitraum</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 12 }}>
          {PHASES.filter(p => product.phases.includes(p.id)).map(p => (
            <span key={p.id} className="pill" style={{ color: p.color, borderColor: `${p.color}40` }}>
              {p.icon} {p.name}
            </span>
          ))}
        </div>

        {product.stopAt && (
          <div className="tip-card yellow" style={{ marginBottom: 12 }}>
            <span className="tip-icon">⏹️</span>
            <div style={{ fontSize: 13 }}><strong>Stopp:</strong> {product.stopAt}</div>
          </div>
        )}

        {product.useWith && (
          <>
            <div className="section-title">Kombinieren mit</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 14 }}>
              {product.useWith.map((p, i) => <span key={i} className="pill">{p}</span>)}
            </div>
          </>
        )}

        {product.deficiencySymptoms && (
          <>
            <div className="section-title">Mangelsymptome</div>
            {product.deficiencySymptoms.map((s, i) => (
              <div key={i} className="tip-card red" style={{ marginBottom: 6, padding: '8px 12px' }}>
                <span className="tip-icon">⚠️</span>
                <div style={{ fontSize: 13 }}>{s}</div>
              </div>
            ))}
          </>
        )}

        {product.tip && (
          <div className="tip-card blue" style={{ marginTop: 8 }}>
            <span className="tip-icon">💡</span>
            <div style={{ fontSize: 13 }}>{product.tip}</div>
          </div>
        )}

        <button className="btn btn-secondary btn-full" style={{ marginTop: 16 }} onClick={onClose}>
          Schließen
        </button>
      </div>
    </div>
  )
}

function NutrientDetail({ nutrient, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 50,
            background: `${nutrient.color}20`,
            border: `2px solid ${nutrient.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 800, color: nutrient.color,
          }}>
            {nutrient.symbol}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{nutrient.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>{nutrient.category}</div>
            <span className="badge badge-blue" style={{ marginTop: 4 }}>pH {nutrient.optimalPHMin}–{nutrient.optimalPHMax}</span>
          </div>
        </div>

        <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>{nutrient.role}</p>

        <div className="section-title">Mangel-Symptome</div>
        {nutrient.deficiency.symptoms.map((s, i) => (
          <div key={i} className="tip-card yellow" style={{ marginBottom: 6, padding: '8px 12px' }}>
            <span className="tip-icon">⚠️</span>
            <div style={{ fontSize: 13 }}>{s}</div>
          </div>
        ))}
        <div className="tip-card red" style={{ marginBottom: 14 }}>
          <span className="tip-icon">🔍</span>
          <div style={{ fontSize: 13 }}>
            <strong>Ursache:</strong> {nutrient.deficiency.cause}
            <br /><strong>Lösung:</strong> {nutrient.deficiency.solution}
          </div>
        </div>

        {nutrient.excess.symptoms[0] !== 'Selten' && (
          <>
            <div className="section-title">Überschuss-Symptome</div>
            {nutrient.excess.symptoms.map((s, i) => (
              <div key={i} className="tip-card red" style={{ marginBottom: 6, padding: '8px 12px' }}>
                <span className="tip-icon">❌</span>
                <div style={{ fontSize: 13 }}>{s}</div>
              </div>
            ))}
          </>
        )}

        <div className="section-title">pH-Hinweis</div>
        <div className="tip-card blue">
          <span className="tip-icon">⚗️</span>
          <div style={{ fontSize: 13 }}>{nutrient.phNote}</div>
        </div>

        {nutrient.plagronProducts.length > 0 && (
          <>
            <div className="section-title">Plagron Produkte</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {nutrient.plagronProducts.map((p, i) => <span key={i} className="pill">{p}</span>)}
            </div>
          </>
        )}

        <button className="btn btn-secondary btn-full" style={{ marginTop: 16 }} onClick={onClose}>
          Schließen
        </button>
      </div>
    </div>
  )
}

export default function NutrientGuide({ grow }) {
  const [tab, setTab] = useState('products')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedNutrient, setSelectedNutrient] = useState(null)
  const [filterPhase, setFilterPhase] = useState('all')
  const [medium, setMedium] = useState('soil')

  const { currentPhase } = grow

  const filteredProducts = filterPhase === 'all'
    ? PLAGRON_PRODUCTS
    : PLAGRON_PRODUCTS.filter(p => p.phases.includes(filterPhase))

  const activePhaseId = currentPhase?.id || 'vegetative'

  return (
    <div className="page">
      <h1 className="page-title">🌿 Dünger & Nährstoffe</h1>

      <div className="tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* PLAGRON PRODUCTS */}
      {tab === 'products' && (
        <>
          {currentPhase && (
            <div className="tip-card green" style={{ marginBottom: 12 }}>
              <span className="tip-icon">{currentPhase.icon}</span>
              <div style={{ fontSize: 13 }}>
                Du bist in der <strong>{currentPhase.name}</strong> — gefilterte Empfehlungen unten.
              </div>
            </div>
          )}

          <div className="tab-bar scroll-x">
            <button className={`tab-btn ${filterPhase === 'all' ? 'active' : ''}`} onClick={() => setFilterPhase('all')}>Alle</button>
            {PHASES.slice(0, 8).map(p => (
              <button key={p.id} className={`tab-btn ${filterPhase === p.id ? 'active' : ''}`} onClick={() => setFilterPhase(p.id)}>
                {p.icon} {p.name}
              </button>
            ))}
          </div>

          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => setSelectedProduct(product)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${product.color}20`,
                border: `1.5px solid ${product.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>
                {product.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="product-name">{product.name}</div>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>{product.dosage}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3 }}>{product.category}</div>
                <div className="product-note" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description}
                </div>
                {product.npk && (
                  <span className="badge badge-green" style={{ marginTop: 5 }}>NPK {product.npk}</span>
                )}
                {product.applicationMethod === 'foliar' && (
                  <span className="badge badge-blue" style={{ marginTop: 5, marginLeft: 4 }}>Blattspray</span>
                )}
              </div>
            </div>
          ))}

          {/* Feeding schedule summary */}
          <div className="section-title">Phasenbezogener Düngepan</div>
          <div className="card">
            {PHASES.filter(p => p.feeding && p.feeding.length > 0).map(phase => (
              <div key={phase.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{phase.icon}</span>
                  <span style={{ fontWeight: 700, color: phase.color }}>{phase.name}</span>
                </div>
                {phase.feeding.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 0', borderBottom: '1px solid var(--border)',
                    fontSize: 13,
                  }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: f.color, flexShrink: 0 }} />
                      <span>{f.product}</span>
                    </div>
                    <span style={{ color: 'var(--green)', fontWeight: 600 }}>{f.dose}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {/* NUTRIENTS */}
      {tab === 'nutrients' && (
        <>
          <div className="tip-card blue" style={{ marginBottom: 12 }}>
            <span className="tip-icon">📊</span>
            <div style={{ fontSize: 13 }}>
              Balkenlänge zeigt die Wichtigkeit des Nährstoffs in der aktuellen Phase. Tippe auf einen Nährstoff für Details.
            </div>
          </div>

          <div className="tab-bar scroll-x">
            {PHASES.slice(0, 7).map(p => (
              <button key={p.id} className={`tab-btn ${activePhaseId === p.id ? 'active' : ''} ${filterPhase === p.id ? 'active' : ''}`}
                onClick={() => setFilterPhase(p.id === filterPhase ? activePhaseId : p.id)}>
                {p.icon} {p.name}
              </button>
            ))}
          </div>

          <div className="card">
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>
              Nährstoffbedarf in der Phase: <strong style={{ color: 'var(--green)' }}>
                {PHASES.find(p => p.id === (filterPhase !== 'all' ? filterPhase : activePhaseId))?.name || 'Vegetationsphase'}
              </strong>
            </div>
            {NUTRIENTS.map(n => (
              <div key={n.symbol} onClick={() => setSelectedNutrient(n)} style={{ cursor: 'pointer' }}>
                <NutrientBar nutrient={n} phaseId={filterPhase !== 'all' ? filterPhase : activePhaseId} />
              </div>
            ))}
          </div>

          <div className="section-title">Alle Nährstoffe</div>
          {NUTRIENTS.map(n => (
            <div
              key={n.symbol}
              className="product-card"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedNutrient(n)}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 50,
                background: `${n.color}20`, border: `2px solid ${n.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, color: n.color, flexShrink: 0,
              }}>
                {n.symbol}
              </div>
              <div style={{ flex: 1 }}>
                <div className="product-name">{n.name} ({n.symbol})</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3 }}>{n.category}</div>
                <div className="product-note" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {n.role}
                </div>
                <span className="badge badge-blue" style={{ marginTop: 4 }}>pH {n.optimalPHMin}–{n.optimalPHMax}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {/* EC/PPM */}
      {tab === 'ec' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button className={`option-btn ${medium === 'soil' ? 'selected' : ''}`} onClick={() => setMedium('soil')}>🌱 Erde / Soil</button>
            <button className={`option-btn ${medium === 'hydro' ? 'selected' : ''}`} onClick={() => setMedium('hydro')}>💧 Hydro</button>
          </div>

          <div className="tip-card blue" style={{ marginBottom: 12 }}>
            <span className="tip-icon">⚡</span>
            <div style={{ fontSize: 13 }}>
              Werte aus der PPM/EC Referenztabelle. EC steigert sich mit dem Wachstumsstadium.
              Bei jungen Pflanzen niedrig starten!
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
              padding: '10px 14px', background: 'var(--card2)',
              fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              <div>Stadium</div>
              <div>PPM</div>
              <div>EC (mS/cm)</div>
            </div>

            {EC_GUIDE[medium].map((row, i) => {
              const isFlush = row.stage === 'Flushing'
              return (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
                  padding: '10px 14px',
                  background: i % 2 === 0 ? 'var(--card)' : 'var(--surface)',
                  borderBottom: i < EC_GUIDE[medium].length - 1 ? '1px solid var(--border)' : undefined,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isFlush ? 'var(--blue)' : 'var(--text)' }}>
                    {row.stage}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                    {row.ppmMin}–{row.ppmMax}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isFlush ? 'var(--blue)' : 'var(--green)' }}>
                    {row.ecMin}–{row.ecMax}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="section-title">EC ↔ PPM Umrechnung (500er Skala)</div>
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="tip-card blue" style={{ marginBottom: 12 }}>
              <span className="tip-icon">🧮</span>
              <div style={{ fontSize: 13 }}>
                <strong>Formel: PPM = EC × 500</strong><br />
                {EC_PPM_CONVERSION.note}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {EC_PPM_CONVERSION.examples.map((e, i) => (
                <div key={i} style={{ background: 'var(--surface)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 3 }}>EC {e.ec} mS/cm</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green)' }}>{e.ppm} ppm</div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-title">PPFD Lichtintensität nach Phase</div>
          {PPFD_GUIDE.map((p, i) => (
            <div key={i} className="product-card" style={{ borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: p.color }}>
              <div style={{ flex: 1 }}>
                <div className="product-name" style={{ color: p.color }}>{p.phase}</div>
                <div className="product-note">{p.note}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 800, color: p.color, fontSize: 15 }}>{p.min}–{p.max}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>μmol/m²/s</div>
              </div>
            </div>
          ))}

          <div className="section-title">VPD Referenz (DimLux)</div>
          {VPD_GUIDE.map((v, i) => (
            <div key={i} className="product-card" style={{ borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: v.color }}>
              <div>
                <div className="product-name" style={{ color: v.color }}>{v.phase}</div>
                <div className="product-note">{v.label}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: v.color }}>{v.min}–{v.max} kPa</div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* PH */}
      {tab === 'ph' && (
        <>
          <div className="tip-card green" style={{ marginBottom: 14 }}>
            <span className="tip-icon">🎯</span>
            <div style={{ fontSize: 13 }}>
              <strong>Optimaler Boden-pH: 5.5–6.5</strong><br />
              Der richtige pH ist entscheidend! Ein falscher pH blockiert die Nährstoffaufnahme,
              selbst wenn ausreichend Dünger vorhanden ist.
            </div>
          </div>

          <div className="section-title">pH nach Wachstumsphase</div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {[
              { phase: 'Keimlinge / Sämlinge', ph: '5.8–5.9', color: '#86efac' },
              { phase: 'Vegetationsphase', ph: '6.0–6.2', color: '#22c55e' },
              { phase: 'Vorblüte', ph: '6.0–6.2', color: '#c084fc' },
              { phase: 'Blütephase', ph: '6.0–6.3', color: '#f472b6' },
              { phase: 'Spülphase', ph: '6.0–6.3', color: '#38bdf8' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px',
                borderBottom: i < 4 ? '1px solid var(--border)' : undefined,
              }}>
                <div style={{ fontSize: 14, color: r.color, fontWeight: 600 }}>{r.phase}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: r.color }}>{r.ph}</div>
              </div>
            ))}
          </div>

          <div className="section-title">Nährstoffaufnahme nach pH</div>
          <div className="tip-card blue" style={{ marginBottom: 12 }}>
            <span className="tip-icon">📈</span>
            <div style={{ fontSize: 13 }}>
              Die nachfolgende Übersicht zeigt den optimalen pH-Bereich für jeden Nährstoff.
              Außerhalb dieser Bereiche wird der Nährstoff blockiert.
            </div>
          </div>

          <div className="card">
            {NUTRIENTS.map(n => (
              <div key={n.symbol} style={{ marginBottom: 12 }} onClick={() => setSelectedNutrient(n)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: n.color }}>
                    {n.symbol} — {n.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                    pH {n.optimalPHMin}–{n.optimalPHMax}
                  </span>
                </div>
                {/* Visual pH bar from 4 to 10 */}
                <div style={{ position: 'relative', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    left: `${((n.optimalPHMin - 4) / 6) * 100}%`,
                    width: `${((n.optimalPHMax - n.optimalPHMin) / 6) * 100}%`,
                    height: '100%',
                    background: n.color,
                    borderRadius: 4,
                  }} />
                  {/* Optimal zone marker (5.5-6.5) */}
                  <div style={{
                    position: 'absolute',
                    left: `${((5.5 - 4) / 6) * 100}%`,
                    width: `${((6.5 - 5.5) / 6) * 100}%`,
                    height: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    borderLeft: '1px solid rgba(255,255,255,0.3)',
                    borderRight: '1px solid rgba(255,255,255,0.3)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                  <span>pH 4</span>
                  <span>5</span>
                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>5.5–6.5 ✓</span>
                  <span>8</span>
                  <span>10</span>
                </div>
              </div>
            ))}
          </div>

          <div className="section-title">Boden-pH messen (Runoff-Methode)</div>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: 'var(--green)' }}>
              {SOIL_PH_GUIDE.measureMethod}
            </div>
            {SOIL_PH_GUIDE.measureSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 50,
                  background: 'var(--green)', color: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{step}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PHASES */}
      {tab === 'phases' && (
        <>
          <div className="tip-card blue" style={{ marginBottom: 14 }}>
            <span className="tip-icon">📋</span>
            <div style={{ fontSize: 13 }}>Vollständiger Überblick über alle 10 Wachstumsphasen.</div>
          </div>

          {PHASES.map(phase => (
            <div key={phase.id} className="card" style={{ borderLeft: `4px solid ${phase.color}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 32 }}>{phase.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: phase.color }}>{phase.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1 }}>
                    Tag {phase.startDay}–{phase.endDay} · {phase.lightCycle}
                  </div>
                </div>
                <span className="badge" style={{ background: `${phase.color}20`, color: phase.color }}>
                  ~{phase.defaultDays}d
                </span>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10, lineHeight: 1.5 }}>
                {phase.description}
              </p>

              {phase.environment.temp && (
                <div className="env-grid" style={{ marginBottom: 10 }}>
                  <div className="env-box">
                    <div className="env-label">🌡️ Temp</div>
                    <div className="env-val" style={{ fontSize: 14 }}>{phase.environment.temp.min}–{phase.environment.temp.max}°C</div>
                  </div>
                  <div className="env-box">
                    <div className="env-label">💧 RH</div>
                    <div className="env-val" style={{ fontSize: 14 }}>{phase.environment.humidity?.min}–{phase.environment.humidity?.max}%</div>
                  </div>
                  {phase.environment.ph && (
                    <div className="env-box">
                      <div className="env-label">⚗️ pH</div>
                      <div className="env-val" style={{ fontSize: 14 }}>{phase.environment.ph.min}–{phase.environment.ph.max}</div>
                    </div>
                  )}
                  {phase.environment.ec && (
                    <div className="env-box">
                      <div className="env-label">⚡ EC</div>
                      <div className="env-val" style={{ fontSize: 14 }}>{phase.environment.ec.soil.min}–{phase.environment.ec.soil.max}</div>
                    </div>
                  )}
                </div>
              )}

              {phase.plagronProducts.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {phase.plagronProducts.map((p, i) => (
                    <span key={i} className="pill" style={{ color: phase.color }}>{p}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {selectedNutrient && (
        <NutrientDetail nutrient={selectedNutrient} onClose={() => setSelectedNutrient(null)} />
      )}
    </div>
  )
}
