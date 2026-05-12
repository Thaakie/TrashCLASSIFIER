import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TrashClassifier from './components/TrashClassifier'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Leaf, Recycle, AlertTriangle, Camera, ChevronRight, History as HistoryIcon, Info, Home as HomeIcon } from 'lucide-react'

type View = 'home' | 'features' | 'about' | 'history' | 'scanner'

function App() {
  const [view, setView] = useState<View>('home')
  const [history, setHistory] = useState<any[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('trash_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  // Function to add item to history (called from classifier)
  const addToHistory = (item: any) => {
    const newHistory = [item, ...history].slice(0, 10) // Keep last 10
    setHistory(newHistory)
    localStorage.setItem('trash_history', JSON.stringify(newHistory))
  }

  return (
    <div className="min-h-screen bg-[#FAF0E6] text-[#352F44] font-sans selection:bg-[#B9B4C7] overflow-x-hidden">
      {/* Navbar Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF0E6]/80 backdrop-blur-md border-b border-[#B9B4C7]/20">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div 
            className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-[#352F44] cursor-pointer"
            onClick={() => setView('home')}
          >
            <div className="w-8 h-8 bg-[#352F44] rounded-lg flex items-center justify-center">
              <Recycle className="text-white w-5 h-5" />
            </div>
            EcoSort
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold text-[#5C5470] uppercase tracking-widest">
            <button onClick={() => setView('home')} className={`hover:text-[#352F44] transition-colors ${view === 'home' ? 'text-[#352F44] border-b-2 border-[#352F44]' : ''}`}>Home</button>
            <button onClick={() => setView('features')} className={`hover:text-[#352F44] transition-colors ${view === 'features' ? 'text-[#352F44] border-b-2 border-[#352F44]' : ''}`}>Features</button>
            <button onClick={() => setView('about')} className={`hover:text-[#352F44] transition-colors ${view === 'about' ? 'text-[#352F44] border-b-2 border-[#352F44]' : ''}`}>About</button>
            <button onClick={() => setView('history')} className={`hover:text-[#352F44] transition-colors ${view === 'history' ? 'text-[#352F44] border-b-2 border-[#352F44]' : ''}`}>History</button>
          </div>
          <Button 
            className="rounded-full bg-[#352F44] hover:bg-[#5C5470] text-white px-6 hidden sm:flex"
            onClick={() => setView('scanner')}
          >
            Start Scan
          </Button>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="inline-block px-4 py-1 rounded-full bg-[#B9B4C7]/30 text-[#352F44] text-xs font-bold uppercase tracking-widest"
                >
                  AI Powered Solution
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                  Best & Smart <br /> 
                  <span className="text-[#5C5470]">Waste Sort.</span>
                </h1>
                <p className="text-lg text-[#5C5470] max-w-md leading-relaxed">
                  Solusi cerdas berbasis Gemini 3 Flash untuk klasifikasi sampah otomatis di Indonesia. 
                  Membantu Anda memilah sampah dengan presisi tinggi dan edukasi yang tepat.
                </p>
                <div className="flex gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      className="rounded-full bg-[#352F44] hover:bg-[#5C5470] text-white px-8 h-14 text-lg shadow-xl shadow-[#352F44]/20 transition-shadow hover:shadow-[#352F44]/40"
                      onClick={() => setView('scanner')}
                    >
                      Start Scanning <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              {/* Hero Image - No Auto Animation, Hover Only */}
              <div className="relative">
                <div className="w-full aspect-square bg-[#B9B4C7]/20 rounded-[4rem] rotate-3 absolute inset-0 -z-10" />
                <motion.div 
                  className="bg-white rounded-[3rem] p-8 shadow-2xl border border-[#B9B4C7]/30"
                  style={{ rotate: -2 }}
                  whileHover={{ 
                    rotate: 0, 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300, damping: 15 }
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800" 
                    alt="Eco Waste" 
                    className="rounded-2xl w-full h-full object-cover shadow-inner"
                  />
                </motion.div>
                
                {/* Impact Mini Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-[#352F44] text-white p-6 rounded-3xl shadow-2xl max-w-[200px]"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#B9B4C7] mb-2">IDN Waste Urgency</p>
                  <p className="text-xl font-black leading-tight">64M <span className="text-sm font-normal text-[#B9B4C7]">Tons/Year</span></p>
                  <p className="text-[9px] mt-2 text-[#B9B4C7] leading-tight">Indonesia darurat sampah. Mari mulai memilah dari sekarang.</p>
                </motion.div>
              </div>
            </section>


            </motion.div>
          )}

          {view === 'features' && (
            <motion.div key="features" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-8 py-12">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-5xl font-black tracking-tighter">Waste Categories</h2>
                <p className="text-[#5C5470] max-w-2xl mx-auto">Kenali jenis sampah Anda untuk proses pengelolaan yang lebih bertanggung jawab.</p>
                <div className="w-12 h-2 bg-[#352F44] mx-auto rounded-full" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-8 border-none shadow-xl bg-white group transition-all hover:-translate-y-2">
                  <Leaf className="w-12 h-12 text-emerald-500 mb-6" />
                  <CardTitle className="mb-4 text-2xl font-black">Sampah Organik</CardTitle>
                  <p className="text-[#5C5470] text-sm leading-relaxed mb-4">Limbah hayati yang berasal dari alam dan mudah terurai secara alami.</p>
                  <ul className="text-xs space-y-2 text-emerald-700 font-bold">
                    <li>• Sisa Makanan & Sayuran</li>
                    <li>• Dedaunan Kering</li>
                    <li>• Kulit Buah & Ranting</li>
                  </ul>
                </Card>

                <Card className="p-8 border-none shadow-xl bg-white group transition-all hover:-translate-y-2">
                  <Recycle className="w-12 h-12 text-[#352F44] mb-6" />
                  <CardTitle className="mb-4 text-2xl font-black">Sampah Anorganik</CardTitle>
                  <p className="text-[#5C5470] text-sm leading-relaxed mb-4">Limbah buatan manusia yang sulit terurai namun dapat didaur ulang menjadi produk baru.</p>
                  <ul className="text-xs space-y-2 text-[#352F44] font-bold">
                    <li>• Botol Plastik & Kaleng</li>
                    <li>• Kertas & Kardus</li>
                    <li>• Kaca & Logam</li>
                  </ul>
                </Card>

                <Card className="p-8 border-none shadow-xl bg-[#352F44] text-white group transition-all hover:-translate-y-2">
                  <AlertTriangle className="w-12 h-12 text-rose-500 mb-6 animate-pulse" />
                  <CardTitle className="mb-4 text-2xl font-black">Limbah B3</CardTitle>
                  <p className="text-[#B9B4C7] text-sm leading-relaxed mb-4">Bahan Berbahaya dan Beracun. Limbah yang mengandung zat kimia yang dapat merusak lingkungan dan kesehatan.</p>
                  <div className="bg-[#5C5470]/50 p-4 rounded-xl border border-rose-500/30">
                    <p className="text-[10px] font-black uppercase text-rose-400 mb-2">Penting:</p>
                    <ul className="text-xs space-y-2 text-[#FAF0E6]">
                      <li>• Baterai & Lampu Neon</li>
                      <li>• Limbah Elektronik (E-waste)</li>
                      <li>• Obat Kadaluwarsa & Pestisida</li>
                    </ul>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}


          {view === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-8 py-12 text-center">
              <h2 className="text-5xl font-black tracking-tighter mb-8">About EcoSort</h2>
              <div className="space-y-6 text-lg text-[#5C5470] leading-relaxed text-left bg-white p-12 rounded-[3rem] shadow-xl">
                <p>EcoSort adalah proyek inovasi yang menggabungkan kepedulian lingkungan dengan teknologi kecerdasan buatan (Artificial Intelligence) tercanggih saat ini.</p>
                <p>Misi kami adalah membantu masyarakat Indonesia mempermudah proses pemilahan sampah di rumah tangga, mengurangi penumpukan sampah di TPA, dan mendukung ekonomi sirkular melalui edukasi yang tepat.</p>
                <p>Ditenagai oleh <strong>Gemini 3 Flash</strong>, EcoSort mampu mengenali ribuan jenis material sampah secara akurat dalam hitungan detik.</p>
              </div>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-8 py-12">
              <h2 className="text-5xl font-black tracking-tighter mb-12">Scan History</h2>
              {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] shadow-inner border-2 border-dashed border-[#B9B4C7]">
                  <HistoryIcon className="w-16 h-16 mx-auto text-[#B9B4C7] mb-4 opacity-50" />
                  <p className="text-[#5C5470]">Belum ada riwayat scan. Mulai memotret sekarang!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ x: -20, opacity: 0 }} 
                      animate={{ x: 0, opacity: 1 }} 
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-2xl shadow-md border border-[#B9B4C7]/20 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-bold text-xl">{item.item}</h3>
                        <p className="text-sm text-[#5C5470]">{item.kategori} • {new Date().toLocaleDateString()}</p>
                      </div>
                      <div className={`px-4 py-1 rounded-full text-xs font-bold text-white ${
                        item.kategori === 'Organik' ? 'bg-emerald-500' : 
                        item.kategori === 'Anorganik' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}>
                        {item.warna_tong}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === 'scanner' && (
            <motion.div key="scanner" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-7xl mx-auto px-8 py-6">
              <TrashClassifier onResultSaved={addToHistory} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-[#5C5470] text-xs font-bold uppercase tracking-widest border-t border-[#B9B4C7]/20">
        © 2026 EcoSort • Indonesia Bersih
      </footer>
    </div>
  )
}

export default App
