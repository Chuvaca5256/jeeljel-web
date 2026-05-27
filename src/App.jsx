import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import Home from './pages/Home'
import Apps from './pages/Apps'
import HubBionico from './pages/HubBionico'
import Mision from './pages/Mision'
import Organizaciones from './pages/Organizaciones'
import Contacto from './pages/Contacto'
import Privacidad from './pages/Privacidad'
import Terminos from './pages/Terminos'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/ollin-deportes" element={<HubBionico />} />
          <Route path="/mision" element={<Mision />} />
          <Route path="/organizaciones" element={<Organizaciones />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
