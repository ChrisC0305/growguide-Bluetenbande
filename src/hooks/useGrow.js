import { useState, useEffect, useCallback } from 'react'
import { PHASES, getPhaseByDay } from '../data/phases.js'
import { getProfileById } from '../data/growerProfiles.js'

const STORAGE_KEY       = 'growguide_grows'
const ACTIVE_KEY        = 'growguide_active'
const LOG_KEY           = 'growguide_logs'
const CHECKS_KEY        = 'growguide_checks'
const NOTIF_PHASE_KEY   = 'growguide_notif_phase'
const NOTIF_ENABLED_KEY = 'growguide_notif_enabled'
const PROFILE_KEY       = 'growguide_grower_profile'
const BRAND_KEY         = 'growguide_brand'

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* storage full */ }
}

function buildNotificationBody(phase) {
  const env = phase.environment
  const parts = []
  if (env.ph)       parts.push(`pH: ${env.ph.min}–${env.ph.max}`)
  if (env.ec?.soil) parts.push(`EC: ${env.ec.soil.min}–${env.ec.soil.max} mS/cm`)
  if (env.temp)     parts.push(`Temp: ${env.temp.min}–${env.temp.max}°C`)
  if (env.humidity) parts.push(`Feuchte: ${env.humidity.min}–${env.humidity.max}%`)
  return parts.join(' · ')
}

export function useGrow() {
  const [grows, setGrows]               = useState(() => load(STORAGE_KEY, []))
  const [activeGrowId, setActiveGrowId] = useState(() => load(ACTIVE_KEY, null))
  const [logs, setLogs]                 = useState(() => load(LOG_KEY, []))
  const [todayChecks, setTodayChecks]   = useState(() => load(CHECKS_KEY, {}))
  const [notifEnabled, setNotifEnabled] = useState(() => load(NOTIF_ENABLED_KEY, false))
  const [growerProfileId, setGrowerProfileId] = useState(() => load(PROFILE_KEY, null))
  const [brand, setBrandState]               = useState(() => load(BRAND_KEY, 'plagron'))

  useEffect(() => { save(STORAGE_KEY, grows) }, [grows])
  useEffect(() => { save(ACTIVE_KEY, activeGrowId) }, [activeGrowId])
  useEffect(() => { save(LOG_KEY, logs) }, [logs])
  useEffect(() => { save(CHECKS_KEY, todayChecks) }, [todayChecks])
  useEffect(() => { save(NOTIF_ENABLED_KEY, notifEnabled) }, [notifEnabled])
  useEffect(() => { save(PROFILE_KEY, growerProfileId) }, [growerProfileId])
  useEffect(() => { save(BRAND_KEY, brand) }, [brand])

  const setBrand = useCallback((b) => setBrandState(b), [])

  const activeGrow = grows.find(g => g.id === activeGrowId) || null

  const growDay = activeGrow
    ? Math.max(1, Math.floor((Date.now() - new Date(activeGrow.startDate).getTime()) / 86400000) + 1)
    : 0

  const growWeek = Math.ceil(growDay / 7)
  const currentPhase = activeGrow ? getPhaseByDay(growDay) : null

  const phaseProgress = currentPhase
    ? Math.min(100, Math.round(((growDay - currentPhase.startDay) / (currentPhase.endDay - currentPhase.startDay + 1)) * 100))
    : 0

  const todayKey = new Date().toISOString().split('T')[0]

  // ── Phasenwechsel-Benachrichtigung ───────────────────
  useEffect(() => {
    if (!activeGrowId || !currentPhase || !notifEnabled) return
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    const notifiedPhases = load(NOTIF_PHASE_KEY, {})
    const lastPhaseId = notifiedPhases[activeGrowId]

    // Bereits für diese Phase benachrichtigt
    if (lastPhaseId === currentPhase.id) return

    // Erste Phase beim Grow-Start nicht als "neu" anzeigen
    if (!lastPhaseId && currentPhase.id === PHASES[0].id) {
      save(NOTIF_PHASE_KEY, { ...notifiedPhases, [activeGrowId]: currentPhase.id })
      return
    }

    const body = buildNotificationBody(currentPhase)
    new Notification(`${currentPhase.icon} Neue Phase: ${currentPhase.name}`, {
      body: body || `Dein Grow ist jetzt in einer neuen Phase.`,
      icon: `${import.meta.env.BASE_URL}Logo Front1.png`,
      badge: `${import.meta.env.BASE_URL}Logo Front1.png`,
      tag: `growguide-phase-${currentPhase.id}`,
    })

    save(NOTIF_PHASE_KEY, { ...notifiedPhases, [activeGrowId]: currentPhase.id })
  }, [activeGrowId, currentPhase?.id, notifEnabled])

  // ── Benachrichtigungen aktivieren ────────────────────
  const enableNotifications = useCallback(async () => {
    if (!('Notification' in window)) {
      return { success: false, reason: 'not_supported' }
    }
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      setNotifEnabled(true)
      return { success: true }
    }
    return { success: false, reason: 'denied' }
  }, [])

  const disableNotifications = useCallback(() => {
    setNotifEnabled(false)
  }, [])

  const setGrowerProfile = useCallback(async (profileId) => {
    setGrowerProfileId(profileId)
    // Anfänger-Coach aktiviert automatisch Benachrichtigungen
    if (profileId) {
      const profile = getProfileById(profileId)
      if (profile?.requiresNotifications && !notifEnabled) {
        if ('Notification' in window && Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            setNotifEnabled(true)
            new Notification('📚 Anfänger-Coach aktiv!', {
              body: 'Du wirst bei jedem Phasenwechsel benachrichtigt was als nächstes zu tun ist.',
              icon: `${import.meta.env.BASE_URL}Logo Front1.png`,
              tag: 'anfaenger-coach-welcome',
            })
          }
        }
      }
    }
  }, [notifEnabled])

  // ── Grow-Verwaltung ──────────────────────────────────
  const startGrow = useCallback((growData) => {
    const id = Date.now().toString()
    const newGrow = {
      id,
      name: growData.name || 'Mein Grow',
      strain: growData.strain || '',
      startDate: growData.startDate || new Date().toISOString(),
      medium: growData.medium || 'soil',
      method: growData.method || 'indoor',
      brand: growData.brand || 'plagron',
      vegDays: parseInt(growData.vegDays) || 28,
      bloomDays: parseInt(growData.bloomDays) || 63,
      notes: growData.notes || '',
      createdAt: new Date().toISOString(),
    }
    setGrows(prev => [...prev, newGrow])
    setActiveGrowId(id)
    if (growData.brand) setBrandState(growData.brand)
    return id
  }, [])

  const endGrow = useCallback(() => {
    if (!activeGrow) return
    setGrows(prev => prev.map(g =>
      g.id === activeGrowId ? { ...g, endedAt: new Date().toISOString(), status: 'completed' } : g
    ))
    setActiveGrowId(null)
  }, [activeGrow, activeGrowId])

  const deleteGrow = useCallback((id) => {
    setGrows(prev => prev.filter(g => g.id !== id))
    if (activeGrowId === id) setActiveGrowId(null)
    setLogs(prev => prev.filter(l => l.growId !== id))
  }, [activeGrowId])

  const addLog = useCallback((entry) => {
    const log = {
      id: Date.now().toString(),
      growId: activeGrowId,
      growDay,
      growWeek,
      phase: currentPhase?.id || '',
      date: new Date().toISOString(),
      dateKey: new Date().toISOString().split('T')[0],
      ...entry,
    }
    setLogs(prev => [log, ...prev])
    return log
  }, [activeGrowId, growDay, growWeek, currentPhase])

  const toggleTodayCheck = useCallback((checkText) => {
    const key = `${todayKey}_${activeGrowId}`
    setTodayChecks(prev => {
      const current = prev[key] || []
      const exists = current.includes(checkText)
      return { ...prev, [key]: exists ? current.filter(c => c !== checkText) : [...current, checkText] }
    })
  }, [todayKey, activeGrowId])

  const getTodayChecks = useCallback(() => {
    const key = `${todayKey}_${activeGrowId}`
    return todayChecks[key] || []
  }, [todayKey, activeGrowId, todayChecks])

  const getLogsForDate = useCallback((dateKey) => {
    return logs.filter(l => l.growId === activeGrowId && l.dateKey === dateKey)
  }, [logs, activeGrowId])

  const getLogsForGrow = useCallback((growId) => {
    return logs.filter(l => l.growId === (growId || activeGrowId))
  }, [logs, activeGrowId])

  const quickAction = useCallback((type, products = [], amount = '', note = '') => {
    const labels = {
      water: '💧 Gegossen',
      feed: '🌿 Gedüngt',
      ph_check: '📊 pH/EC geprüft',
      photo: '📷 Foto gemacht',
      note: '📝 Notiz',
      problem: '⚠️ Problem dokumentiert',
      training: '🪄 Training',
      harvest: '✂️ Geerntet',
      flush: '💧 Gespült',
    }
    return addLog({ type, title: labels[type] || type, products, amount, note })
  }, [addLog])

  return {
    grows,
    activeGrow,
    activeGrowId,
    growDay,
    growWeek,
    currentPhase,
    phaseProgress,
    logs,
    notifEnabled,
    enableNotifications,
    disableNotifications,
    growerProfile: getProfileById(growerProfileId),
    growerProfileId,
    setGrowerProfile,
    brand,
    setBrand,
    startGrow,
    endGrow,
    deleteGrow,
    addLog,
    quickAction,
    toggleTodayCheck,
    getTodayChecks,
    getLogsForDate,
    getLogsForGrow,
  }
}
