import { motion } from 'framer-motion'
import { NavLink, Link } from 'react-router-dom'
import { Recycle, Moon, Sun } from 'lucide-react'
import { Button } from '../components/ui/button'

interface NavbarProps {
  isDark: boolean
  setIsDark: (val: boolean) => void
}

const Navbar = ({ isDark, setIsDark }: NavbarProps) => {
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/education', label: 'Education' },
    { to: '/locations', label: 'Locations' },
    { to: '/about', label: 'About' },
    { to: '/impact', label: 'Impact' },
  ]

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="glass dark:glass-dark rounded-[2rem] px-8 py-3 flex justify-between items-center shadow-2xl shadow-black/5">
        <Link to="/" className="flex items-center gap-2.5 font-black text-xl tracking-tighter group">
          <div className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
            <Recycle className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline">EcoSort</span>
        </Link>

        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground dark:text-foreground/70">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `hover:text-primary transition-all relative py-1 ${isActive ? 'text-primary' : ''}`
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

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/scanner">
            <Button className="rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform px-6 text-[10px] font-black uppercase tracking-widest hidden sm:flex">
              Scanner
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
