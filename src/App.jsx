import { useState } from 'react'
import { useGrow } from './hooks/useGrow.js'
import Header from './components/Header.jsx'
import Navigation from './components/Navigation.jsx'
import Dashboard from './components/Dashboard.jsx'
import GrowSetup from './components/GrowSetup.jsx'
import GrowCalendar from './components/GrowCalendar.jsx'
import NutrientGuide from './components/NutrientGuide.jsx'
import Settings from './components/Settings.jsx'

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const grow = useGrow()

  const showSetup = tab === 'dashboard' && !grow.activeGrow

  return (
    <div className="app">
      <Header grow={grow} />

      {showSetup ? (
        <GrowSetup onStart={grow.startGrow} />
      ) : (
        <>
          {tab === 'dashboard' && <Dashboard grow={grow} />}
          {tab === 'calendar' && <GrowCalendar grow={grow} />}
          {tab === 'nutrients' && <NutrientGuide grow={grow} />}
          {tab === 'settings' && <Settings grow={grow} />}
        </>
      )}
      <Navigation active={tab} onChange={setTab} hasGrow={!!grow.activeGrow} />
    </div>
  )
}
