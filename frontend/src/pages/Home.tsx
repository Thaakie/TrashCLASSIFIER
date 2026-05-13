import { motion } from 'framer-motion'
import { ChevronRight, Recycle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'

const ecoTips = [
  "Botol plastik butuh waktu hingga 450 tahun untuk terurai di laut.",
  "Memilah sampah organik dapat mengurangi emisi gas metana di TPA.",
  "Satu ton kertas daur ulang dapat menyelamatkan 17 pohon dewasa.",
  "Sampah B3 seperti baterai harus dibuang ke drop box khusus.",
  "Menggunakan tas belanja kain bisa mengurangi ribuan kantong plastik per tahun."
]

const Home = () => {
  const dailyTip = ecoTips[new Date().getDate() % ecoTips.length]

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="max-w-7xl mx-auto px-8 pt-6"
    >
      <section className="py-10 lg:py-16 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 bg-muted rounded-full"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-[9px] font-black uppercase tracking-widest flex gap-2 items-center">
              <span>Tip Hari Ini:</span>
              <span className="text-muted-foreground normal-case font-medium">{dailyTip}</span>
            </p>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter text-balance">
            Future of <br /> <span className="text-primary italic">Recycling.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            Klasifikasikan sampah Anda secara instan menggunakan AI tercanggih dan temukan lokasi daur ulang terdekat di seluruh Indonesia.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link to="/scanner">
              <Button size="lg" className="rounded-full bg-primary text-primary-foreground px-8 h-14 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/10 hover:scale-105 transition-transform">
                Buka Scanner <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/education">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-[10px] font-black uppercase tracking-widest border-2">
                Pelajari Dulu
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[460px]">
            <motion.div 
              initial={{ rotate: 5, scale: 0.9 }}
              animate={{ rotate: -2, scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.02 }} 
              className="bg-card rounded-2xl p-4 shadow-2xl border border-border transition-all duration-700 relative"
            >
              <img 
                src="https://i.pinimg.com/736x/ee/15/0a/ee150a96450457914ce471ac90cda4e8.jpg" 
                className="rounded-xl w-full h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700 shadow-sm" 
                alt="Hero" 
              />
              
              <div className="absolute bottom-6 left-6 right-6 glass dark:glass-dark p-6 rounded-2xl shadow-xl border border-white/10">
                <div className="flex justify-between items-center">
                  <div className="text-foreground">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-primary">Impact Report</p>
                    <p className="text-2xl font-black tracking-tighter">64M <span className="text-xs font-medium opacity-80">Ton/Thn</span></p>
                  </div>
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg">
                    <Recycle className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home
