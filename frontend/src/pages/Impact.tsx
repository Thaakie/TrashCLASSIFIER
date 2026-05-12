import { motion } from 'framer-motion'
import { Recycle, BarChart3, Leaf, ShieldCheck, History as HistoryIcon } from 'lucide-react'

interface ImpactProps {
  history: any[]
  stats: {
    total: number
    carbon: string
    points: number
  }
}

const Impact = ({ history, stats }: ImpactProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto px-8 py-12"
    >
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Title & Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter mb-4">Eco Dashboard</h2>
            <p className="text-muted-foreground font-medium">Lacak kontribusi positifmu untuk lingkungan.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-primary text-primary-foreground p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <BarChart3 className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Scanned</p>
              <p className="text-4xl font-black tracking-tighter">
                {stats.total} <span className="text-lg opacity-60 font-medium tracking-normal">Items</span>
              </p>
            </div>

            <div className="bg-card p-8 rounded-[3rem] shadow-xl border border-border relative overflow-hidden group">
              <Leaf className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500 opacity-10 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">CO2 Saved</p>
              <p className="text-4xl font-black text-emerald-600 tracking-tighter">
                {stats.carbon} <span className="text-lg opacity-60 font-medium text-muted-foreground tracking-normal">kg</span>
              </p>
            </div>

            <div className="bg-card p-8 rounded-[3rem] shadow-xl border border-border relative overflow-hidden group">
              <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500 opacity-10 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Eco Points</p>
              <p className="text-4xl font-black text-blue-600 tracking-tighter">
                {stats.points} <span className="text-lg opacity-60 font-medium text-muted-foreground tracking-normal">Pts</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-8 bg-card/50 border border-border rounded-[4rem] p-8 min-h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Activities</p>
            {history.length > 0 && (
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full">LIVE UPDATE</span>
            )}
          </div>

          <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar space-y-4 max-h-[650px]">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20 space-y-6">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <HistoryIcon className="w-10 h-10 text-muted-foreground opacity-30" />
                </div>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Belum ada riwayat aktivitas</p>
              </div>
            ) : (
              history.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: i * 0.05 }} 
                  className="bg-card p-6 rounded-[2.5rem] shadow-md border border-border flex justify-between items-center group hover:bg-muted/30 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      item.kategori === 'Organik' ? 'bg-emerald-500/10 text-emerald-600' : 
                      item.kategori === 'Anorganik' ? 'bg-amber-500/10 text-amber-600' : 
                      'bg-rose-500/10 text-rose-600'
                    }`}>
                      <Recycle className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg tracking-tight">{item.item}</h3>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        {item.kategori} • Tong {item.warna_tong}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-foreground">+15</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Points</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Impact
