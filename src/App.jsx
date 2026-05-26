import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import Stats        from './components/Stats'
import AppsGrid     from './components/AppsGrid'
import WorldCup     from './components/WorldCup'
import Mission      from './components/Mission'
import Organizations from './components/Organizations'
import Footer       from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1 — Hero con ajolote */}
        <Hero />

        {/* 2 — Franja de estadísticas */}
        <Stats />

        {/* 3 — Grid de 5 apps */}
        <AppsGrid />

        {/* 4 — Sección destacada del Mundial 2026 con contador */}
        <WorldCup />

        {/* 5 — Misión y pilares */}
        <Mission />

        {/* 6 — Organizaciones admiradas */}
        <Organizations />
      </main>
      <Footer />
    </>
  )
}
