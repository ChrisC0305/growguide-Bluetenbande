import { useState } from 'react'

export default function GrowSetup({ onStart }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    name: '',
    strain: '',
    startDate: today,
    medium: 'soil',
    method: 'indoor',
    vegDays: '28',
    bloomDays: '63',
    notes: '',
  })

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onStart(form)
  }

  return (
    <div className="page" style={{ paddingBottom: '100px' }}>
      {/* Splash header */}
      <div className="splash-header">
        <img
          src={`${import.meta.env.BASE_URL}Logo Front1.png`}
          alt="Die Blütenbande"
          className="splash-logo"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
        />
        <div className="splash-logo-fallback" style={{ display: 'none' }}>🌿</div>
        <h1 className="splash-title">GrowGuide Plagron</h1>
        <div className="splash-sub">by Die Blütenbande</div>
        <p className="splash-desc">
          Dein persönlicher Grow-Begleiter.<br />Starte jetzt deinen ersten Grow.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="section-title">Grow-Infos</div>

          <div className="form-group">
            <label className="form-label">Grow-Name</label>
            <input
              className="form-input"
              placeholder="z.B. Grow #1 — Sommer 2025"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sorte / Strain (optional)</label>
            <input
              className="form-input"
              placeholder="z.B. OG Kush, White Widow…"
              value={form.strain}
              onChange={e => set('strain', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Startdatum</label>
            <input
              className="form-input"
              type="date"
              value={form.startDate}
              onChange={e => set('startDate', e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <div className="section-title">Anbau-Methode</div>

          <div className="form-group">
            <label className="form-label">Medium</label>
            <div className="options-grid">
              {[
                { val: 'soil', label: '🌱 Erde' },
                { val: 'coco', label: '🥥 Kokos' },
                { val: 'hydro', label: '💧 Hydro' },
                { val: 'mix', label: '🪨 Mix' },
              ].map(o => (
                <button
                  key={o.val}
                  type="button"
                  className={`option-btn ${form.medium === o.val ? 'selected' : ''}`}
                  onClick={() => set('medium', o.val)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Umgebung</label>
            <div className="options-grid">
              {[
                { val: 'indoor', label: '🏠 Indoor' },
                { val: 'outdoor', label: '☀️ Outdoor' },
                { val: 'greenhouse', label: '🏡 Greenhouse' },
                { val: 'autoflower', label: '⚡ Autoflower' },
              ].map(o => (
                <button
                  key={o.val}
                  type="button"
                  className={`option-btn ${form.method === o.val ? 'selected' : ''}`}
                  onClick={() => set('method', o.val)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="card">
          <div className="section-title">Zeitplan (Schätzung)</div>

          <div className="form-group">
            <label className="form-label">
              Vegetationsphase: <span style={{ color: 'var(--green)' }}>{form.vegDays} Tage ({Math.ceil(form.vegDays / 7)} Wochen)</span>
            </label>
            <input
              className="form-input"
              type="range"
              min="14"
              max="84"
              step="7"
              value={form.vegDays}
              onChange={e => set('vegDays', e.target.value)}
              style={{ padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer', accentColor: 'var(--green)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)' }}>
              <span>2 Wochen</span>
              <span>4 Wochen</span>
              <span>6 Wochen</span>
              <span>8 Wochen</span>
              <span>12 Wochen</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Blütephase: <span style={{ color: 'var(--pink)' }}>{form.bloomDays} Tage ({Math.ceil(form.bloomDays / 7)} Wochen)</span>
            </label>
            <input
              className="form-input"
              type="range"
              min="42"
              max="112"
              step="7"
              value={form.bloomDays}
              onChange={e => set('bloomDays', e.target.value)}
              style={{ padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer', accentColor: '#f472b6' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)' }}>
              <span>6 Wo.</span>
              <span>8 Wo.</span>
              <span>10 Wo.</span>
              <span>12 Wo.</span>
              <span>16 Wo.</span>
            </div>
          </div>

          <div className="tip-card blue">
            <span className="tip-icon">💡</span>
            <div>
              Geschätzter Erntezeitpunkt: <strong>
                {new Date(new Date(form.startDate).getTime() +
                  (parseInt(form.vegDays) + parseInt(form.bloomDays) + 14) * 86400000
                ).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
              </strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Notizen (optional)</label>
            <textarea
              className="form-input"
              placeholder="Besonderheiten, Ziele, Notizen zum Grow…"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full" style={{ marginBottom: 16 }}>
          🚀 Grow starten
        </button>
      </form>

      <div className="legal">
        Diese App dient nur als digitale Grow-Dokumentation und Orientierungshilfe.
        Bitte beachte die gesetzlichen Regelungen deines Landes.
      </div>
    </div>
  )
}
