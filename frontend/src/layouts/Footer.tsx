import { Link } from 'react-router-dom'
import { Recycle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="pt-20 pb-10 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Recycle className="text-primary-foreground w-5 h-5" />
            </div>
            EcoSort
          </div>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed font-medium">
            Pelopor solusi pengelolaan sampah cerdas berbasis AI di Indonesia. 
            Membangun masa depan lingkungan yang lebih bersih dan berkelanjutan melalui teknologi Gemini 3 Flash.
          </p>
        </div>
        
        <div>
          <h4 className="font-black text-xs uppercase tracking-widest mb-6">Navigation</h4>
          <ul className="space-y-4 text-sm font-bold text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/education" className="hover:text-primary transition-colors">Education</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
            <li><Link to="/impact" className="hover:text-primary transition-colors">Impact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-xs uppercase tracking-widest mb-6">Connect</h4>
          <ul className="space-y-4 text-sm font-bold text-muted-foreground">
            <li>
              <a href="https://kiee.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Portfolio
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/m-atha-dzaki-yunada-35052131a/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> LinkedIn
              </a>
            </li>
            <li>
              <a href="https://github.com/Thaakie" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          © 2026 EcoSort Engine • Build for Future Environment
        </p>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
          <span className="hover:text-primary cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
