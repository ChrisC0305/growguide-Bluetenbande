// Nährstoffdaten basierend auf dem Assimilations-Merkzettel (pH-abhängige Aufnahme)
// Optimaler Boden-pH: 5.5–6.5 (aus Merkzettel)

export const NUTRIENTS = [
  {
    name: 'Stickstoff',
    symbol: 'N',
    category: 'Makronährstoff',
    color: '#22c55e',
    optimalPHMin: 6.0,
    optimalPHMax: 7.5,
    role: 'Aufbau von Chlorophyll, Aminosäuren und Proteinen. Unverzichtbar für Blattwachstum und grüne Farbe.',
    importance: { seedling: 2, vegetative: 5, preflower: 3, flowering: 1, lateflower: 1, flush: 0 },
    deficiency: {
      symptoms: [
        'Blätter vergilben — beginnt an alten (unteren) Blättern',
        'Blätter fallen ab',
        'Langsames Wachstum',
        'Hellgrüne bis gelbe neue Blätter',
      ],
      cause: 'Zu niedrige EC/Düngung, pH außerhalb 6.0–7.0, Überbewässerung',
      solution: 'Terra Grow erhöhen, pH auf 6.0–6.5 prüfen und korrigieren',
    },
    excess: {
      symptoms: ['Sehr dunkle, fast schwarzgrüne Blätter', 'Eingerollte Blattspitzen ("Clawing")', 'Verbrannte Blattspitzen'],
      solution: 'Düngemenge reduzieren, mit klarem Wasser spülen',
    },
    plagronProducts: ['Terra Grow'],
    phNote: 'Beste Aufnahme bei pH 6.0–7.5. Leicht sauer ist optimal.',
  },
  {
    name: 'Phosphor',
    symbol: 'P',
    category: 'Makronährstoff',
    color: '#f97316',
    optimalPHMin: 6.0,
    optimalPHMax: 7.0,
    role: 'Energietransfer (ATP), Wurzelentwicklung, Blütenbildung und Samenreifung.',
    importance: { seedling: 2, vegetative: 2, preflower: 4, flowering: 5, lateflower: 5, flush: 0 },
    deficiency: {
      symptoms: [
        'Purpurne oder rote Verfärbungen auf Blättern (Unterseite)',
        'Dunkle, bläulich-grüne Blätter',
        'Schlechte oder fehlende Blütenbildung',
        'Dünne, schwache Stiele',
      ],
      cause: 'pH unter 5.5, Kälte (unter 15°C), zu wenig Phosphordünger',
      solution: 'Terra Bloom / PK 13-14 erhöhen, pH auf 6.0+ anheben, Temperatur stabilisieren',
    },
    excess: {
      symptoms: ['Interchlorose (Mangan-Mangel als Folge)', 'Verbrannte Blattspitzen'],
      solution: 'Düngemenge reduzieren, spülen',
    },
    plagronProducts: ['Terra Bloom', 'Power Buds', 'PK 13-14', 'Power Roots'],
    phNote: 'Beste Aufnahme bei pH 6.0–7.0. Sehr schlecht unter pH 5.5.',
  },
  {
    name: 'Kalium',
    symbol: 'K',
    category: 'Makronährstoff',
    color: '#a855f7',
    optimalPHMin: 6.0,
    optimalPHMax: 7.5,
    role: 'Wasserregulierung, Enzymaktivierung, Nährstofftransport. Wichtig für Terpene, Aroma und Stressresistenz.',
    importance: { seedling: 1, vegetative: 3, preflower: 4, flowering: 5, lateflower: 5, flush: 0 },
    deficiency: {
      symptoms: [
        'Braune, verbrannte Blattränder (beginnt an alten Blättern)',
        'Gelbliche Ränder',
        'Schwache, instabile Stiele',
        'Schlechtes Aroma und Terpenprofil',
      ],
      cause: 'Zu niedriger pH, zu hohe Ca/Mg-Zufuhr blockiert Kalium',
      solution: 'Terra Bloom / PK 13-14 / Green Sensation erhöhen, pH auf 6.0–6.5 halten',
    },
    excess: {
      symptoms: ['Blockiert Kalzium- und Magnesiumaufnahme', 'Eingerollte Blattspitzen'],
      solution: 'Düngemenge reduzieren, mit klarem Wasser spülen',
    },
    plagronProducts: ['Terra Bloom', 'PK 13-14', 'Green Sensation', 'Sugar Royal'],
    phNote: 'Gute Aufnahme bei pH 6.0–7.5. Breit verfügbar.',
  },
  {
    name: 'Kalzium',
    symbol: 'Ca',
    category: 'Sekundärnährstoff',
    color: '#64748b',
    optimalPHMin: 6.2,
    optimalPHMax: 7.5,
    role: 'Zellwandstruktur, Nährstofftransport, Enzymaktivität. Unverzichtbar für gesundes Gewebe.',
    importance: { seedling: 3, vegetative: 4, preflower: 4, flowering: 3, lateflower: 2, flush: 0 },
    deficiency: {
      symptoms: [
        'Braune Flecken auf Blättern (zufällig verteilt)',
        'Deformierte, eingerollte neue Blätter',
        'Abgestorbene Blattspitzen',
        'Schwache Triebe',
      ],
      cause: 'pH unter 6.0, weiches Wasser (unter 150 ppm), Überbewässerung',
      solution: 'CalMag Pro einsetzen, pH auf mindestens 6.2 anheben',
    },
    excess: {
      symptoms: ['Blockiert Magnesium, Kalium und Bor'],
      solution: 'Düngemenge reduzieren, spülen',
    },
    plagronProducts: ['CalMag Pro'],
    phNote: 'Sehr schlecht unter pH 6.0. Optimum: 6.2–7.5.',
  },
  {
    name: 'Magnesium',
    symbol: 'Mg',
    category: 'Sekundärnährstoff',
    color: '#10b981',
    optimalPHMin: 6.0,
    optimalPHMax: 7.5,
    role: 'Zentralatom des Chlorophylls — ohne Magnesium kein Grün, keine Photosynthese.',
    importance: { seedling: 2, vegetative: 3, preflower: 3, flowering: 4, lateflower: 4, flush: 0 },
    deficiency: {
      symptoms: [
        'Gelbliche Streifen zwischen den Blattadern (Interchlorose)',
        'Blattadern bleiben grün, Blattfläche wird gelb',
        'Beginnt an alten (unteren) Blättern',
        'Blätter können lila Töne annehmen',
      ],
      cause: 'Weiches Wasser, zu hohe Kaliumzufuhr, pH unter 6.0',
      solution: 'CalMag Pro einsetzen, Vita Race als Blattspray (schnelle Hilfe)',
    },
    excess: {
      symptoms: ['Selten, aber kann Kalziumaufnahme blockieren'],
      solution: 'Düngemenge reduzieren',
    },
    plagronProducts: ['CalMag Pro', 'Vita Race'],
    phNote: 'Gute Aufnahme bei pH 6.0–7.5.',
  },
  {
    name: 'Schwefel',
    symbol: 'S',
    category: 'Sekundärnährstoff',
    color: '#eab308',
    optimalPHMin: 5.5,
    optimalPHMax: 7.0,
    role: 'Aminosäuresynthese, Terpenbildung, Enzymaktivierung. Wichtig für Aroma und Geschmack.',
    importance: { seedling: 1, vegetative: 2, preflower: 2, flowering: 3, lateflower: 4, flush: 0 },
    deficiency: {
      symptoms: [
        'Gelbe neue Blätter (beginnt oben)',
        'Ähnlich wie Stickstoffmangel, aber an neuen Blättern',
      ],
      cause: 'Selten, meist durch falschen pH oder fehlende Düngung',
      solution: 'Green Sensation in der Spätblüte liefert Schwefel',
    },
    excess: { symptoms: ['Selten'], solution: 'Düngemenge reduzieren' },
    plagronProducts: ['Green Sensation'],
    phNote: 'Breit verfügbar bei pH 5.5–7.0.',
  },
  {
    name: 'Eisen',
    symbol: 'Fe',
    category: 'Spurenelement',
    color: '#b45309',
    optimalPHMin: 5.5,
    optimalPHMax: 6.5,
    role: 'Chlorophyllsynthese, Enzymaktivierung, Elektronentransport.',
    importance: { seedling: 2, vegetative: 3, preflower: 2, flowering: 1, lateflower: 1, flush: 0 },
    deficiency: {
      symptoms: [
        'Gelbe neue Blätter oben (Chlorose)',
        'Blattadern bleiben grün auf gelbem Hintergrund',
        'Beginnt an den neuesten Blättern',
      ],
      cause: 'pH über 7.0 (häufigste Ursache!), Überbewässerung, Kälte, Bicarbonat im Wasser',
      solution: 'Vita Race sofort als Blattspray, pH auf 6.0–6.5 senken',
    },
    excess: { symptoms: ['Selten bei normalem pH'], solution: 'pH korrigieren' },
    plagronProducts: ['Vita Race'],
    phNote: '⚠️ Sehr empfindlich! Nur bei pH 5.5–6.5 verfügbar. Über pH 7.0 = sofortiger Mangel.',
  },
  {
    name: 'Mangan',
    symbol: 'Mn',
    category: 'Spurenelement',
    color: '#6366f1',
    optimalPHMin: 5.5,
    optimalPHMax: 6.5,
    role: 'Photosynthese, Chlorophyllsynthese, Stickstoffstoffwechsel.',
    importance: { seedling: 1, vegetative: 2, preflower: 1, flowering: 1, lateflower: 1, flush: 0 },
    deficiency: {
      symptoms: [
        'Ähnlich wie Eisenmangel (Interchlorose) an neuen Blättern',
        'Braune Flecken erscheinen später',
      ],
      cause: 'Zu hoher pH (über 6.5), zu viel Phosphor oder Eisen',
      solution: 'pH korrigieren, Düngermenge prüfen',
    },
    excess: { symptoms: ['Verursacht Eisenmangel'], solution: 'pH erhöhen, Dünger reduzieren' },
    plagronProducts: [],
    phNote: 'Verfügbar bei pH 5.5–6.5. Wie Eisen sehr pH-sensitiv.',
  },
  {
    name: 'Bor',
    symbol: 'B',
    category: 'Spurenelement',
    color: '#f59e0b',
    optimalPHMin: 5.5,
    optimalPHMax: 7.0,
    role: 'Zellwachstum, Zuckerverteilung, Blütenbildung.',
    importance: { seedling: 1, vegetative: 2, preflower: 2, flowering: 2, lateflower: 1, flush: 0 },
    deficiency: {
      symptoms: [
        'Dicke, spröde Stiele',
        'Hohle Stiele',
        'Deformierte neue Blätter und Triebe',
        'Schlechte Blütenentwicklung',
      ],
      cause: 'Hoher pH, trockenes Substrat, zu viel Kalzium',
      solution: 'pH auf 6.0–6.5 korrigieren, Substrat gleichmäßig feucht halten',
    },
    excess: { symptoms: ['Braune Blattränder (ähnlich Kaliummangel)'], solution: 'Spülen, Dünger reduzieren' },
    plagronProducts: [],
    phNote: 'Verfügbar bei pH 5.5–7.0.',
  },
  {
    name: 'Kupfer & Zink',
    symbol: 'Cu/Zn',
    category: 'Spurenelement',
    color: '#78716c',
    optimalPHMin: 5.5,
    optimalPHMax: 6.5,
    role: 'Enzymaktivierung, Photosynthese, Hormonregulation.',
    importance: { seedling: 1, vegetative: 1, preflower: 1, flowering: 1, lateflower: 1, flush: 0 },
    deficiency: {
      symptoms: [
        'Kupfer: Blaue oder purpurne Blätter, welke Triebe',
        'Zink: Kleine Blätter, kurze Internodien, gelbe neue Blätter',
      ],
      cause: 'pH über 7.0, zu viel Phosphor blockiert Zink',
      solution: 'pH auf 6.0–6.5 korrigieren, Spurenelement-Vollversorgung prüfen',
    },
    excess: { symptoms: ['Toxisch bei hohen Konzentrationen'], solution: 'Sofort spülen' },
    plagronProducts: [],
    phNote: 'Sehr empfindlich: pH 5.5–6.5 optimal.',
  },
]

// EC-Werte aus dem Merkzettel (PPM/EC Tabelle)
export const EC_GUIDE = {
  hydro: [
    { stage: 'Early Growth', ppmMin: 350, ppmMax: 400, ecMin: 0.7, ecMax: 0.8 },
    { stage: 'Seedling', ppmMin: 400, ppmMax: 500, ecMin: 1.0, ecMax: 1.2 },
    { stage: 'Transition', ppmMin: 550, ppmMax: 650, ecMin: 1.3, ecMax: 1.5 },
    { stage: 'Vegetative I', ppmMin: 650, ppmMax: 750, ecMin: 1.6, ecMax: 1.7 },
    { stage: 'Vegetative II', ppmMin: 750, ppmMax: 800, ecMin: 1.7, ecMax: 1.8 },
    { stage: 'Vegetative III', ppmMin: 850, ppmMax: 900, ecMin: 1.8, ecMax: 1.9 },
    { stage: 'Flowering I', ppmMin: 900, ppmMax: 950, ecMin: 1.9, ecMax: 2.0 },
    { stage: 'Flowering II', ppmMin: 950, ppmMax: 1050, ecMin: 2.0, ecMax: 2.2 },
    { stage: 'Flowering III', ppmMin: 1050, ppmMax: 1100, ecMin: 2.2, ecMax: 2.3 },
    { stage: 'Flowering IV', ppmMin: 1100, ppmMax: 1150, ecMin: 2.3, ecMax: 2.4 },
    { stage: 'Flushing', ppmMin: 0, ppmMax: 400, ecMin: 0, ecMax: 0.8 },
  ],
  soil: [
    { stage: 'Early Growth', ppmMin: 400, ppmMax: 500, ecMin: 0.8, ecMax: 1.0 },
    { stage: 'Seedling', ppmMin: 500, ppmMax: 600, ecMin: 1.0, ecMax: 1.3 },
    { stage: 'Transition', ppmMin: 600, ppmMax: 750, ecMin: 1.2, ecMax: 1.5 },
    { stage: 'Vegetative I', ppmMin: 800, ppmMax: 850, ecMin: 1.6, ecMax: 1.7 },
    { stage: 'Vegetative II', ppmMin: 850, ppmMax: 900, ecMin: 1.7, ecMax: 1.8 },
    { stage: 'Vegetative III', ppmMin: 900, ppmMax: 950, ecMin: 1.8, ecMax: 1.9 },
    { stage: 'Flowering I', ppmMin: 950, ppmMax: 1000, ecMin: 1.9, ecMax: 2.0 },
    { stage: 'Flowering II', ppmMin: 1000, ppmMax: 1050, ecMin: 2.0, ecMax: 2.1 },
    { stage: 'Flowering III', ppmMin: 1050, ppmMax: 1100, ecMin: 2.1, ecMax: 2.2 },
    { stage: 'Flowering IV', ppmMin: 1100, ppmMax: 1150, ecMin: 2.2, ecMax: 2.3 },
    { stage: 'Flushing', ppmMin: 0, ppmMax: 400, ecMin: 0, ecMax: 0.8 },
  ],
}

// VPD-Werte aus dem DimLux-Merkzettel
export const VPD_GUIDE = [
  { phase: 'Propagation / Early Veg', min: 0.4, max: 0.8, color: '#22c55e', label: 'Keimung & Sämling' },
  { phase: 'Late Veg / Early Flower', min: 0.8, max: 1.2, color: '#fbbf24', label: 'Vegetation & Vorblüte' },
  { phase: 'Mid / Late Flower', min: 1.2, max: 1.6, color: '#f472b6', label: 'Blüte & Spätblüte' },
  { phase: 'Danger Zone (zu niedrig)', min: 0, max: 0.4, color: '#ef4444', label: 'Zu niedrig — Gefahr' },
  { phase: 'Danger Zone (zu hoch)', min: 1.6, max: 3.0, color: '#ef4444', label: 'Zu hoch — Gefahr' },
]

// PPFD-Werte aus dem Licht-Merkzettel (μmol/m²/s)
export const PPFD_GUIDE = [
  { phase: 'Keimungsphase',     phaseId: 'germination', min: 100, max: 200,  color: '#86efac', note: 'Sehr schwaches Licht — Setzlinge verbrennen leicht' },
  { phase: 'Sämlingsphase',     phaseId: 'seedling',    min: 100, max: 200,  color: '#4ade80', note: 'Schwaches bis moderates Licht, kein direktes intensives Licht' },
  { phase: 'Vegetative Phase',  phaseId: 'vegetative',  min: 200, max: 400,  color: '#22c55e', note: 'Moderat bis stark — Pflanze wächst kräftig' },
  { phase: 'Blütephase',        phaseId: 'flowering',   min: 400, max: 800,  color: '#f472b6', note: 'Hoch — maximale Blütenentwicklung benötigt viel Licht' },
  { phase: 'Späte Blütephase',  phaseId: 'lateflower',  min: 600, max: 1000, color: '#fb923c', note: 'Sehr hoch — finale Reife und Harzproduktion' },
]

// EC/PPM Umrechnung (500er Skala aus Merkzettel)
export const EC_PPM_CONVERSION = {
  scale: 500,
  examples: [
    { ec: 1.0, ppm: 500 },
    { ec: 1.2, ppm: 600 },
    { ec: 1.6, ppm: 800 },
    { ec: 2.0, ppm: 1000 },
  ],
  note: 'Bei der 500er Skala: EC (mS/cm) × 500 = PPM. Beispiel: 1.6 mS/cm = 800 ppm',
  formula: 'PPM = EC × 500',
}

// Hinweis aus dem Merkzettel zur Runoff-Messung
export const SOIL_PH_GUIDE = {
  optimal: { min: 5.5, max: 6.5 },
  measureMethod: 'Runoff-Messung (Wasserabfluss-Methode)',
  measureSteps: [
    'Pflanze normal gießen — sicherstellen dass Wasser durch das Substrat fließt',
    'Ausreichend gießen bis Wasser unten aus den Drainagelöchern läuft',
    'Das ablaufende Wasser (Runoff) auffangen',
    'pH des Runoff-Wassers mit digitalem Messgerät messen',
    'Ziel: pH des Runoffs sollte 5.5–6.5 sein',
    'Wenn Runoff zu sauer (unter 5.5): Mit mehr Wasser bei pH 6.8–7.0 spülen',
    'Wenn Runoff zu alkalisch (über 6.5): Mit Wasser bei pH 5.8–6.0 korrigieren',
  ],
}
