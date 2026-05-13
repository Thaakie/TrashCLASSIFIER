import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layouts
import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'

// Pages
import Home from './pages/Home'
import Education from './pages/Education'
import About from './pages/About'
import Impact from './pages/Impact'
import Scanner from './pages/Scanner'
import Locations from './pages/Locations'

function App() {
  const [history, setHistory] = useState<any[]>([])
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const location = useLocation()

  // Auto Scroll to Top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  // Toggle Dark Mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('trash_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const addToHistory = (item: any) => {
    const newHistory = [item, ...history].slice(0, 10)
    setHistory(newHistory)
    localStorage.setItem('trash_history', JSON.stringify(newHistory))
  }

  // Calculate Stats for Impact Page
  const stats = {
    total: history.length,
    carbon: (history.length * 0.15).toFixed(2),
    points: history.length * 15
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-muted overflow-x-hidden transition-colors duration-500">
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      
      <main className="pt-24 pb-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/education" element={<Education />} />
            <Route path="/about" element={<About />} />
            <Route path="/impact" element={<Impact history={history} stats={stats} />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/scanner" element={<Scanner addToHistory={addToHistory} />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App
