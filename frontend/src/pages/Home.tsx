import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
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
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="max-w-7xl mx-auto px-8"
    >
      <section className="max-w-7xl mx-auto py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full group hover:bg-accent/20 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest text-accent flex gap-2 items-center">
              <span>Daily Tip:</span>
              <span className="text-foreground opacity-80 normal-case italic font-medium">"{dailyTip}"</span>
            </p>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
            Sort Waste. <br /> <span className="text-muted-foreground">Save Earth.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
            Platform klasifikasi sampah tercanggih di Indonesia. Gunakan AI untuk masa depan bumi yang lebih hijau.
          </p>
          
          <Link to="/scanner">
            <Button size="lg" className="rounded-full bg-primary text-primary-foreground px-10 h-16 text-lg font-bold shadow-xl shadow-primary/20">
              Mulai Sekarang <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[420px]">
            <div className="absolute inset-0 bg-accent/20 rounded-[4rem] rotate-6 -z-10" />
            <motion.div whileHover={{ rotate: 0, scale: 1.02 }} className="bg-card rounded-[3rem] p-5 shadow-2xl border border-border transform -rotate-3 transition-all duration-500 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800" 
                className="rounded-[2.5rem] w-full h-[400px] object-cover" 
                alt="Hero" 
              />
              
              <div className="absolute bottom-5 left-5 right-5 bg-primary/95 backdrop-blur-sm text-primary-foreground p-5 rounded-3xl shadow-2xl border border-white/10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">IDN Waste Urgency</p>
                    <p className="text-2xl font-black">64M <span className="text-sm font-normal opacity-70">Tons/Year</span></p>
                  </div>
                  <p className="text-[9px] max-w-[100px] text-right opacity-70 leading-tight font-bold uppercase">
                    Mari bantu kurangi angka ini bersama EcoSort.
                  </p>
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
