import { useCallback, useMemo, useState } from 'react'
import { Preloader } from '@/components/Preloader'
import { Cursor } from '@/components/Cursor'
import { Nav } from '@/components/Nav'
import { Grain, GridOverlay, ScrollRail, ShortcutHint } from '@/components/Chrome'
import { Hero } from '@/sections/Hero'
import { IndexSection } from '@/sections/Index'
import { Work } from '@/sections/Work'
import { Capabilities } from '@/sections/Capabilities'
import { Trajectory } from '@/sections/Trajectory'
import { Certificates } from '@/sections/Certificates'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'
import { useActiveSection } from '@/lib/hooks'
import { useSmoothScroll } from '@/lib/scroll'

const SECTIONS = [
  { id: 'index', label: 'Index' },
  { id: 'work', label: 'Work' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'trajectory', label: 'Trajectory' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
]

export default function App() {
  const [ready, setReady] = useState(false)
  const ids = useMemo(() => SECTIONS.map((s) => s.id), [])
  const active = useActiveSection(ids)

  useSmoothScroll()

  const onLoaded = useCallback(() => setReady(true), [])

  return (
    <>
      <Preloader onDone={onLoaded} />
      <Cursor />
      <Grain />
      <GridOverlay />

      <Nav sections={SECTIONS} active={active} />
      <ScrollRail sections={SECTIONS} active={active} />

      <main id="main">
        <Hero ready={ready} />
        <IndexSection />
        <Work />
        <Capabilities />
        <Trajectory />
        <Certificates />
        <Contact />
      </main>

      <Footer />
      <ShortcutHint />
    </>
  )
}
