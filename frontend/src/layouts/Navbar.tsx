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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Recycle className="text-primary-foreground w-5 h-5" />
          </div>
          EcoSort
        </Link>

        <div className="hidden md:flex gap-10 text-sm font-bold text-muted-foreground">
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

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link to="/scanner">
            <Button className="rounded-full bg-primary text-primary-foreground hover:opacity-90 px-6 hidden sm:flex">
              Start Scan
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
