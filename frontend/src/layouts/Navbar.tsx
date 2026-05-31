import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, Link } from 'react-router-dom'
import { Recycle, Moon, Sun, Menu, X, Camera } from 'lucide-react'
import { Button } from '../components/ui/button'

interface NavbarProps {
  isDark: boolean
  setIsDark: (val: boolean) => void
}

const Navbar = ({ isDark, setIsDark }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/education', label: 'Education' },
    { to: '/locations', label: 'Locations' },
    { to: '/about', label: 'About' },
    { to: '/impact', label: 'Impact' },
  ]

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-6xl">
      <div className="glass dark:glass-dark rounded-[2rem] px-6 md:px-8 py-3 flex justify-between items-center shadow-2xl shadow-black/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted/50 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <Link to="/" className="flex items-center gap-2.5 font-black text-xl tracking-tighter group dark:text-black">
            <div className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">EcoSort</span>
          </Link>
        </div>

        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground dark:text-black/80">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `hover:text-primary dark:hover:text-black transition-all relative py-1 ${isActive ? 'text-primary dark:text-black' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline" 
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" 
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/scanner">
            <Button className="rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform px-4 md:px-6 h-9 md:h-10 text-[10px] font-black uppercase tracking-widest">
              <span className="hidden sm:inline">Scanner</span>
              <Camera className="w-4 h-4 sm:hidden" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${
                      isActive 
                      ? 'bg-primary text-primary-foreground font-black' 
                      : 'hover:bg-muted/50 text-muted-foreground font-bold'
                    }`
                  }
                >
                  <span className="uppercase tracking-[0.2em] text-xs">{link.label}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20" />
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
