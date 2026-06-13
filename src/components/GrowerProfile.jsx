import { useState } from 'react'
import { GROWER_PROFILES } from '../data/growerProfiles.js'

function ProfileCard({ profile, selected, onSelect }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      style={{
        background: selected ? `rgba(${hexToRgb(profile.color)},0.08)` : 'var(--card)',
        border: `1.5px solid ${selected ? profile.color : 'var(--border2)'}`,
        borderRadius: 'var(--r-xl)',
        padding: 'var(--sp-lg)',
        marginBottom: 'var(--sp-sm)',
        transition: 'all 0.2s',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{
          fontSize: 36, lineHeight: 1,
          width: 52, height: 52,
          background: `rgba(${hexToRgb(profile.color)},0.12)`,
          borderRadius: 'var(--r-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {profile.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 16, color: profile.color, letterSpacing: -0.3 }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2, fontWeight: 500 }}>
            {profile.tagline}
          </div>
        </div>
        {selected && (
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: profile.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#0b0f09', fontWeight: 900, flexShrink: 0,
          }}>✓</div>
        )}
      </div>

      {/* Techniques */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {profile.techniques.map((t, i) => (
          <span key={i} style={{
            fontSize: 11, fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 99,
            background: `rgba(${hexToRgb(profile.color)},0.1)`,
            color: profile.color,
            border: `1px solid rgba(${hexToRgb(profile.color)},0.2)`,
          }}>{t}</span>
        ))}
      </div>

      {/* Expandable bio */}
      {expanded && (
        <div style={{
          fontSize: 13, color: 'var(--text2)', lineHeight: 1.6,
          marginBottom: 12, padding: '10px 12px',
          background: 'var(--surface)', borderRadius: 'var(--r-md)',
          fontWeight: 500,
        }}>
          {profile.bio}
          <div style={{ marginTop: 8, fontSize: 12, color: profile.color, fontWeight: 700 }}>
            🎯 Fokus: {profile.focus}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{
            flex: 1, padding: '10px', borderRadius: 'var(--r-xl)',
            background: selected ? profile.color : 'var(--card2)',
            color: selected ? '#0b0f09' : 'var(--text)',
            border: `1px solid ${selected ? profile.color : 'var(--border2)'}`,
            fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.18s',
          }}
          onClick={() => onSelect(selected ? null : profile.id)}
        >
          {selected ? '✓ Ausgewählt' : 'Diesen Stil wählen'}
        </button>
        <button
          style={{
            padding: '10px 14px', borderRadius: 'var(--r-xl)',
            background: 'var(--surface)', color: 'var(--text2)',
            border: '1px solid var(--border)', fontWeight: 600,
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>
    </div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export default function GrowerProfile({ grow, onClose }) {
  const { growerProfileId, setGrowerProfile, growerProfile } = grow

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" style={{ maxHeight: '92dvh' }} onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4 }}>
            Grower-Stil wählen
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
            Wähle einen Growing-Stil als deinen Coach. Die App zeigt dir dann phasenbezogene Tipps nach dieser Methode — zusätzlich zu den Standard-Empfehlungen.
          </p>
        </div>

        {growerProfile && (
          <div className="tip-card green" style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>{growerProfile.emoji}</span>
            <div style={{ fontSize: 13 }}>
              Aktiver Stil: <strong style={{ color: growerProfile.color }}>{growerProfile.name}</strong>
              {' '}— erscheint als Coaching-Tipp im Dashboard
            </div>
          </div>
        )}

        {GROWER_PROFILES.map(profile => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            selected={growerProfileId === profile.id}
            onSelect={(id) => {
              setGrowerProfile(id)
            }}
          />
        ))}

        {growerProfileId && (
          <button
            className="btn btn-secondary btn-full"
            style={{ marginTop: 8 }}
            onClick={() => setGrowerProfile(null)}
          >
            Kein Grower-Stil (Standard-Tipps)
          </button>
        )}

        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={onClose}>
          Fertig
        </button>
      </div>
    </div>
  )
}
